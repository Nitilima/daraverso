<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$token = getBearerToken();
if (!$token) {
    jsonResponse(['erro' => 'Token nao fornecido'], 401);
}

$pdo = getConnection();

// Remove a sessao do banco (invalida o token)
$stmt = $pdo->prepare("DELETE FROM sessoes WHERE token = ?");
$stmt->execute([$token]);

jsonResponse(['sucesso' => true]);
