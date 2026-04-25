<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') { jsonResponse(['erro' => 'Método não permitido'], 405); }

$pdo = getConnection();
autenticarAdmin($pdo);

$dados      = getPostData();
$id         = (int) ($dados['id']        ?? 0);
$titulo     = trim($dados['titulo']      ?? '');
$descricao  = trim($dados['descricao']   ?? '');
$imagem_url = trim($dados['imagem_url']  ?? '');
$historiaId = $dados['historia_id']      ?? null;
$ordem      = (int) ($dados['ordem']     ?? 1);
$ativo      = (int) ($dados['ativo']     ?? 1);

if (!$id || !$titulo) { jsonResponse(['erro' => 'id e título são obrigatórios'], 400); }

$stmt = $pdo->prepare("UPDATE destaques SET titulo = ?, descricao = ?, imagem_url = ?, historia_id = ?, ordem = ?, ativo = ? WHERE id = ?");
$stmt->execute([$titulo, $descricao ?: null, $imagem_url ?: null, $historiaId ?: null, $ordem, $ativo, $id]);

jsonResponse(['sucesso' => true]);
