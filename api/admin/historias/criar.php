<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Método não permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados                = getPostData();
$titulo               = trim($dados['titulo']               ?? '');
$sinopse              = trim($dados['sinopse']              ?? '');
$capa_url             = trim($dados['capa_url']             ?? '');
$classificacao_etaria = trim($dados['classificacao_etaria'] ?? 'Livre');
$publicada            = (int) ($dados['publicada']          ?? 0);
$categorias           = $dados['categorias']                ?? [];
$tipos                = $dados['tipos']                     ?? [];
$personagens          = $dados['personagens']               ?? [];
$avisos               = $dados['avisos']                    ?? [];

if (!$titulo) {
    jsonResponse(['erro' => 'Título é obrigatório'], 400);
}

$slug     = slugify($titulo);
$slugBase = $slug;
$contador = 1;
while (true) {
    $stmt = $pdo->prepare("SELECT id FROM historias WHERE slug = ?");
    $stmt->execute([$slug]);
    if (!$stmt->fetch()) break;
    $slug = $slugBase . '-' . $contador++;
}

$stmt = $pdo->prepare("INSERT INTO historias (titulo, slug, sinopse, capa_url, classificacao_etaria, publicada) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->execute([$titulo, $slug, $sinopse ?: null, $capa_url ?: null, $classificacao_etaria, $publicada]);
$historiaId = $pdo->lastInsertId();

if (!empty($categorias)) {
    $s = $pdo->prepare("INSERT INTO historia_categorias (historia_id, categoria_id) VALUES (?, ?)");
    foreach ($categorias as $id) { $s->execute([$historiaId, (int) $id]); }
}

if (!empty($tipos)) {
    $s = $pdo->prepare("INSERT INTO historia_tipos (historia_id, tipo_id) VALUES (?, ?)");
    foreach ($tipos as $id) { $s->execute([$historiaId, (int) $id]); }
}

if (!empty($personagens)) {
    $s = $pdo->prepare("INSERT INTO historia_personagens (historia_id, personagem_id) VALUES (?, ?)");
    foreach ($personagens as $id) { $s->execute([$historiaId, (int) $id]); }
}

if (!empty($avisos)) {
    $s = $pdo->prepare("INSERT INTO historia_avisos (historia_id, aviso_id) VALUES (?, ?)");
    foreach ($avisos as $id) { $s->execute([$historiaId, (int) $id]); }
}

jsonResponse(['sucesso' => true, 'id' => $historiaId, 'slug' => $slug], 201);
