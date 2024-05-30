<?php
session_start();
require_once '../models/mtologin.php';

header('Content-Type: application/json');

$response = array();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $mail = isset($_POST['mail']) ? $_POST['mail'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        $userModel = new mtologin();
        $user = $userModel->authenticate($mail, $password);

        if ($user) {
            $_SESSION['user'] = $user['mail'];
            $_SESSION['tpu'] = $user['id_tipo_usuario'];
            if ($user['id_tipo_usuario'] == 1) {
                 $response = ['status' => 'success', 'redirect' => '../comanda/views/admin.php'];
            } elseif ($user['id_tipo_usuario'] == 2) {
                $response = ['status' => 'success', 'redirect' => '../comanda/views/mesero.php'];
            } elseif ($user['id_tipo_usuario'] == 3) {
                $response = ['status' => 'success', 'redirect' => '../comanda/views/cocinero.php'];
            }elseif ($user['id_tipo_usuario'] == 4) {
                $response = ['status' => 'success', 'redirect' => '../comanda/views/clinte.php'];
            }
            else {
                $response = ['status' => 'success', 'redirect' => '../comanda/login.php?er=na'];
            }
        } else {
            throw new Exception('Correo o contraseña incorrectos ' .$user. " ERROR");
        }
    } else {
        throw new Exception('Método no permitido.');
    }
} catch (Exception $e) {
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);
?>
