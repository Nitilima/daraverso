<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados    = getPostData();
$id       = (int) ($dados['id']       ?? 0);
$titulo   = trim($dados['titulo']     ?? '');
$conteudo = trim($dados['conteudo']   ?? '');

if (!$id || !$titulo || !$conteudo) {
    jsonResponse(['erro' => 'id, titulo e conteudo sao obrigatorios'], 400);
}

$stmt = $pdo->prepare("UPDATE capitulos SET titulo = ?, conteudo = ? WHERE id = ?");
$stmt->execute([$titulo, $conteudo, $id]);

jsonResponse(['sucesso' => true]);
