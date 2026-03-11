<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$id = (int) ($_GET['id'] ?? 0);

if (!$id) {
    jsonResponse(['erro' => 'id e obrigatorio'], 400);
}

$stmt = $pdo->prepare("
    SELECT
        h.id, h.titulo, h.slug, h.sinopse, h.capa_url,
        h.classificacao_etaria, h.publicada, h.data_publicacao,
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'nome', c.nome, 'slug', c.slug))
            FROM historia_categorias hc
            JOIN categorias c ON c.id = hc.categoria_id
            WHERE hc.historia_id = h.id
        ) AS categorias,
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'nome', a.nome, 'slug', a.slug))
            FROM historia_avisos ha
            JOIN avisos a ON a.id = ha.aviso_id
            WHERE ha.historia_id = h.id
        ) AS avisos
    FROM historias h
    WHERE h.id = ?
");
$stmt->execute([$id]);
$historia = $stmt->fetch();

if (!$historia) {
    jsonResponse(['erro' => 'Historia nao encontrada'], 404);
}

$historia['categorias'] = $historia['categorias'] ? json_decode($historia['categorias']) : [];
$historia['avisos']     = $historia['avisos']     ? json_decode($historia['avisos'])     : [];
$historia['publicada']  = (bool) $historia['publicada'];

jsonResponse(['sucesso' => true, 'historia' => $historia]);
