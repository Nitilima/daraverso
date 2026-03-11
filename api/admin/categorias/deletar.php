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

$stmt = $pdo->prepare("SELECT id FROM categorias WHERE id = ?");
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    jsonResponse(['erro' => 'Categoria nao encontrada'], 404);
}

// ON DELETE CASCADE remove a categoria de todas as historias automaticamente
$pdo->prepare("DELETE FROM categorias WHERE id = ?")->execute([$id]);

jsonResponse(['sucesso' => true]);
