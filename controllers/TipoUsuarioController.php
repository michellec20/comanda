<?php
session_start();// Inicia una nueva sesión o reanuda la sesión existente
// Incluye el archivo que contiene la definición de la clase 'TipoUsuario'
require_once '../models/mtoTipoUsuario.php';
// Establece el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');
// Inicializa un array para almacenar la respuesta
$response = array();
// Obtiene el método HTTP de la solicitud actual (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

try {
    $tipoUsuarioModel = new TipoUsuario();// Crea una instancia del modelo de 'Tipo Usuario'

    switch ($method) {// Verifica el método HTTP de la solicitud y actúa en consecuencia
        case 'GET':
            // Si la solicitud es GET y se pasa un parámetro 'id', lee un tipo de usuario específico
            if (isset($_GET['id'])) { 
                $response = $tipoUsuarioModel->read($_GET['id']);
            } else {
                // Si no se pasa 'id', lee todos los tipos de usuarios
                $response = $tipoUsuarioModel->readAll();
            }
            break;

        case 'POST':
            // Decodifica el cuerpo de la solicitud JSON en un array asociativo
            $data = json_decode(file_get_contents("php://input"), true);
            // Verifica que se haya pasado los campos requeridos
            if (!isset($data['tipo_usuario']) || !isset($data['descripcion_tipo_usuario'])) {
                throw new Exception('Datos incompletos'); // Si no, lanza una excepción indicando datos incompletos
            }
            // Llama al método create del modelo para crear un nuevo tipo de Usuario
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