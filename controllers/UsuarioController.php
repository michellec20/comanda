<?php
session_start();
require_once '../models/mtoUsuario.php';

header('Content-Type: application/json');

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

try {
    $usuarioModel = new Usuario();

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $response = $usuarioModel->read($_GET['id']);
            } else {
                $response = $usuarioModel->readTable();
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['usuario']) || !isset($data['descripcion_usuario'])) {
                throw new Exception('Datos incompletos');
            }
            $usuarioModel->create($data['usuario'], $data['descripcion_usuario']);
            $response = ['status' => 'success', 'message' => 'Tipo de usuario creado con éxito'];
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id']) || !isset($data['usuario']) || !isset($data['descripcion_usuario'])) {
                throw new Exception('Datos incompletos');
            }
            $usuarioModel->update($data['id'], $data['usuario'], $data['descripcion_usuario']);
            $response = ['status' => 'success', 'message' => 'Tipo de usuario actualizado con éxito'];
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id'])) {
                throw new Exception('Datos incompletos');
            }
            $usuarioModel->delete($data['id']);
            $response = ['status' => 'success', 'message' => 'Tipo de usuario eliminado con éxito'];
            break;

        default:
            throw new Exception('Método no permitido');
    }
} catch (Exception $e) {
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);
?>