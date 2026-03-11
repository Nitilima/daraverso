<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['erro' => 'Metodo nao permitido'], 405);
}

$pdo = getConnection();

// Busca por id ou slug
if (!empty($_GET['id'])) {
    $where = "h.id = ? AND h.publicada = 1";
    $param = (int) $_GET['id'];
} elseif (!empty($_GET['slug'])) {
    $where = "h.slug = ? AND h.publicada = 1";
    $param = $_GET['slug'];
} else {
    jsonResponse(['erro' => 'Informe id ou slug da historia'], 400);
}

$stmt = $pdo->prepare("
    SELECT
        h.*,
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'nome', c.nome, 'slug', c.slug))
            FROM historia_categorias hc
            JOIN categorias c ON c.id = hc.categoria_id
            WHERE hc.historia_id = h.id
        ) AS categorias,
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'nome', a.nome, 'slug', a.slug))
            FROM historia_avisos ha
            JOIN avisos a ON a.id = ha.aviso_id
            WHERE ha.historia_id = h.id
        ) AS avisos
    FROM historias h
    WHERE $where
");
$stmt->execute([$param]);
$historia = $stmt->fetch();

if (!$historia) {
    jsonResponse(['erro' => 'Historia nao encontrada'], 404);
}

$historia['categorias'] = $historia['categorias'] ? json_decode($historia['categorias']) : [];
$historia['avisos']     = $historia['avisos']     ? json_decode($historia['avisos'])     : [];

// Se o usuario estiver logado, informa se ele ja marcou esta historia como lida
$token = getBearerToken();
if ($token) {
    $stmtSessao = $pdo->prepare("
        SELECT u.id FROM sessoes s
        JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token = ? AND s.expires_at > NOW()
    ");
    $stmtSessao->execute([$token]);
    $usuario = $stmtSessao->fetch();
    if ($usuario) {
        $stmtLida = $pdo->prepare("
            SELECT 1 FROM historias_lidas
            WHERE usuario_id = ? AND historia_id = ?
        ");
        $stmtLida->execute([$usuario['id'], $historia['id']]);
        $historia['ja_lida'] = (bool) $stmtLida->fetch();
    }
}

jsonResponse(['sucesso' => true, 'historia' => $historia]);
