$(document).ready(function() {

    var deleteCategoriaId = null;
    var editCategoriaId = null;

    // Mostrar mensajes en el alert
    function showMessage(type, message) {
        $('.mensaje').html(
            '<div class="alert alert-' + type + ' alert-dismissible text-white fade show" role="alert">'+
            '<span class="text-sm">'+ message + '</span>'+
            '<button type="button" class="btn-close text-lg py-3 opacity-10" data-dismiss="alert" aria-label="Close">'+'<span aria-hidden="true">&times;</span></button></div>'
        );
    }

    // Leer todos los tipos de usuario
    function readAllCategorias() {
        $.ajax({
            url: '../controllers/CategoriaController.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
                // Aquí podrías actualizar tu tabla o lista con los datos recibidos
                $('#body-t').empty();
                response.forEach(function(categoria) {
                    $('#body-t').append(
                        '<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + categoria.id_categoria + '</p></td>'+
                        '<td class="text-center"><p class="text-xs font-weight-bold mb-0">' + categoria.nombre_categoria + '</p></td>'+
                        '<td class="text-center"><button class="btn bg-gradient-danger rw-20 mb-0 toast-btn deleteButton" data-id="'+ categoria.id_categoria + '">Eliminar</button></td>'+
                        '<td class="text-center"><button class="btn bg-gradient-info mb-0 toast-btn editButton" data-id="' + categoria.id_categoria + '">Modificar</button></td></tr>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }

    // Crear nuevo tipo de usuario
    $('#actionCategoriaButton').click(function() {
        var nombre_categoria = $('#nomcategoria').val();

        // Validación de campos vacíos
        if (!nombre_categoria) {
            showMessage('danger', "Todos los campos son obligatorios");
            return;
        }

        var url = '../controllers/CategoriaController.php';
        var method = 'POST';
        var data = { nombre_categoria: nombre_categoria };

        if (editCategoriaId !== null) {
            method = 'PUT';
            data.id = editCategoriaId;
        }

        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showMessage('success', response.message);
                readAllCategorias();
                resetForm();
                $('#actionCategoriaButton').text('Guardar');
                editCategoriaId = null;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Abrir modal de confirmación de eliminación
    $('#categoriaTable').on('click', '.deleteButton', function() {
        deleteCategoriaId = $(this).data('id');
        $('#confirmDeleteModal').modal('show');
    });

    // Confirmar eliminación
    $('#confirmDeleteButton').click(function() {
        if (deleteCategoriaId !== null) {
            $.ajax({
                url: '../controllers/CategoriaController.php',
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({ id: deleteCategoriaId }),
                success: function(response) {
                    showMessage('success', response.message);
                    $('#confirmDeleteModal').modal('hide');
                    readAllCategorias();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    // Abrir formulario para edición
    $('#categoriaTable').on('click', '.editButton', function() {
        var id = $(this).data('id');
        $.ajax({
            url: '../controllers/CategoriaController.php?id=' + id,
            type: 'GET',
            success: function(response) {
                $('#nomcategoria').val(response.nombre_categoria);
                $('#actionCategoriaButton').text('Modificar');
                editCategoriaId = id;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Inicializar
    readAllCategorias();

    function resetForm() {
        document.getElementById("nomcategoria").value = "";
    }
});