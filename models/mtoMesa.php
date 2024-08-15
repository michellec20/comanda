<?php
require_once '../controllers/db_config.php';//Agregamos la conexion

class Mesa {
    private $conn;//Variable de conexion
    private $table_name = "mesa"; //variable que contiene el nombre de la tabla

    //Metodo constructor de la clase
    public function __construct() {
        $database = new Database();//Iinstanciamos la conexion
        $this->conn = $database->getConnection();//Asignamos la conexion a la variable previamente definida
    }

    public function cantMesas(){
        $query = "SELECT COUNT(*)+1 AS numero FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$row['numero']; // Convertir el valor a entero
    }

    public function mesasDisponibles() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE estado = 'D'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //Funcion que muestra todos los registros de la tabla
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function read($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE num_mesa = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($num_mesa, $cant_personas, $estado) {
        $query = "INSERT INTO " . $this->table_name . " (num_mesa, cant_personas, estado) VALUES (:num_mesa, :cant_personas, :estado)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':num_mesa', $num_mesa);
        $stmt->bindParam(':cant_personas', $cant_personas);
        $stmt->bindParam(':estado', $estado);
        return $stmt->execute();
    }

    public function update($id, $cant_personas, $estado) {
        $query = "UPDATE " . $this->table_name . " SET cant_personas = :cant_personas, estado = :estado WHERE num_mesa = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':cant_personas', $cant_personas);
        $stmt->bindParam(':estado', $estado);
        return $stmt->execute();
    }

    public function update2($id, $estado) {
        $query = "UPDATE " . $this->table_name . " SET estado = :estado WHERE num_mesa = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':estado', $estado);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE num_mesa = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>