<?php

require __DIR__ . '/../vendor/autoload.php';

var_dump(file_exists(__DIR__ . '/../vendor/autoload.php')); // Deve dar true
var_dump(class_exists('MercadoPago\Resources\MerchantOrder\Item')); // Deve dar true