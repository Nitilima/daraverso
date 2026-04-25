<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonResponse(['erro' => 'Método não permitido'], 405); }

$pdo = getConnection();
autenticarAdmin($pdo);

$dados      = getPostData();
$titulo     = trim($dados['titulo']      ?? '');
$descricao  = trim($dados['descricao']   ?? '');
$imagem_url = trim($dados['imagem_url']  ?? '');
$historiaId = $dados['historia_id']      ?? null;
$ordem      = (int) ($dados['ordem']     ?? 1);
$ativo      = (int) ($dados['ativo']     ?? 1);

if (!$titulo) { jsonResponse(['erro' => 'Título é obrigatório'], 400); }

$stmt = $pdo->prepare("INSERT INTO destaques (titulo, descricao, imagem_url, historia_id, ordem, ativo) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->execute([$titulo, $descricao ?: null, $imagem_url ?: null, $historiaId ?: null, $ordem, $ativo]);

jsonResponse(['sucesso' => true, 'id' => $pdo->lastInsertId()], 201);
