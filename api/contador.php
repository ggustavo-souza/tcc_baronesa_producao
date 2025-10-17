<?php
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");

    include_once("config/database.php");
    
    try {
        $contador = [];

        //usuarios
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
        $contador["usuarios"] = $stmt->fetch(PDO::FETCH_ASSOC)["total"];
        //produtos
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM moveis");
        $contador["moveis"] = $stmt->fetch(PDO::FETCH_ASSOC)["total"];
        //subsequentes
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM orcamentos");
        $contador["orcamentos"] = $stmt->fetch(PDO::FETCH_ASSOC)["total"];

        echo json_encode($contador);
    } catch (PDOException $e) {
        echo json_encode(["erro" => $e->getMessage()]);
    }