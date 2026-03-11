<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados                = getPostData();
$titulo               = trim($dados['titulo']               ?? '');
$sinopse              = trim($dados['sinopse']              ?? '');
$capa_url             = trim($dados['capa_url']             ?? '');
$classificacao_etaria = trim($dados['classificacao_etaria'] ?? 'Livre');
$publicada            = (int) ($dados['publicada']          ?? 0);
$data_pub             = $dados['data_publicacao']           ?? null;
$categorias           = $dados['categorias']                ?? [];
$avisos               = $dados['avisos']                    ?? [];

if (!$titulo) {
    jsonResponse(['erro' => 'Titulo e obrigatorio'], 400);
}

// Gera slug unico a partir do titulo
$slug     = slugify($titulo);
$slugBase = $slug;
$contador = 1;
while (true) {
    $stmt = $pdo->prepare("SELECT id FROM historias WHERE slug = ?");
    $stmt->execute([$slug]);
    if (!$stmt->fetch()) break;
    $slug = $slugBase . '-' . $contador++;
}

$stmt = $pdo->prepare("
    INSERT INTO historias (titulo, slug, sinopse, capa_url, classificacao_etaria, publicada, data_publicacao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([$titulo, $slug, $sinopse ?: null, $capa_url ?: null, $classificacao_etaria, $publicada, $data_pub ?: null]);
$historiaId = $pdo->lastInsertId();

// Vincula categorias
if (!empty($categorias)) {
    $stmt = $pdo->prepare("INSERT INTO historia_categorias (historia_id, categoria_id) VALUES (?, ?)");
    foreach ($categorias as $catId) {
        $stmt->execute([$historiaId, (int) $catId]);
    }
}

// Vincula avisos
if (!empty($avisos)) {
    $stmt = $pdo->prepare("INSERT INTO historia_avisos (historia_id, aviso_id) VALUES (?, ?)");
    foreach ($avisos as $avisoId) {
        $stmt->execute([$historiaId, (int) $avisoId]);
    }
}

jsonResponse(['sucesso' => true, 'id' => $historiaId, 'slug' => $slug], 201);
