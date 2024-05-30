$(document).ready(function() {

    var deleteTipoUsuarioId = null;

    // Mostrar mensajes en el alert
    function showMessage(type, message) {
        $('.mensaje').html(
            '<div class="alert alert-' + type + ' alert-dismissible text-white fade show" role="alert"><span class="text-sm">'
            + message +'<button type="button" class="btn-close text-lg py-3 opacity-10" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }

    // Leer todos los tipos de usuario
    function readAllTipoUsuarios() {
        $.ajax({
            url: '../controllers/TipoUsuarioController.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
                // Aquí podrías actualizar tu tabla o lista con los datos recibidos
                $('#tipoUsuarioTable').empty();
                response.forEach(function(tipoUsuario) {
                    $('#tipoUsuarioTable').append('<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + tipoUsuario.id_tipo_usuario + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + tipoUsuario.tipo_usuario + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + tipoUsuario.descripcion_tipo_usuario + '</p></td><td class="text-center"><button class="btn bg-gradient-danger rw-20 mb-0 toast-btn margen-button deleteButton" data-id="' + tipoUsuario.id_tipo_usuario + '">Eliminar</button><button class="btn bg-gradient-info w-25 mb-0 toast-btn margen-button">Modificar</button></td></tr>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }

    // Crear nuevo tipo de usuario
    $('#createTipoUsuarioButton').click(function() {
        var tipo_usuario = $('#tipo_usuario').val();
        var descripcion_tipo_usuario = $('#descripcion_tipo_usuario').val();

        // Validación de campos vacíos
        if (!tipo_usuario || !descripcion_tipo_usuario) {
            showMessage('danger', "Todos los campos son obligatorios");
            return;
        }

        $.ajax({
            url: '../controllers/TipoUsuarioController.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ tipo_usuario: tipo_usuario, descripcion_tipo_usuario: descripcion_tipo_usuario }),
            success: function(response) {
                showMessage('success', response.message);
                readAllTipoUsuarios();
                resetForm();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Actualizar tipo de usuario
    $('#updateTipoUsuarioButton').click(function() {
        var id = $('#tipo_usuario_id').val();
        var tipo_usuario = $('#tipo_usuario').val();
        var descripcion_tipo_usuario = $('#descripcion_tipo_usuario').val();

        $.ajax({
            url: '../comanda/controllers/TipoUsuarioController.php',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ id: id, tipo_usuario: tipo_usuario, descripcion_tipo_usuario: descripcion_tipo_usuario }),
            success: function(response) {
                showMessage('success', response.message);
                readAllTipoUsuarios();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Abrir modal de confirmación de eliminación
    $('#tipoUsuarioTable').on('click', '.deleteButton', function() {
        deleteTipoUsuarioId = $(this).data('id');
        $('#confirmDeleteModal').modal('show');
    });

    // Confirmar eliminación
    $('#confirmDeleteButton').click(function() {
        if (deleteTipoUsuarioId !== null) {
            $.ajax({
                url: '../controllers/TipoUsuarioController.php',
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({ id: deleteTipoUsuarioId }),
                success: function(response) {
                    showMessage('success', response.message);
                    $('#confirmDeleteModal').modal('hide');
                    readAllTipoUsuarios();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    // Inicializar
    readAllTipoUsuarios();

    function resetForm() {
        document.getElementById("tipo_usuario").value = "";
        document.getElementById("descripcion_tipo_usuario").value = "";
    }
});