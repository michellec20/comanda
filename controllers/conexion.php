<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'comandaapp';
    private $username = 'root';
    private $password = '';
    public $con;

    public function getconexionection() {
        $this->con = null;
        try {
            $this->con = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "conexionection error: " . $exception->getMessage();
        }
        return $this->con;
    }
}
?>