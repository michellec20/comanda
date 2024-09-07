<?php
require_once '../controllers/db_config.php';//Agregamos la conexion

class Pedido {
    private $conn;//Variable de conexion
    private $table_name = "pedido"; //variable que contiene el nombre de la tabla

    //Metodo constructor de la clase
    public function __construct() {
        $database = new Database();//Iinstanciamos la conexion
        $this->conn = $database->getConnection();//Asignamos la conexion a la variable previamente definida
    }

    //Funcion que muestra todos los registros de la tabla
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE estado = 'Nuevo' ORDER BY fecha_pedido DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
        error_log("Este es un mensaje de prueba.");
    }

    public function read($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE estado = 'Nuevo' AND id_pedido = ". $id ." ORDER BY fecha_pedido DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>