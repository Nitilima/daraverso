<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
$usuario = autenticarUsuario($pdo);

// Retorna todas as historias que o usuario marcou como lida
$stmt = $pdo->prepare("
    SELECT
        h.id, h.titulo, h.slug, h.capa_url, h.data_publicacao,
        hl.lida_em,
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'nome', c.nome, 'slug', c.slug))
            FROM historia_categorias hc
            JOIN categorias c ON c.id = hc.categoria_id
            WHERE hc.historia_id = h.id
        ) AS categorias
    FROM historias_lidas hl
    JOIN historias h ON h.id = hl.historia_id
    WHERE hl.usuario_id = ?
    ORDER BY hl.lida_em DESC
");
$stmt->execute([$usuario['id']]);
$historias = $stmt->fetchAll();

foreach ($historias as &$h) {
    $h['categorias'] = $h['categorias'] ? json_decode($h['categorias']) : [];
}

jsonResponse(['sucesso' => true, 'historias' => $historias]);
