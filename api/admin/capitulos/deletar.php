<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados = getPostData();
$id    = (int) ($dados['id'] ?? 0);

if (!$id) {
    jsonResponse(['erro' => 'id e obrigatorio'], 400);
}

// Busca a ordem e historia_id antes de deletar (para reordenar)
$stmt = $pdo->prepare("SELECT historia_id, ordem FROM capitulos WHERE id = ?");
$stmt->execute([$id]);
$capitulo = $stmt->fetch();

if (!$capitulo) {
    jsonResponse(['erro' => 'Capitulo nao encontrado'], 404);
}

$pdo->prepare("DELETE FROM capitulos WHERE id = ?")->execute([$id]);

// Reordena os capítulos restantes
$stmt2 = $pdo->prepare("SELECT id FROM capitulos WHERE historia_id = ? ORDER BY ordem ASC");
$stmt2->execute([$capitulo['historia_id']]);
$restantes = $stmt2->fetchAll(PDO::FETCH_COLUMN);

$atualizar = $pdo->prepare("UPDATE capitulos SET ordem = ? WHERE id = ?");
foreach ($restantes as $i => $capId) {
    $atualizar->execute([$i + 1, $capId]);
}

jsonResponse(['sucesso' => true]);
