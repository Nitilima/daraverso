<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$dados = getPostData();
$email = trim($dados['email'] ?? '');
$senha = trim($dados['senha'] ?? '');

if (!$email || !$senha) {
    jsonResponse(['erro' => 'Email e senha sao obrigatorios'], 400);
}

$pdo = getConnection();

// Busca o usuario pelo email
$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$usuario = $stmt->fetch();

// Verifica se o usuario existe e se a senha esta correta
if (!$usuario || !password_verify($senha, $usuario['senha'])) {
    jsonResponse(['erro' => 'Email ou senha incorretos'], 401);
}

// Gera um token unico de 64 caracteres
$token = bin2hex(random_bytes(32));
$expiracao = date('Y-m-d H:i:s', strtotime('+30 days'));

// Salva a sessao no banco
$stmt = $pdo->prepare("INSERT INTO sessoes (usuario_id, token, expires_at) VALUES (?, ?, ?)");
$stmt->execute([$usuario['id'], $token, $expiracao]);

jsonResponse([
    'sucesso' => true,
    'token'   => $token,
    'usuario' => [
        'id'       => $usuario['id'],
        'nome'     => $usuario['nome'],
        'email'    => $usuario['email'],
        'is_admin' => (bool) $usuario['is_admin']
    ]
]);
