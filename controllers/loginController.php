<?php
session_start();
require_once '../models/User.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mail = $_POST['mail'];
    $password = $_POST['password'];

    $userModel = new User();
    $user = $userModel->authenticate($username, $password);

    if ($user) {
        if ($user['tipo_usuario'] == 'admin') {
            echo json_encode(['status' => 'success', 'redirect' => '/views/admin.php']);
        } elseif ($user['tipo_usuario'] == 'employee') {
            echo json_encode(['status' => 'success', 'redirect' => '/views/employee.php']);
        } else {
            echo json_encode(['status' => 'success', 'redirect' => '/views/client.php']);
        }

        $_SESSION['user'] = $user['email'];
        $_SESSION['tipyuser'] = $user['tipo_usuario'];
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos']);
    }
}
?>
