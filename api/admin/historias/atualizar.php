<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();
autenticarAdmin($pdo);

$dados                = getPostData();
$id                   = (int) ($dados['id']               ?? 0);
$titulo               = trim($dados['titulo']               ?? '');
$sinopse              = trim($dados['sinopse']              ?? '');
$capa_url             = trim($dados['capa_url']             ?? '');
$classificacao_etaria = trim($dados['classificacao_etaria'] ?? 'Livre');
$publicada            = (int) ($dados['publicada']          ?? 0);
$data_pub             = $dados['data_publicacao']           ?? null;
$categorias           = $dados['categorias']                ?? [];
$avisos               = $dados['avisos']                    ?? [];

if (!$id || !$titulo) {
    jsonResponse(['erro' => 'id e titulo sao obrigatorios'], 400);
}

// Verifica se a historia existe
$stmt = $pdo->prepare("SELECT id FROM historias WHERE id = ?");
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    jsonResponse(['erro' => 'Historia nao encontrada'], 404);
}

// Gera novo slug unico (ignora o proprio registro ao checar duplicatas)
$slug     = slugify($titulo);
$slugBase = $slug;
$contador = 1;
while (true) {
    $stmt = $pdo->prepare("SELECT id FROM historias WHERE slug = ? AND id != ?");
    $stmt->execute([$slug, $id]);
    if (!$stmt->fetch()) break;
    $slug = $slugBase . '-' . $contador++;
}

$stmt = $pdo->prepare("
    UPDATE historias
    SET titulo = ?, slug = ?, sinopse = ?, capa_url = ?,
        classificacao_etaria = ?, publicada = ?, data_publicacao = ?
    WHERE id = ?
");
$stmt->execute([$titulo, $slug, $sinopse ?: null, $capa_url ?: null, $classificacao_etaria, $publicada, $data_pub ?: null, $id]);

// Atualiza categorias: remove antigas e insere novas
$pdo->prepare("DELETE FROM historia_categorias WHERE historia_id = ?")->execute([$id]);
if (!empty($categorias)) {
    $stmt = $pdo->prepare("INSERT INTO historia_categorias (historia_id, categoria_id) VALUES (?, ?)");
    foreach ($categorias as $catId) {
        $stmt->execute([$id, (int) $catId]);
    }
}

// Atualiza avisos: remove antigos e insere novos
$pdo->prepare("DELETE FROM historia_avisos WHERE historia_id = ?")->execute([$id]);
if (!empty($avisos)) {
    $stmt = $pdo->prepare("INSERT INTO historia_avisos (historia_id, aviso_id) VALUES (?, ?)");
    foreach ($avisos as $avisoId) {
        $stmt->execute([$id, (int) $avisoId]);
    }
}

jsonResponse(['sucesso' => true]);
