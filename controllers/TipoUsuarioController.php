<?php
session_start();
require_once '../models/mtoTipoUsuario.php';

header('Content-Type: application/json');

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

try {
    $tipoUsuarioModel = new TipoUsuario();

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $response = $tipoUsuarioModel->read($_GET['id']);
            } else {
                $response = $tipoUsuarioModel->readAll();
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['tipo_usuario']) || !isset($data['descripcion_tipo_usuario'])) {
                throw new Exception('Datos incompletos');
            }
            $tipoUsuarioModel->create($data['tipo_usuario'], $data['descripcion_tipo_usuario']);
            $response = ['status' => 'success', 'message' => 'Tipo de usuario creado con éxito'];
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id']) || !isset($data['tipo_usuario']) || !isset($data['descripcion_tipo_usuario'])) {
                throw new Exception('Datos incompletos');
            }
            $tipoUsuarioModel->update($data['id'], $data['tipo_usuario'], $data['descripcion_tipo_usuario']);
            $response = ['status' => 'success', 'message' => 'Tipo de usuario actualizado con éxito'];
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id'])) {
                throw new Exception('Datos incompletos');
            }
            $tipoUsuarioModel->delete($data['id']);
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