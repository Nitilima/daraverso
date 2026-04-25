<?php
require_once __DIR__ . '/../../config.php';
$pdo = getConnection();
autenticarAdmin($pdo);
$stmt = $pdo->query("SELECT id, nome, slug FROM personagens ORDER BY nome ASC");
jsonResponse($stmt->fetchAll());
