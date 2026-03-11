<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$historiaId = (int) ($_GET['historia_id'] ?? 0);

if (!$historiaId) {
    jsonResponse(['erro' => 'historia_id e obrigatorio'], 400);
}

$pdo = getConnection();

$stmt = $pdo->prepare("
    SELECT id, historia_id, titulo, ordem, created_at
    FROM capitulos
    WHERE historia_id = ?
    ORDER BY ordem ASC
");
$stmt->execute([$historiaId]);
$capitulos = $stmt->fetchAll();

jsonResponse(['sucesso' => true, 'capitulos' => $capitulos]);
