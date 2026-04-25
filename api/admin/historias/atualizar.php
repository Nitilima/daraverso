<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(['erro' => 'Método não permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados                = getPostData();
$id                   = (int) ($dados['id']                 ?? 0);
$titulo               = trim($dados['titulo']               ?? '');
$sinopse              = trim($dados['sinopse']              ?? '');
$capa_url             = trim($dados['capa_url']             ?? '');
$classificacao_etaria = trim($dados['classificacao_etaria'] ?? 'Livre');
$publicada            = (int) ($dados['publicada']          ?? 0);
$categorias           = $dados['categorias']                ?? [];
$tipos                = $dados['tipos']                     ?? [];
$personagens          = $dados['personagens']               ?? [];
$avisos               = $dados['avisos']                    ?? [];

if (!$id || !$titulo) {
    jsonResponse(['erro' => 'id e título são obrigatórios'], 400);
}

$stmt = $pdo->prepare("SELECT id FROM historias WHERE id = ?");
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    jsonResponse(['erro' => 'História não encontrada'], 404);
}

$slug     = slugify($titulo);
$slugBase = $slug;
$contador = 1;
while (true) {
    $stmt = $pdo->prepare("SELECT id FROM historias WHERE slug = ? AND id != ?");
    $stmt->execute([$slug, $id]);
    if (!$stmt->fetch()) break;
    $slug = $slugBase . '-' . $contador++;
}

$stmt = $pdo->prepare("UPDATE historias SET titulo = ?, slug = ?, sinopse = ?, capa_url = ?, classificacao_etaria = ?, publicada = ? WHERE id = ?");
$stmt->execute([$titulo, $slug, $sinopse ?: null, $capa_url ?: null, $classificacao_etaria, $publicada, $id]);

$pdo->prepare("DELETE FROM historia_categorias  WHERE historia_id = ?")->execute([$id]);
$pdo->prepare("DELETE FROM historia_tipos        WHERE historia_id = ?")->execute([$id]);
$pdo->prepare("DELETE FROM historia_personagens  WHERE historia_id = ?")->execute([$id]);
$pdo->prepare("DELETE FROM historia_avisos       WHERE historia_id = ?")->execute([$id]);

if (!empty($categorias)) {
    $s = $pdo->prepare("INSERT INTO historia_categorias (historia_id, categoria_id) VALUES (?, ?)");
    foreach ($categorias as $cid) { $s->execute([$id, (int) $cid]); }
}
if (!empty($tipos)) {
    $s = $pdo->prepare("INSERT INTO historia_tipos (historia_id, tipo_id) VALUES (?, ?)");
    foreach ($tipos as $tid) { $s->execute([$id, (int) $tid]); }
}
if (!empty($personagens)) {
    $s = $pdo->prepare("INSERT INTO historia_personagens (historia_id, personagem_id) VALUES (?, ?)");
    foreach ($personagens as $pid) { $s->execute([$id, (int) $pid]); }
}
if (!empty($avisos)) {
    $s = $pdo->prepare("INSERT INTO historia_avisos (historia_id, aviso_id) VALUES (?, ?)");
    foreach ($avisos as $aid) { $s->execute([$id, (int) $aid]); }
}

jsonResponse(['sucesso' => true]);
