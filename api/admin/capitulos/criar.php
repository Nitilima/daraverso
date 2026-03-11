<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados      = getPostData();
$historiaId = (int) ($dados['historia_id'] ?? 0);
$titulo     = trim($dados['titulo']        ?? '');
$conteudo   = trim($dados['conteudo']      ?? '');

if (!$historiaId || !$titulo || !$conteudo) {
    jsonResponse(['erro' => 'historia_id, titulo e conteudo sao obrigatorios'], 400);
}

// Define a próxima ordem automaticamente
$stmtOrdem = $pdo->prepare("SELECT COALESCE(MAX(ordem), 0) + 1 AS proxima FROM capitulos WHERE historia_id = ?");
$stmtOrdem->execute([$historiaId]);
$ordem = (int) $stmtOrdem->fetch()['proxima'];

$stmt = $pdo->prepare("INSERT INTO capitulos (historia_id, titulo, conteudo, ordem) VALUES (?, ?, ?, ?)");
$stmt->execute([$historiaId, $titulo, $conteudo, $ordem]);

jsonResponse(['sucesso' => true, 'id' => $pdo->lastInsertId(), 'ordem' => $ordem], 201);
