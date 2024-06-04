<?php
require_once '../controllers/db_config.php';//Agregamos la conexion

class Producto {
    private $conn;//Variable de conexion
    private $table_name = "menuitem"; //variable que contiene el nombre de la tabla

    //Metodo constructor de la clase
    public function __construct() {
        $database = new Database();//Iinstanciamos la conexion
        $this->conn = $database->getConnection();//Asignamos la conexion a la variable previamente definida
    }

    //Funcion que muestra todos los registros de la tabla
    public function readAll() {
        $query = "SELECT id_item, nombre_categoria, nombre, descripcion, precio FROM menuitem m, categoria c WHERE m.id_categoria = c.id_categoria";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function read($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id_item = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($nombre, $descripcion, $precio, $id_categoria) {
        $query = "INSERT INTO " . $this->table_name . " (nombre, descripcion, precio, id_categoria) VALUES (:nombre, :descripcion, :precio, :id_categoria)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':id_categoria', $id_categoria);
        //$stmt->bindParam(':foto', PDO::PARAM_LOB);
        return $stmt->execute();
    }

    public function update($id, $nombre, $descripcion, $precio, $id_categoria) {
        $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, descripcion = :descripcion, precio = :precio, id_categoria = :id_categoria WHERE id_item = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':id_categoria', $id_categoria);
        //$stmt->bindParam(':foto', PDO::PARAM_LOB);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_item = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getCategoria() {
        $query = "SELECT * FROM categoria";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>