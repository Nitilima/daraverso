<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$subcategorias = "
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'nome', c.nome, 'slug', c.slug))
        FROM historia_categorias hc
        JOIN categorias c ON c.id = hc.categoria_id
        WHERE hc.historia_id = h.id
    ) AS categorias
";

$subavisos = "
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'nome', a.nome, 'slug', a.slug))
        FROM historia_avisos ha
        JOIN avisos a ON a.id = ha.aviso_id
        WHERE ha.historia_id = h.id
    ) AS avisos
";

// Busca uma historia especifica por ID (para edicao)
if (!empty($_GET['id'])) {
    $stmt = $pdo->prepare("
        SELECT h.id, h.titulo, h.slug, h.sinopse, h.capa_url,
               h.classificacao_etaria, h.publicada, h.data_publicacao,
               $subcategorias, $subavisos
        FROM historias h
        WHERE h.id = ?
    ");
    $stmt->execute([(int) $_GET['id']]);
    $historia = $stmt->fetch();

    if (!$historia) {
        jsonResponse(['erro' => 'Historia nao encontrada'], 404);
    }

    $historia['categorias'] = $historia['categorias'] ? json_decode($historia['categorias']) : [];
    $historia['avisos']     = $historia['avisos']     ? json_decode($historia['avisos'])     : [];
    $historia['publicada']  = (bool) $historia['publicada'];

    jsonResponse(['sucesso' => true, 'historia' => $historia]);
}

// Lista todas as historias (sem conteudo para nao sobrecarregar)
$stmt = $pdo->query("
    SELECT h.id, h.titulo, h.slug, h.capa_url, h.publicada,
           h.data_publicacao, h.created_at,
           $subcategorias
    FROM historias h
    ORDER BY h.created_at DESC
");
$historias = $stmt->fetchAll();

foreach ($historias as &$h) {
    $h['categorias'] = $h['categorias'] ? json_decode($h['categorias']) : [];
    $h['publicada']  = (bool) $h['publicada'];
}

jsonResponse(['sucesso' => true, 'historias' => $historias]);
