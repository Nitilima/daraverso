<?php
require_once __DIR__ . '/../../config.php';
$pdo = getConnection();
autenticarAdmin($pdo);
$stmt = $pdo->query("SELECT d.id, d.titulo, d.descricao, d.imagem_url, d.historia_id, d.ordem, d.ativo FROM destaques d ORDER BY d.ordem ASC");
jsonResponse($stmt->fetchAll());
