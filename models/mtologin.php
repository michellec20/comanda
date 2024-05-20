<?php
    require_once '../controllers/db_config.php';

    class mtologin {
        private $conn;
        private $table_name = "usuario";

        public function __construct() {
            $database = new Database();
            $this->conn = $database->getConnection();
        }

        public function authenticate($mail, $password) {
            $query = "SELECT * FROM " . $this->table_name . " WHERE mail = :mail AND password = :password";
            $stmt = $this->conn->prepare($query);

            // Bind parameters
            $stmt->bindParam(':mail', $mail);
            $stmt->bindParam(':password', $password);

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return false;
            }
        }
    }
?>