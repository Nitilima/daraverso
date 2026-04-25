<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Método não permitido'], 405);
}

$pdo  = getConnection();
$stmt = $pdo->query("SELECT id, nome, slug FROM personagens ORDER BY nome ASC");
jsonResponse($stmt->fetchAll());
