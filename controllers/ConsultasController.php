<?php

	function consultarMesas() {
		try {
			include("db_config.php");
			$conn;//Variable de conn
			$database = new Database();//Iinstanciamos la conn
        	$conn = $database->getConnection();//Asignamos la conn a la variable previamente definida
		    $sql = "SELECT num_mesa, cant_personas, CASE WHEN estado = 'D' THEN 'DISPONIBLE' WHEN estado = 'O' THEN 'OCUPADO' WHEN estado = 'L' THEN 'LIMPIANDO' WHEN estado = 'M' THEN 'EN MANTENIMIENTO' END AS estado  FROM mesa";
			$stmt = $conn->prepare($sql);
			$stmt->execute();

			// Obtener todos los resultados
			$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// Verificar si hay resultados
			if (!empty($results)) {
				$mesas = array();
			    // Recorrer los resultados
			    foreach ($results as $row) {
			    	$mesa = array(
			        	// Acceder a los valores
			        	'num_mesa' => $row['num_mesa'],
			        	'cant_personas' => $row['cant_personas'],
			        	'estado' => $row['estado']
			    	);
			    	$mesas[] = $mesa;
			    }
			    
		        // Devolver el arreglo con los datos
		        return $mesas;
			} else {

		        // Devolver un arreglo vacío si no se encontraron registros
		        return array();
		    }
		} catch (Exception $e) {
			error_log($e->getMessage());
			return array();
		}
	}
	
?>