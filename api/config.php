<?php
// Desativa exibicao de erros como HTML (evita quebrar o JSON)
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);

// Captura excecoes nao tratadas e retorna JSON
set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
});

// Configuracao do banco de dados MySQL
// Para desenvolvimento local, crie api/config.local.php

if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
} else {
    // Configuracao para cPanel (producao)
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'db_name');
    define('DB_USER', 'db_user');
    define('DB_PASSWORD', 'db_password');
    define('DB_CHARSET', 'utf8mb4');
    define('DB_COLLATE', '');
}

// Headers CORS (permite o frontend acessar a API)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Se for requisicao OPTIONS (preflight), retorna OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexao com o banco
function getConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASSWORD,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao conectar no banco de dados']);
        exit();
    }
}

// Retorna resposta JSON e encerra o script
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Pega os dados enviados no corpo da requisicao (JSON)
function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json, true) ?? [];
}

// Converte texto em slug (URL amigavel)
// Ex: "Minha História Incrível" -> "minha-historia-incrivel"
function slugify($texto) {
    $texto = mb_strtolower($texto, 'UTF-8');
    $mapa = [
        'á'=>'a','à'=>'a','ã'=>'a','â'=>'a','ä'=>'a',
        'é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
        'í'=>'i','ì'=>'i','î'=>'i','ï'=>'i',
        'ó'=>'o','ò'=>'o','õ'=>'o','ô'=>'o','ö'=>'o',
        'ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u',
        'ç'=>'c','ñ'=>'n'
    ];
    $texto = strtr($texto, $mapa);
    $texto = preg_replace('/[^a-z0-9\s-]/', '', $texto);
    $texto = preg_replace('/[\s-]+/', '-', $texto);
    return trim($texto, '-');
}

// Extrai o token Bearer do header Authorization
function getBearerToken() {
    $valor = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $valor = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $valor = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }
    if ($valor && preg_match('/Bearer\s+(.+)/i', $valor, $matches)) {
        return trim($matches[1]);
    }
    return null;
}

// Valida o token e retorna o usuario autenticado
// Se o token for invalido ou ausente, retorna erro 401
function autenticarUsuario($pdo) {
    $token = getBearerToken();
    if (!$token) {
        jsonResponse(['erro' => 'Token nao fornecido'], 401);
    }
    $stmt = $pdo->prepare("
        SELECT u.*
        FROM sessoes s
        JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$token]);
    $usuario = $stmt->fetch();
    if (!$usuario) {
        jsonResponse(['erro' => 'Token invalido ou expirado'], 401);
    }
    return $usuario;
}

// Valida o token e garante que o usuario e admin
// Se nao for admin, retorna erro 403
function autenticarAdmin($pdo) {
    $usuario = autenticarUsuario($pdo);
    if (!$usuario['is_admin']) {
        jsonResponse(['erro' => 'Acesso negado'], 403);
    }
    return $usuario;
}
