// controllers/LoginController.php
<?php
session_start();
require_once '../models/User.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $userModel = new User();
    $user = $userModel->authenticate($username, $password);

    if ($user) {
        $_SESSION['user'] = $user;
        if ($user['tipo_usuario'] == 'admin') {
            echo json_encode(['status' => 'success', 'redirect' => '/views/admin.php']);
        } elseif ($user['tipo_usuario'] == 'employee') {
            echo json_encode(['status' => 'success', 'redirect' => '/views/employee.php']);
        } else {
            echo json_encode(['status' => 'success', 'redirect' => '/views/client.php']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos']);
    }
}
?>
