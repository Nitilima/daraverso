<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$stmt = $pdo->query("SELECT id, nome, slug, created_at FROM categorias ORDER BY nome ASC");
$categorias = $stmt->fetchAll();

jsonResponse(['sucesso' => true, 'categorias' => $categorias]);
