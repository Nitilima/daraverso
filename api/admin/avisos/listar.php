<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$stmt = $pdo->query("SELECT id, nome, slug FROM avisos ORDER BY nome ASC");
$avisos = $stmt->fetchAll();

jsonResponse(['sucesso' => true, 'avisos' => $avisos]);
