<?php
header("Content-Type: application/json; charset=UTF-8");

require __DIR__ . '/../vendor/autoload.php';
$mpConfig = include __DIR__ . '/config/mp.php';

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient; 

MercadoPagoConfig::setAccessToken($mpConfig['access_token']);

include __DIR__ . '/config/database.php';

$body = file_get_contents("php://input");
$evento = json_decode($body, true);

if (isset($evento['type']) && $evento['type'] === 'payment') {
    $payment_id = $evento['data']['id'] ?? null;

    if ($payment_id) {
        try {
            $client = new PaymentClient();

            $payment = $client->get($payment_id);

            if ($payment && $payment->status === 'approved' && !empty($payment->external_reference)) {
                $stmt = $pdo->prepare("UPDATE pedidos SET status = 'pago' WHERE id = ?");
                $stmt->execute([$payment->external_reference]);
            }

        } catch (\Exception $e) {
            error_log("Erro no webhook ao processar o pagamento: " . $e->getMessage());
        }
    }
}
http_response_code(200);
echo json_encode(["status" => "ok"]);