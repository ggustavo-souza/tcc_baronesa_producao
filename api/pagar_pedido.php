<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
include 'config/database.php';

try {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (!$dados || !isset($dados['id'])) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "message" => "ID do pedido ausente."]);
        exit;
    }

    $idPedido = $dados['id'];

    // Verifica se o pedido existe
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE id = ?");
    $stmt->execute([$idPedido]);
    $pedido = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$pedido) {
        http_response_code(404);
        echo json_encode(["sucesso" => false, "message" => "Pedido não encontrado."]);
        exit;
    }

    // Atualiza status para 'Pago'
    $stmt = $pdo->prepare("UPDATE pedidos SET status = 'Pago' WHERE id = ?");
    $stmt->execute([$idPedido]);

    echo json_encode(["sucesso" => true, "message" => "Pedido pago com sucesso."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "message" => "Erro interno: " . $e->getMessage()]);
}
