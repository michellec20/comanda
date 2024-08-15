<?php

// Inicia una nueva sesión o reanuda la sesión existente
session_start();

// Incluye el archivo que contiene la definición de la clase 'Categoria'
require_once '../models/mtoCategoria.php';

// Establece el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Inicializa un array para almacenar la respuesta
$response = array();
// Obtiene el método HTTP de la solicitud actual (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

try {
    // Crea una instancia del modelo de 'Categoria'
    $categoriaModel = new Categoria();

    // Verifica el método HTTP de la solicitud y actúa en consecuencia
    switch ($method) {
        case 'GET':
            // Si la solicitud es GET y se pasa un parámetro 'id', lee una categoría específica
            if (isset($_GET['id'])) {
                $response = $categoriaModel->read($_GET['id']);
            } else {
                // Si no se pasa 'id', lee todas las categorías
                $response = $categoriaModel->readAll();
            }
            break;

        case 'POST':
            // Decodifica el cuerpo de la solicitud JSON en un array asociativo
            $data = json_decode(file_get_contents("php://input"), true);
            // Verifica que se haya pasado el campo 'nombre_categoria'
            if (!isset($data['nombre_categoria'])) {
                // Si no, lanza una excepción indicando datos incompletos
                throw new Exception('Datos incompletos');
            }
            // Llama al método create del modelo para crear una nueva categoría
            $categoriaModel->create($data['nombre_categoria']);
            // Establece la respuesta indicando éxito
            $response = ['status' => 'success', 'message' => 'Categoria de menú creado con éxito'];
            break;

        case 'PUT':
            // Decodifica el cuerpo de la solicitud JSON en un array asociativo
            $data = json_decode(file_get_contents("php://input"), true);
            // Verifica que se hayan pasado los campos 'id' y 'nombre_categoria'
            if (!isset($data['id']) || !isset($data['nombre_categoria'])) {
                // Si no, lanza una excepción indicando datos incompletos
                throw new Exception('Datos incompletos');
            }
            // Llama al método update del modelo para actualizar la categoría especificada
            $categoriaModel->update($data['id'], $data['nombre_categoria']);
            // Establece la respuesta indicando éxito
            $response = ['status' => 'success', 'message' => 'Categoria de menú actualizada con éxito'];
            break;

        case 'DELETE':
            // Decodifica el cuerpo de la solicitud JSON en un array asociativo
            $data = json_decode(file_get_contents("php://input"), true);
            // Verifica que se haya pasado el campo 'id'
            if (!isset($data['id'])) {
                // Si no, lanza una excepción indicando datos incompletos
                throw new Exception('Datos incompletos');
            }
            // Llama al método delete del modelo para eliminar la categoría especificada
            $categoriaModel->delete($data['id']);
            // Establece la respuesta indicando éxito
            $response = ['status' => 'success', 'message' => 'Categoria de menú eliminada con éxito'];
            break;

        default:
            // Si se utiliza un método HTTP no soportado, lanza una excepción
            throw new Exception('Método no permitido');
    }
} catch (Exception $e) {
    // Captura cualquier excepción y establece la respuesta indicando error
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

// Codifica el array de respuesta en formato JSON y lo imprime
echo json_encode($response);
?>
