$(document).ready(function() {

    var deleteUsuarioId = null;

    // Mostrar mensajes en el alert
    function showMessage(type, message) {
        $('.mensaje').html(
            '<div class="alert alert-' + type + ' alert-dismissible text-white fade show" role="alert"><span class="text-sm">'
            + message +'<button type="button" class="btn-close text-lg py-3 opacity-10" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }

    // Leer todos los usuario
    function readAllUsuarios() {
        $.ajax({
            url: '../controllers/UsuarioController.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
                // Aquí podrías actualizar tu tabla o lista con los datos recibidos
                $('#body-t').empty();
                response.forEach(function(usuario) {
                    $('#body-t').append('<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' 
                        + usuario.id_usuario + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">' 
                        + usuario.tipo_usuario + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">' 
                        + usuario.nombre_usuario + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">' 
                        + usuario.apellido_usuario + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">'
                        + usuario.mail + '</p></td><td class="text-center"><p class="text-xs font-weight-bold mb-0">' 
                        + usuario.fecha_creacion + '</p></td><td class="text-center"><button class="btn bg-gradient-danger rw-20 mb-0 toast-btn deleteButton" data-id="' 
                        + usuario.id_usuario + '">Eliminar</button></td><td class="text-center"><button class="btn bg-gradient-info w-25 mb-0 toast-btn">Modificar</button></td></tr>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }

    // Crear nuevo usuario
    $('#createUsuarioButton').click(function() {
        var tipo_usuario = $('#tipo_usuario').val();
        var nombre_usuario = $('#nombre_usuario').val();
        var apellido_usuario = $('#apellido_usuario').val();
        var mail = $('#mail').val();
        var password = $('#password').val();

        $.ajax({
            url: '../controllers/usuarioController.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ tipo_usuario: tipo_usuario,nombre_usuario: nombre_usuario, apellido_usuario: apellido_usuario, mail : mail, password : password}),
            success: function(response) {
                showMessage('success', response.message);
                readAllUsuarios();
                resetForm();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Actualizar tipo de usuario
    $('#updateUsuarioButton').click(function() {
        var id = $('#tipo_usuario_id').val();
        var tipo_usuario = $('#tipo_usuario').val();
        var descripcion_tipo_usuario = $('#descripcion_tipo_usuario').val();

        $.ajax({
            url: '../comanda/controllers/usuarioController.php',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ id: id, tipo_usuario: tipo_usuario, descripcion_tipo_usuario: descripcion_tipo_usuario }),
            success: function(response) {
                showMessage('success', response.message);
                readAllUsuarios();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Abrir modal de confirmación de eliminación
    $('#usuarioTable').on('click', '.deleteButton', function() {
        deleteUsuarioId = $(this).data('id');
        $('#confirmDeleteModal').modal('show');
    });

    // Confirmar eliminación
    $('#confirmDeleteButton').click(function() {
        if (deleteusuarioId !== null) {
            $.ajax({
                url: '../controllers/usuarioController.php',
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({ id: deleteUsuarioId }),
                success: function(response) {
                    showMessage('success', response.message);
                    $('#confirmDeleteModal').modal('hide');
                    readAllUsuarios();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    // Inicializar
    readAllUsuarios();

    function resetForm() {
        document.getElementById("tipo_usuario").value = "";
        document.getElementById("nombre_usuario").value = "";
        document.getElementById("apellido_usuario").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("password").value = "";
    }
});