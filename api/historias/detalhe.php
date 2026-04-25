<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Método não permitido'], 405);
}

$slug = $_GET['slug'] ?? null;
if (!$slug) {
    jsonResponse(['erro' => 'Slug não informado'], 400);
}

$pdo = getConnection();

$stmt = $pdo->prepare("SELECT id, titulo, slug, sinopse, capa_url, classificacao_etaria, created_at FROM historias WHERE slug = ? AND publicada = 1");
$stmt->execute([$slug]);
$historia = $stmt->fetch();

if (!$historia) {
    jsonResponse(['erro' => 'História não encontrada'], 404);
}

$id = $historia['id'];

$s = $pdo->prepare("SELECT c.nome, c.slug FROM categorias c JOIN historia_categorias hc ON hc.categoria_id = c.id WHERE hc.historia_id = ?");
$s->execute([$id]);
$historia['categorias'] = $s->fetchAll();

$s = $pdo->prepare("SELECT t.nome, t.slug FROM tipos t JOIN historia_tipos ht ON ht.tipo_id = t.id WHERE ht.historia_id = ?");
$s->execute([$id]);
$historia['tipos'] = $s->fetchAll();

$s = $pdo->prepare("SELECT p.nome, p.slug FROM personagens p JOIN historia_personagens hp ON hp.personagem_id = p.id WHERE hp.historia_id = ?");
$s->execute([$id]);
$historia['personagens'] = $s->fetchAll();

$s = $pdo->prepare("SELECT a.nome, a.slug FROM avisos a JOIN historia_avisos ha ON ha.aviso_id = a.id WHERE ha.historia_id = ?");
$s->execute([$id]);
$historia['avisos'] = $s->fetchAll();

$s = $pdo->prepare("SELECT id, titulo, ordem FROM capitulos WHERE historia_id = ? ORDER BY ordem ASC");
$s->execute([$id]);
$historia['capitulos'] = $s->fetchAll();

jsonResponse($historia);
