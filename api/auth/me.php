<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
$usuario = autenticarUsuario($pdo);

jsonResponse([
    'sucesso' => true,
    'usuario' => [
        'id'       => $usuario['id'],
        'nome'     => $usuario['nome'],
        'email'    => $usuario['email'],
        'is_admin' => (bool) $usuario['is_admin']
    ]
]);
