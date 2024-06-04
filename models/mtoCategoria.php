<?php
require_once '../controllers/db_config.php';//Agregamos la conexion

class Categoria {
    private $conn;//Variable de conexion
    private $table_name = "categoria"; //variable que contiene el nombre de la tabla

    //Metodo constructor de la clase
    public function __construct() {
        $database = new Database();//Iinstanciamos la conexion
        $this->conn = $database->getConnection();//Asignamos la conexion a la variable previamente definida
    }

    //Funcion que muestra todos los registros de la tabla
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id_categoria";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function read($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id_categoria = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($nombre_categoria) {
        $query = "INSERT INTO " . $this->table_name . " (nombre_categoria) VALUES (:nombre_categoria)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nombre_categoria', $nombre_categoria);
        return $stmt->execute();
    }

    public function update($id, $nombre_categoria) {
        $query = "UPDATE " . $this->table_name . " SET nombre_categoria = :nombre_categoria WHERE id_categoria = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre_categoria', $nombre_categoria);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_categoria = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>