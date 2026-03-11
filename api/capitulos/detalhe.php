<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();

$historiaId = (int) ($_GET['historia_id'] ?? 0);
$ordem      = (int) ($_GET['ordem']      ?? 0);

if (!$historiaId || !$ordem) {
    jsonResponse(['erro' => 'historia_id e ordem sao obrigatorios'], 400);
}

// Busca o capítulo
$stmt = $pdo->prepare("
    SELECT c.id, c.historia_id, c.titulo, c.conteudo, c.ordem,
           h.titulo AS historia_titulo, h.slug AS historia_slug
    FROM capitulos c
    JOIN historias h ON h.id = c.historia_id
    WHERE c.historia_id = ? AND c.ordem = ? AND h.publicada = 1
");
$stmt->execute([$historiaId, $ordem]);
$capitulo = $stmt->fetch();

if (!$capitulo) {
    jsonResponse(['erro' => 'Capitulo nao encontrado'], 404);
}

// Total de capítulos (para navegação anterior/próximo)
$stmtTotal = $pdo->prepare("SELECT MAX(ordem) AS total FROM capitulos WHERE historia_id = ?");
$stmtTotal->execute([$historiaId]);
$capitulo['total_capitulos'] = (int) $stmtTotal->fetch()['total'];

jsonResponse(['sucesso' => true, 'capitulo' => $capitulo]);
