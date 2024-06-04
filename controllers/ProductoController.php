<?php
session_start();
require_once '../models/mtoProducto.php';

header('Content-Type: application/json');

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

try {
    $productoModel = new Producto();

    switch ($method) {
        case 'GET':
            if (isset($_GET['categoria'])) {
                $response = $productoModel->getCategoria();
            } else if (isset($_GET['id'])) {
                $response = $productoModel->read($_GET['id']);
            } else {
                $response = $productoModel->readAll();
            }
            break;

        case 'POST':
            try {
                $data = json_decode(file_get_contents("php://input"), true);
                if (!isset($data['nombre']) || !isset($data['descripcion']) || !isset($data['precio']) || !isset($data['id_categoria'])) {
                    throw new Exception('Datos incompletos del update');
                }
                //$foto = file_get_contents($_FILES['foto']['tmp_name']);

                $productoModel->create($data['nombre'],$data['descripcion'],$data['precio'],$data['id_categoria']);
                $response = ['status' => 'success', 'message' => 'Producto creado con éxito'];
            } catch (Exception $e) {
                $response = $e->getMessage();
            }
            break;

        case 'PUT':
            try {
                $data = json_decode(file_get_contents("php://input"), true);
                if (!isset($data['id']) || !isset($data['nombre']) || !isset($data['descripcion']) || !isset($data['precio']) || !isset($data['id_categoria'])) {
                    throw new Exception('Datos incompletos del update');
                }
                $productoModel->update($data['id'],$data['nombre'],$data['descripcion'],$data['precio'],$data['id_categoria']);
                    $response = ['status' => 'success', 'message' => 'Producto actualizado con éxito'];
            } catch (Exception $e) {
                $response = $e->getMessage();
            }
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['id'])) {
                throw new Exception('Datos incompletos');
            }
            $productoModel->delete($data['id']);
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