<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonResponse(['erro' => 'Método não permitido'], 405); }

$pdo = getConnection();
autenticarAdmin($pdo);

$dados = getPostData();
$nome  = trim($dados['nome'] ?? '');
if (!$nome) { jsonResponse(['erro' => 'Nome é obrigatório'], 400); }

$slug = slugify($nome);
$stmt = $pdo->prepare("INSERT INTO personagens (nome, slug) VALUES (?, ?)");
$stmt->execute([$nome, $slug]);

jsonResponse(['sucesso' => true, 'id' => $pdo->lastInsertId()], 201);
