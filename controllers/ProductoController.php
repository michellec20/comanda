<?php
session_start();
require_once '../models/mtoProducto.php';

header('Content-Type: application/json');

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

// Detectamos si se está simulando un método PUT
if ($method == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
    $method = 'PUT';
}

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
                $nombre = $_POST['nombre'];
                $descripcion = $_POST['descripcion'];
                $precio = $_POST['precio'];
                $id_categoria = $_POST['id_categoria'];
                $foto = $_FILES['foto'];

                if (!isset($nombre) || !isset($descripcion) || !isset($precio) || !isset($id_categoria) || !isset($foto)) {
                    throw new Exception('Datos incompletos al guardar');
                }

                if (isset($_FILES['foto']) && $_FILES['foto']['tmp_name']) {
                    $foto = $_FILES['foto'];
                    $extension = pathinfo($foto['name'], PATHINFO_EXTENSION);
                    $fotoPath = '../img/products/' . $nombre . '.' . $extension;
                    if (!move_uploaded_file($foto['tmp_name'], $fotoPath)) {
                        throw new Exception('Error al subir la imagen');
                    }
                }

                $productoModel->create($nombre, $descripcion, $precio, $id_categoria, $fotoPath);
                $response = ['status' => 'success', 'message' => 'Producto creado con éxito'];
            } catch (Exception $e) {
                $response = ['status' => 'error', 'message' => $e->getMessage()];
            }
            break;

        case 'PUT':
            try {
                // Usamos $_POST para obtener los datos de la solicitud PUT
                $id = $_POST['id'];
                $nombre = $_POST['nombre'];
                $descripcion = $_POST['descripcion'];
                $precio = $_POST['precio'];
                $id_categoria = $_POST['id_categoria'];
                $foto_actual = $_POST['foto_actual'];

                if (!isset($id) || !isset($nombre) || !isset($descripcion) || !isset($precio) || !isset($id_categoria)) {
                    throw new Exception('Datos incompletos del update');
                }

                $fotoPath = $foto_actual;
                if (isset($_FILES['foto']) && $_FILES['foto']['tmp_name']) {
                    $foto = $_FILES['foto'];
                    $extension = pathinfo($foto['name'], PATHINFO_EXTENSION);
                    $fotoPath = '../img/products/' . $nombre . '.' . $extension;
                    if (!move_uploaded_file($foto['tmp_name'], $fotoPath)) {
                        throw new Exception('Error al subir la imagen');
                    }
                }

                $productoModel->update($id, $nombre, $descripcion, $precio, $id_categoria, $fotoPath);
                $response = ['status' => 'success', 'message' => 'Producto actualizado con éxito'];
            } catch (Exception $e) {
                $response = ['status' => 'error', 'message' => $e->getMessage()];
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