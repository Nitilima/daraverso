<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados = getPostData();
$nome  = trim($dados['nome'] ?? '');

if (!$nome) {
    jsonResponse(['erro' => 'Nome e obrigatorio'], 400);
}

// Gera slug unico
$slug     = slugify($nome);
$slugBase = $slug;
$contador = 1;
while (true) {
    $stmt = $pdo->prepare("SELECT id FROM categorias WHERE slug = ?");
    $stmt->execute([$slug]);
    if (!$stmt->fetch()) break;
    $slug = $slugBase . '-' . $contador++;
}

$stmt = $pdo->prepare("INSERT INTO categorias (nome, slug) VALUES (?, ?)");
$stmt->execute([$nome, $slug]);
$id = $pdo->lastInsertId();

jsonResponse(['sucesso' => true, 'id' => $id, 'slug' => $slug], 201);
