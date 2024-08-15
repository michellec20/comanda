<?php
session_start();
require_once '../models/mtoPedido.php';
require_once '../models/mtoMesa.php';
require_once '../models/mtoProducto.php';

header('Content-Type: application/json');

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

try {
    //$pedidoModel = new Pedido();
    $mesaModel = new Mesa();
    $productoModel = new Producto();

    switch ($method) {
        case 'GET':
            if(isset($_GET['mesa'])){
                $response = $mesaModel->mesasDisponibles();
            }
            else if (isset($_GET['productos'])) {
                $response = $productoModel->obtenerProductos();
            }
            break;
        case 'PUT':
            // Decodifica el cuerpo de la solicitud JSON en un array asociativo
            $data = json_decode(file_get_contents("php://input"), true);
            // Verifica que se haya pasado los campos
            if (!isset($data['num_mesa']) || !isset($data['estado'])) {
                // Si no, lanza una excepción indicando datos incompletos
                throw new Exception('Datos incompletos');
            }
            // Llama al método update del modelo para actualizar la mesa especificada con cantidad de personas y estado
            $mesaModel->update2($data['num_mesa'], $data['estado']);
            // Establece la respuesta indicando éxito
            $response = ['status' => 'success', 'message' => 'Mesa actualizada con éxito'];
            break;
        default:
            throw new Exception('Método no permitido');
    }
} catch (Exception $e) {
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);
?>