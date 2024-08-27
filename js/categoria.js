$(document).ready(function() { 

    // Variables para almacenar el ID de la categoría a eliminar o editar
    var deleteCategoriaId = null;
    var editCategoriaId = null;

    // Función para mostrar mensajes en el alert
    // type: Tipo de alerta (ej. 'success', 'danger')
    // message: El mensaje que se mostrará en la alerta
    function showMessage(type, message) {
        $('.mensaje').html(
            '<div class="alert alert-' + type + ' alert-dismissible text-white fade show" role="alert">'+
            '<span class="text-sm">'+ message + '</span>'+
            '<button type="button" class="btn-close text-lg py-3 opacity-10" data-dismiss="alert" aria-label="Close">'+'<span aria-hidden="true">&times;</span></button></div>'
        );
    }

    // Función para leer todas las categorías de la base de datos y mostrarlas en la tabla
    function readAllCategorias() {
        $.ajax({
            url: '../controllers/CategoriaController.php',// URL del controlador que manejará la solicitud
            type: 'GET',// Tipo de solicitud (en este caso, una solicitud GET para obtener datos)
            success: function(response) {// Mostrar respuesta en la consola (para depuración)
                $('#body-t').empty();// Limpiar el cuerpo de la tabla antes de llenarlo con los nuevos datos
                response.forEach(function(categoria) {// Recorrer cada categoría recibida en la respuesta
                    $('#body-t').append(
                        '<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + categoria.id_categoria + '</p></td>'+
                        '<td class="text-center"><p class="text-xs font-weight-bold mb-0">' + categoria.nombre_categoria + '</p></td>'+
                        '<td class="text-center"><button class="btn bg-gradient-danger rw-20 mb-0 toast-btn deleteButton" data-id="'+ categoria.id_categoria + '">Eliminar</button></td>'+
                        '<td class="text-center"><button class="btn bg-gradient-info mb-0 toast-btn editButton" data-id="' + categoria.id_categoria + '">Modificar</button></td></tr>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Mostrar mensaje de error en caso de fallo en la solicitud
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }

    // Función para crear o actualizar una categoría
    $('#actionCategoriaButton').click(function() {
        var nombre_categoria = $('#nomcategoria').val();// Obtener el valor del campo de nombre de categoría

        // Validación para asegurarse de que todos los campos estén llenos
        if (!nombre_categoria) {
            showMessage('danger', "Todos los campos son obligatorios");
            return;
        }

        var url = '../controllers/CategoriaController.php';// URL del controlador
        var method = 'POST';// Método por defecto para crear una nueva categoría
        var data = { nombre_categoria: nombre_categoria };// Datos a enviar en la solicitud

        // Si se está editando una categoría, cambiar el método a PUT y agregar el ID de la categoría
        if (editCategoriaId !== null) {
            method = 'PUT';
            data.id = editCategoriaId;
        }

        // Enviar solicitud AJAX para crear o actualizar la categoría
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showMessage('success', response.message);// Mostrar mensaje de éxito
                readAllCategorias(); // Actualizar la lista de categorías
                resetForm(); // Restablecer el formulario
                $('#actionCategoriaButton').text('Guardar'); // Cambiar el texto del botón a "Guardar"
                editCategoriaId = null; // Restablecer el ID de edición
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Mostrar mensaje de error
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Abrir el modal de confirmación de eliminación al hacer clic en el botón de eliminar
    $('#categoriaTable').on('click', '.deleteButton', function() {
        deleteCategoriaId = $(this).data('id'); // Obtener el ID de la categoría a eliminar
        $('#confirmDeleteModal').modal('show'); // Mostrar el modal de confirmación de eliminación
    });

    // Confirmar la eliminación de la categoría
    $('#confirmDeleteButton').click(function() {
        if (deleteCategoriaId !== null) {
            $.ajax({// Enviar solicitud AJAX para eliminar la categoría
                url: '../controllers/CategoriaController.php',
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({ id: deleteCategoriaId }),
                success: function(response) {
                    showMessage('success', response.message); // Mostrar mensaje de éxito
                    $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                    readAllCategorias(); // Actualizar la lista de categorías
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // Mostrar mensaje de error
                    showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    // Abrir el formulario para editar una categoría
    $('#categoriaTable').on('click', '.editButton', function() {
        var id = $(this).data('id'); // Obtener el ID de la categoría a editar
        $.ajax({
            url: '../controllers/CategoriaController.php?id=' + id,
            type: 'GET',
            success: function(response) {
                $('#nomcategoria').val(response.nombre_categoria); // Llenar el campo de nombre con el valor actual de la categoría
                $('#actionCategoriaButton').text('Modificar'); // Cambiar el texto del botón a "Modificar"
                editCategoriaId = id; // Establecer el ID de la categoría a editar
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown); // Mostrar mensaje de error
            }
        });
    });

    // Llamar a la función para cargar todas las categorías al cargar la página
    readAllCategorias();

    // Función para restablecer el formulario
    function resetForm() {
        document.getElementById("nomcategoria").value = ""; // Limpiar el campo de nombre de categoría
    }
});