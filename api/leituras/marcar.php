<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
$usuario = autenticarUsuario($pdo);

$dados = getPostData();
$historiaId = (int) ($dados['historia_id'] ?? 0);

if (!$historiaId) {
    jsonResponse(['erro' => 'historia_id e obrigatorio'], 400);
}

// Verifica se a historia existe e esta publicada
$stmt = $pdo->prepare("SELECT id FROM historias WHERE id = ? AND publicada = 1");
$stmt->execute([$historiaId]);
if (!$stmt->fetch()) {
    jsonResponse(['erro' => 'Historia nao encontrada'], 404);
}

// INSERT IGNORE evita erro caso o usuario ja tenha marcado essa historia
$stmt = $pdo->prepare("
    INSERT IGNORE INTO historias_lidas (usuario_id, historia_id)
    VALUES (?, ?)
");
$stmt->execute([$usuario['id'], $historiaId]);

jsonResponse(['sucesso' => true]);
