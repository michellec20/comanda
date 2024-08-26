<?php
session_start();// Inicia una nueva sesión o reanuda la sesión existente
require_once '../models/mtologin.php';// Incluye el archivo que contiene la definición de la clase 'Login'

header('Content-Type: application/json');// Establece el tipo de contenido de la respuesta como JSON

$response = array();//Inicializa un array para almacenar la respuesta

try {

    //Consultamos que tipo de metodo optiene el servidor
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        //asignamos a una variable el dato enviado y consultamos a la vez si esta vacio o no
        $mail = isset($_POST['mail']) ? $_POST['mail'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        $userModel = new mtologin();//Instanciamos el modelo del Login
        $user = $userModel->authenticate($mail, $password); //Mandamos los datos a la autenticación

        //Consultamos que tipo de respuesta
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
