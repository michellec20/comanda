<?php
require_once '../controllers/conexion.php';

class User {
    private $conectar;
    private $table_name = "usuario";

    public function __construct() {
        $database = new Database();
        $this->conectar = $database->getconectarection();
    }

    public function authenticate($email, $password) {
        $query = "SELECT tipo_usuario,email FROM " . $this->mail . " WHERE email = :email AND contrasenia = :password";
        $stmt = $this->conectar->prepare($query);

        // Bind parameters
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':contrasenia', $password);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }
}
?>
