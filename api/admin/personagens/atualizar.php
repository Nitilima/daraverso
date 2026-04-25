<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') { jsonResponse(['erro' => 'Método não permitido'], 405); }

$pdo = getConnection();
autenticarAdmin($pdo);

$dados = getPostData();
$id    = (int) ($dados['id']   ?? 0);
$nome  = trim($dados['nome']   ?? '');
if (!$id || !$nome) { jsonResponse(['erro' => 'id e nome são obrigatórios'], 400); }

$slug = slugify($nome);
$stmt = $pdo->prepare("UPDATE personagens SET nome = ?, slug = ? WHERE id = ?");
$stmt->execute([$nome, $slug, $id]);

jsonResponse(['sucesso' => true]);
