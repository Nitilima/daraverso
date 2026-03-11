<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados = getPostData();
$id    = (int) ($dados['id']   ?? 0);
$nome  = trim($dados['nome'] ?? '');

if (!$id || !$nome) {
    jsonResponse(['erro' => 'id e nome sao obrigatorios'], 400);
}

$stmt = $pdo->prepare("SELECT id FROM categorias WHERE id = ?");
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    jsonResponse(['erro' => 'Categoria nao encontrada'], 404);
}

// Gera novo slug unico (ignora o proprio registro)
$slug     = slugify($nome);
$slugBase = $slug;
$contador = 1;
while (true) {
    $stmt = $pdo->prepare("SELECT id FROM categorias WHERE slug = ? AND id != ?");
    $stmt->execute([$slug, $id]);
    if (!$stmt->fetch()) break;
    $slug = $slugBase . '-' . $contador++;
}

$pdo->prepare("UPDATE categorias SET nome = ?, slug = ? WHERE id = ?")->execute([$nome, $slug, $id]);

jsonResponse(['sucesso' => true]);
