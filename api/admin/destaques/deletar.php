<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') { jsonResponse(['erro' => 'Método não permitido'], 405); }

$pdo = getConnection();
autenticarAdmin($pdo);

$id = (int) ($_GET['id'] ?? 0);
if (!$id) { jsonResponse(['erro' => 'id é obrigatório'], 400); }

$pdo->prepare("DELETE FROM destaques WHERE id = ?")->execute([$id]);
jsonResponse(['sucesso' => true]);
