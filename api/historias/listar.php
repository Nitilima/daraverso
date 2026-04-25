<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Método não permitido'], 405);
}

$pdo = getConnection();

$pagina    = max(1, intval($_GET['pagina'] ?? 1));
$porPagina = 10;
$offset    = ($pagina - 1) * $porPagina;

$genero     = $_GET['genero']     ?? null;
$tipo       = $_GET['tipo']       ?? null;
$personagem = $_GET['personagem'] ?? null;

$where  = ['h.publicada = 1'];
$params = [];

if ($genero) {
    $where[] = 'EXISTS (SELECT 1 FROM historia_categorias hc JOIN categorias c ON c.id = hc.categoria_id WHERE hc.historia_id = h.id AND c.slug = ?)';
    $params[] = $genero;
}

if ($tipo) {
    $where[] = 'EXISTS (SELECT 1 FROM historia_tipos ht JOIN tipos t ON t.id = ht.tipo_id WHERE ht.historia_id = h.id AND t.slug = ?)';
    $params[] = $tipo;
}

if ($personagem) {
    $where[] = 'EXISTS (SELECT 1 FROM historia_personagens hp JOIN personagens p ON p.id = hp.personagem_id WHERE hp.historia_id = h.id AND p.slug = ?)';
    $params[] = $personagem;
}

$whereStr = implode(' AND ', $where);

$stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM historias h WHERE $whereStr");
$stmtTotal->execute($params);
$total = (int) $stmtTotal->fetchColumn();

$stmt = $pdo->prepare("
    SELECT h.id, h.titulo, h.slug, h.sinopse, h.capa_url, h.classificacao_etaria, h.created_at
    FROM historias h
    WHERE $whereStr
    ORDER BY h.created_at DESC
    LIMIT $porPagina OFFSET $offset
");
$stmt->execute($params);
$historias = $stmt->fetchAll();

foreach ($historias as &$h) {
    $s = $pdo->prepare("SELECT c.nome, c.slug FROM categorias c JOIN historia_categorias hc ON hc.categoria_id = c.id WHERE hc.historia_id = ?");
    $s->execute([$h['id']]);
    $h['categorias'] = $s->fetchAll();

    $s = $pdo->prepare("SELECT t.nome, t.slug FROM tipos t JOIN historia_tipos ht ON ht.tipo_id = t.id WHERE ht.historia_id = ?");
    $s->execute([$h['id']]);
    $h['tipos'] = $s->fetchAll();
}

jsonResponse([
    'dados'   => $historias,
    'total'   => $total,
    'pagina'  => $pagina,
    'paginas' => (int) ceil($total / $porPagina)
]);
