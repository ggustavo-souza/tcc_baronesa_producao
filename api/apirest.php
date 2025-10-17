<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
include 'config/database.php';

$UriReq = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($UriReq, PHP_URL_PATH);
$parts = explode('/', $path);

$last = $parts[count($parts) - 1] ?? null;
$prev = $parts[count($parts) - 2] ?? null;

$tabela = null;
$id = null;
$acao = null;

// Ex: /api/orcamentos/usuario/5
if (isset($parts[count($parts) - 3]) && $parts[count($parts) - 3] === 'orcamentos' && $parts[count($parts) - 2] === 'usuario') {
    $tabela = 'orcamentos';
    $acao = 'getByUser';
    $id = $parts[count($parts) - 1]; // ID do usuário
} 
// Ex: /api/moveis/1
else if (is_numeric($last)) {
    $id = $last;
    $tabela = $prev;
} 
// Ex: /api/moveis
else {
    $id = null;
    $tabela = $last;
}

$tabelasPermitidas = ['usuarios', 'moveis', 'categorias', 'orcamentos', 'pedidos'];

if (!in_array($tabela, $tabelasPermitidas)) {
    http_response_code(400);
    echo json_encode(["message" => "Tabela inválida", "debug" => $tabela]);
    exit();
}

try {
    // ====================== GET ======================
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        if ($tabela === 'orcamentos' && $acao === 'getByUser' && is_numeric($id)) {
            // $id aqui é o id_usuario
            $stmt = $pdo->prepare("SELECT * FROM orcamentos WHERE id_usuario = ? ORDER BY id ASC");
            $stmt->execute([$id]);
            $orcamentos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($orcamentos ?: []);
            exit; 
        }
        
        if ($tabela === 'moveis') {
            if ($id) {
                // GET por id, incluindo fotos
                $stmt = $pdo->prepare("SELECT * FROM moveis WHERE id = ?");
                $stmt->execute([$id]);
                $movel = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($movel) {
                    $stmt2 = $pdo->prepare("SELECT id, foto, principal FROM moveis_fotos WHERE id_movel = ?");
                    $stmt2->execute([$id]);
                    $movel['fotos'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($movel);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "Móvel não encontrado"]);
                }
            } else {
                // GET lista de móveis
                $stmt = $pdo->query("SELECT * FROM moveis ORDER BY id ASC");
                $moveis = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($moveis as &$m) {
                    $stmt2 = $pdo->prepare("SELECT id, foto, principal FROM moveis_fotos WHERE id_movel = ?");
                    $stmt2->execute([$m['id']]);
                    $m['fotos'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
                }

                echo json_encode($moveis);
            }
            exit;
        }elseif ($tabela === "pedidos") {
            if ($id) {
                // Pega todos os pedidos do usuário + info do móvel
                $stmt = $pdo->prepare("
                    SELECT p.id, p.id_usuario, p.id_movel, p.data_pedido, p.status,
                        m.nome, m.valor AS preco
                    FROM pedidos p
                    JOIN moveis m ON p.id_movel = m.id
                    WHERE p.id_usuario = ?
                    ORDER BY p.data_pedido ASC
                ");
                $stmt->execute([$id]);
                $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode($pedidos ?: []);
            }
            exit;
        }else {
            // GET padrão para usuarios/categorias
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM $tabela WHERE id = ?");
                $stmt->execute([$id]);
                $registro = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($registro ?: []);
            } else {
                $stmt = $pdo->query("SELECT * FROM $tabela");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
        }
    }



    // ====================== POST (create or update) ======================
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($tabela === 'moveis') {
            $idMovel = $_POST['id'] ?? null;  // pega id se for edição

            $nome = $_POST['nome'] ?? null;
            $valor = $_POST['valor'] ?? null;
            $descricao = $_POST['descricao'] ?? null;
            $categoria_id = $_POST['categoria_id'] ?? null;

            if ($idMovel) {
                // Atualiza móvel existente
                $sql = "UPDATE moveis SET nome = ?, valor = ?, descricao = ?, categoria_id = ? WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$nome, $valor, $descricao, $categoria_id, $idMovel]);
            } else {
                // Cria novo móvel
                $sql = "INSERT INTO moveis (nome, valor, descricao, categoria_id) VALUES (?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$nome, $valor, $descricao, $categoria_id]);
                $idMovel = $pdo->lastInsertId();
            }

            $uploadDir = "uploads/";
            if (!is_dir($uploadDir))
                mkdir($uploadDir, 0777, true);

            // Verifica se NOVAS fotos foram enviadas
            if (!empty($_FILES['fotos']['name'][0])) {
                if ($id && !empty($idMovel)) { 
                    $stmt_old_fotos = $pdo->prepare("SELECT foto FROM moveis_fotos WHERE id_movel = ?");
                    $stmt_old_fotos->execute([$idMovel]);
                    $fotos_antigas = $stmt_old_fotos->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($fotos_antigas as $foto) {
                        $caminho_arquivo = $uploadDir . $foto['foto'];
                        if (file_exists($caminho_arquivo)) {
                            unlink($caminho_arquivo);
                        }
                    }

                    $stmt_delete = $pdo->prepare("DELETE FROM moveis_fotos WHERE id_movel = ?");
                    $stmt_delete->execute([$idMovel]);
                }

                foreach ($_FILES['fotos']['tmp_name'] as $i => $tmpName) {
                    if ($_FILES['fotos']['error'][$i] === UPLOAD_ERR_OK) {
                        $fileName = uniqid() . "_" . basename($_FILES['fotos']['name'][$i]);
                        $destino = $uploadDir . $fileName;
                        if (move_uploaded_file($tmpName, $destino)) {
                            // Para o primeiro upload, marcamos como principal.
                            $principal = ($i === 0) ? 1 : 0;
                            $stmt = $pdo->prepare("INSERT INTO moveis_fotos (id_movel, foto, principal) VALUES (?, ?, ?)");
                            $stmt->execute([$idMovel, $fileName, $principal]);
                        }
                    }
                }
            }

            $msg = ($id || $idMovel) ? "Móvel atualizado com sucesso" : "Móvel criado com sucesso";
            echo json_encode(["message" => $msg, "id" => $idMovel]);
            exit;
        }
                // ====================== PEDIDOS ======================
        if ($tabela === 'pedidos') {
            $dados = json_decode(file_get_contents("php://input"), true);

            if (!$dados || !isset($dados['id_usuario']) || !isset($dados['id_movel'])) {
                http_response_code(400);
                echo json_encode(["message" => "Campos obrigatórios ausentes (id_usuario, id_movel)"]);
                exit();
            }

            $id_usuario = $dados['id_usuario'];
            $id_movel = $dados['id_movel'];
            $status = 'pendente';
            $data_pedido = date('Y-m-d H:i:s');

            // Verifica se o móvel existe
            $stmt = $pdo->prepare("SELECT id FROM moveis WHERE id = ?");
            $stmt->execute([$id_movel]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(["message" => "Móvel não encontrado"]);
                exit();
            }

            // Cria o pedido
            $sql = "INSERT INTO pedidos (id_usuario, id_movel, data_pedido, status) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_usuario, $id_movel, $data_pedido, $status]);

            echo json_encode([
                "sucesso" => true,
                "message" => "Pedido criado com sucesso",
                "id" => $pdo->lastInsertId()
            ]);
            exit();
        }


        $dados = json_decode(file_get_contents("php://input"), true);
        if (!$dados || !is_array($dados)) {
            http_response_code(400);
            echo json_encode(["message" => "Dados inválidos ou corpo da requisição vazio"]);
            exit();
        }

        if ($id) {
            // =========== ATUALIZAR (UPDATE) ===========
            if ($tabela === 'usuarios' && isset($dados['senha']) && !empty(trim($dados['senha']))) {
                $dados['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
            } else {
                unset($dados['senha']);
            }

            $setParts = [];
            $values = [];
            foreach ($dados as $coluna => $valor) {
                $setParts[] = "$coluna = ?";
                $values[] = $valor;
            }

            if (count($setParts) > 0) {
                $values[] = $id;
                $sql = "UPDATE $tabela SET " . implode(', ', $setParts) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($values);
                echo json_encode(["message" => "Registro atualizado com sucesso"]);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Nenhum dado para atualizar"]);
            }

        } else {
            // =========== CRIAR (INSERT) ===========
            // Esta lógica agora cuidará da criação de 'orcamentos' também
            if ($tabela === 'usuarios' && !empty($dados['senha'])) {
                $dados['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
            } else if ($tabela === 'orcamentos') {
                $dados = json_decode(file_get_contents("php://input"), true);
                $idOrcamento = $dados["id"] ?? null;
                if (!$idOrcamento) {
                    if (!$dados || !is_array($dados)) {
                        http_response_code(400);
                        echo json_encode(["message" => "Dados inválidos"]);
                        exit();
                    }

                    $id_usuario = $dados['id_usuario'] ?? null;
                    $id_categoria = $dados['id_categoria'] ?? null;
                    $mensagem = $dados['mensagem'] ?? null;
                    $telefone = $dados['telefone'] ?? null;

                    if (!$id_usuario || !$id_categoria || !$mensagem || !$telefone) {
                        http_response_code(400);
                        echo json_encode(["message" => "Campos obrigatórios ausentes"]);
                        exit();
                    }

                    $sql = "INSERT INTO orcamentos (id_usuario, id_categoria, mensagem, telefone) 
                        VALUES (?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$id_usuario, $id_categoria, $mensagem, $telefone]);

                    echo json_encode(["message" => "Orçamento criado com sucesso", "id" => $pdo->lastInsertId()]);
                    exit;
                } elseif ($idOrcamento) {
                    $sql = "UPDATE orcamentos SET aprovacao = 'aprovado' WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$idOrcamento]);

                    echo json_encode(["message" => "Orçamento aprovado com sucesso!"]);
                    exit;
                }
            }

            // Pega os dados do corpo da requisição
            if ($tabela === 'orcamentos') {
                if (empty($dados['id_usuario']) || empty($dados['id_categoria']) || empty($dados['mensagem']) || empty($dados['telefone'])) {
                    http_response_code(400);
                    echo json_encode(["message" => "Para criar um orçamento, todos os campos são obrigatórios"]);
                    exit();
                }
            }

            $colunas = array_keys($dados);
            $placeholders = implode(',', array_fill(0, count($colunas), '?'));
            $sql = "INSERT INTO $tabela (" . implode(',', $colunas) . ") VALUES ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($dados));

            echo json_encode(["message" => "Registro criado com sucesso", "id" => $pdo->lastInsertId()]);
        }
    }

    // ====================== DELETE ======================
    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM $tabela WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Registro excluído com sucesso"]);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Método não permitido"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro: " . $e->getMessage()]);
}