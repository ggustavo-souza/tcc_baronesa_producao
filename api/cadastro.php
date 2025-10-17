<?php
include_once("config/database.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["erro" => "Nenhum dado recebido"]);
    exit;
}

$nome = $data["nome"];
$email = $data["email"];
$senha = password_hash($data["password"], PASSWORD_DEFAULT);
$foto = isset($data["foto"]) ? $data["foto"] : null;
$cargo = "usuario";

$verifica = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
$verifica->execute([$email]);

if ($verifica->rowCount() > 0) {
    echo json_encode(["erro" => "Email já cadastrado"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)");
    $stmt->execute([$nome, $email, $senha, $cargo]);

    echo json_encode(["mensagem" => "Cadastro realizado com sucesso"]);
} catch (PDOException $e) {
    echo json_encode(["erro" => "Erro ao cadastrar: " . $e->getMessage()]);
}
?>
