<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
$usuario = autenticarUsuario($pdo);

$dados = getPostData();
$historiaId = (int) ($dados['historia_id'] ?? 0);

if (!$historiaId) {
    jsonResponse(['erro' => 'historia_id e obrigatorio'], 400);
}

$stmt = $pdo->prepare("
    DELETE FROM historias_lidas
    WHERE usuario_id = ? AND historia_id = ?
");
$stmt->execute([$usuario['id'], $historiaId]);

jsonResponse(['sucesso' => true]);
