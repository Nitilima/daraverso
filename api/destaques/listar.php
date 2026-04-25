<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Método não permitido'], 405);
}

$pdo = getConnection();

$stmt = $pdo->query("
    SELECT d.id, d.titulo, d.descricao, d.imagem_url, d.ordem,
           h.slug AS historia_slug
    FROM destaques d
    LEFT JOIN historias h ON h.id = d.historia_id
    WHERE d.ativo = 1
    ORDER BY d.ordem ASC
");

jsonResponse($stmt->fetchAll());
