<?php
// Configura cabeçalhos de CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Responde a requisições OPTIONS rapidamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inclui o autoloader do Composer para carregar as classes do Mercado Pago SDK
require __DIR__ . '/../vendor/autoload.php';

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;

// Função auxiliar para retornar JSON de erro e encerrar a execução
function return_error_json($http_code, $message, $details = []) {
    header("Content-Type: application/json");
    http_response_code($http_code);
    echo json_encode(["message" => $message, "details" => $details]);
    exit;
}
// ----------------------------------------

// --- Verificação de Arquivo de Configuração ---
$mpConfig = @include 'config/mp.php';
if ($mpConfig === false || !isset($mpConfig['access_token']) || !isset($mpConfig['public_key'])) {
    return_error_json(500, "Erro de configuração: Arquivo 'config/mp.php' ausente ou mal formatado.");
}

// Define o Access Token (Se for de teste, use um token TEST-XXXXX)
MercadoPagoConfig::setAccessToken($mpConfig['access_token']);

// Recebe dados do corpo da requisição POST
$dados = json_decode(file_get_contents("php://input"), true);

$valor = floatval($dados['valor'] ?? 0);

// Validação básica dos dados recebidos
if (!$dados || !isset($dados['id_pedido']) || !isset($dados['titulo']) || $valor <= 0) {
    return_error_json(400, "Campos obrigatórios ausentes na requisição ou valor inválido.", $dados);
}

try {
    $client = new PreferenceClient();

    // Define a base das URLs de retorno (backurls)
    $backUrlsBase = "http://localhost/tcc_baronesa/api/backurls"; 

    $preferenceData = [
        "items" => [
            [
                "title" => $dados['titulo'],
                "quantity" => 1,
                "unit_price" => $valor
            ]
        ],
        "back_urls" => [
            "success" => $backUrlsBase . "/sucesso.php",
            "failure" => $backUrlsBase . "/falha.php",
            "pending" => $backUrlsBase . "/pendente.php"
        ],
        "external_reference" => strval($dados['id_pedido']),
        
        // ⭐️ CORREÇÃO FINAL: FORÇANDO PIX, SALDO E CRÉDITO ⭐️
        // Remove Boleto/Offline e Débito Virtual para priorizar Pix e Saldo
        "payment_methods" => [
            "excluded_payment_types" => [
                // 'ticket' é o ID para Boleto, Pagamento na Lotérica e outros meios offline
                ["id" => "ticket"], 
                // 'debit_card' exclui o débito virtual da Caixa (Pode ser o Débito que estava aparecendo)
                ["id" => "debit_card"] 
            ], 
            // Define o máximo de parcelas
            "installments" => 12 
        ]
        // ----------------------------------------------------
    ];

    $preference = $client->create($preferenceData);

    // Sucesso: Retorna o ID da preferência, a URL de pagamento e a chave pública
    header("Content-Type: application/json");
    http_response_code(200);
    echo json_encode([
        "id" => $preference->id,
        "init_point" => $preference->init_point, 
        "public_key" => $mpConfig['public_key']
    ]);

} catch (MPApiException $e) {
    // Tratamento de erros específicos da API do Mercado Pago
    $api_response = $e->getApiResponse();
    $status_code = $api_response ? $api_response->getStatusCode() : 500;
    
    $error_content = $api_response ? $api_response->getContent() : '';
    $error_details = [];
    if (is_string($error_content)) {
        $error_details = json_decode($error_content, true);
    }
    
    $api_message = $error_details['message'] ?? $e->getMessage();
    $api_causes = $error_details['causes'] ?? $error_details['cause'] ?? ['raw_response' => $error_content];

    return_error_json($status_code, "Erro na API do MP: " . $api_message, $api_causes);

} catch (\Exception $e) {
    // Tratamento de erros gerais do PHP/servidor
    error_log("Erro Fatal no Servidor: " . $e->getMessage() . " em " . $e->getFile() . " na linha " . $e->getLine());
    return_error_json(500, "Falha de execução do servidor. Verifique o log do PHP.", ["exception" => $e->getMessage()]);
}