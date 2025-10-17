<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include_once("config/database.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["nome"]) || !isset($data["password"])) {
    echo json_encode(["erro" => "Nenhum dado ou formato inválido"]);
    exit;
}

$nome = $data["nome"];
$senha = $data["password"];

try {
    $stmt = $pdo->prepare("SELECT id, nome, email, senha, cargo FROM usuarios WHERE nome = ?"); 
    $stmt->execute([$nome]);

    if ($stmt->rowCount() === 1) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($senha, $usuario['senha'])) {
            echo json_encode([
                "sucesso" => true,
                "usuario" => [
                    "id" => $usuario["id"],
                    "nome" => $usuario["nome"],
                    "email" => $usuario["email"],
                    "cargo" => $usuario["cargo"]
                ]
            ]);
        } else {
            echo json_encode(["erro" => "Usuário ou senha incorretos"]);
        }
    } else {
        echo json_encode(["erro" => "Usuário ou senha incorretos"]);
    }
} catch (PDOException $e) {
    echo json_encode(["erro" => "Erro no servidor: " . $e->getMessage()]);
}
?>