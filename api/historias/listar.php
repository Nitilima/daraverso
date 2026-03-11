<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();

$where  = "WHERE h.publicada = 1";
$params = [];

// Filtro opcional por categoria
if (!empty($_GET['categoria_id'])) {
    $where .= " AND EXISTS (
        SELECT 1 FROM historia_categorias hc
        WHERE hc.historia_id = h.id AND hc.categoria_id = ?
    )";
    $params[] = (int) $_GET['categoria_id'];
}

$stmt = $pdo->prepare("
    SELECT
        h.id, h.titulo, h.slug, h.sinopse, h.capa_url,
        h.classificacao_etaria, h.data_publicacao,
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
    $where
    ORDER BY h.data_publicacao DESC
");
$stmt->execute($params);
$historias = $stmt->fetchAll();

foreach ($historias as &$h) {
    $h['categorias'] = $h['categorias'] ? json_decode($h['categorias']) : [];
    $h['avisos']     = $h['avisos']     ? json_decode($h['avisos'])     : [];
}

jsonResponse(['sucesso' => true, 'historias' => $historias]);
