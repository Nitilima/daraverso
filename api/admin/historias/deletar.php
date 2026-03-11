<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados = getPostData();
$id    = (int) ($dados['id'] ?? 0);

if (!$id) {
    jsonResponse(['erro' => 'id e obrigatorio'], 400);
}

$stmt = $pdo->prepare("SELECT id FROM historias WHERE id = ?");
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    jsonResponse(['erro' => 'Historia nao encontrada'], 404);
}

// ON DELETE CASCADE remove automaticamente os registros em
// historia_categorias e historias_lidas
$pdo->prepare("DELETE FROM historias WHERE id = ?")->execute([$id]);

jsonResponse(['sucesso' => true]);
