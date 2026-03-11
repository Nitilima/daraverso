<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$dados = getPostData();
$nome  = trim($dados['nome']  ?? '');
$email = trim($dados['email'] ?? '');
$senha = trim($dados['senha'] ?? '');

// Validacoes basicas
if (!$nome || !$email || !$senha) {
    jsonResponse(['erro' => 'Nome, email e senha sao obrigatorios'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['erro' => 'Email invalido'], 400);
}
if (strlen($senha) < 6) {
    jsonResponse(['erro' => 'A senha deve ter pelo menos 6 caracteres'], 400);
}

$pdo = getConnection();

// Verifica se o email ja esta em uso
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(['erro' => 'Este email ja esta em uso'], 409);
}

// Criptografa a senha com bcrypt
$senhaHash = password_hash($senha, PASSWORD_BCRYPT);

// Cria o usuario
$stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
$stmt->execute([$nome, $email, $senhaHash]);
$id = $pdo->lastInsertId();

jsonResponse([
    'sucesso' => true,
    'usuario' => ['id' => $id, 'nome' => $nome, 'email' => $email]
], 201);
