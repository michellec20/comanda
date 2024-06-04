<?php
session_start();
require_once '../models/mtoCategoria.php';

header('Content-Type: application/json');

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

try {
    $categoriaModel = new Categoria();

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $response = $categoriaModel->read($_GET['id']);
            } else {
                $response = $categoriaModel->readAll();
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['nombre_categoria'])) {
                throw new Exception('Datos incompletos');
            }
            $categoriaModel->create($data['nombre_categoria']);
            $response = ['status' => 'success', 'message' => 'Categoria de menú creado con éxito'];
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id']) || !isset($data['nombre_categoria'])) {
                throw new Exception('Datos incompletos');
            }
            $categoriaModel->update($data['id'], $data['nombre_categoria']);
            $response = ['status' => 'success', 'message' => 'Categoria de menú actualizada con éxito'];
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id'])) {
                throw new Exception('Datos incompletos');
            }
            $categoriaModel->delete($data['id']);
            $response = ['status' => 'success', 'message' => 'Categoria de menú eliminada con éxito'];
            break;

        default:
            throw new Exception('Método no permitido');
    }
} catch (Exception $e) {
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);
?>