<?php
    session_start();
    require_once '../models/mtologin.php';

    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $mail = $_POST['mail'];
        $password = $_POST['password'];

        $userModel = new mtologin();
        $user = $userModel->authenticate($mail, $password);

        if ($user) {
            $_SESSION['user'] = $user['mail'];
            $_SESSION['tpu'] = $user['id_tipo_usuario'];
            if ($user['id_tipo_usuario'] == 1) {
                echo json_encode(['status' => 'success', 'redirect' => '/comanda/views/admin.php']);
            } elseif ($user['id_tipo_usuario'] == 2) {
                echo json_encode(['status' => 'success', 'redirect' => '/comanda/views/employee.php']);
            } elseif ($user['id_tipo_usuario'] == 3) {
                echo json_encode(['status' => 'success', 'redirect' => '/comanda/views/employee.php']);
            }else {
                echo json_encode(['status' => 'success', 'redirect' => '/comanda/views/client.php']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    }
?>