$(document).ready(function() {

    var deleteTipoUsuarioId = null;
    var editTipoUsuarioId = null;

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
                $('#body-t').empty();
                response.forEach(function(tipoUsuario) {
                    $('#body-t').append(
                        '<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + tipoUsuario.id_tipo_usuario + '</p></td>'+
                        '<td class="text-start"><p class="text-xs font-weight-bold mb-0">' + tipoUsuario.tipo_usuario + '</p></td>'+
                        '<td class="text-start"><p class="text-xs font-weight-bold mb-0">' + tipoUsuario.descripcion_tipo_usuario + '</p></td>'+
                        '<td class="text-center"><button class="btn bg-gradient-danger rw-20 mb-0 toast-btn deleteButton" data-id="' + tipoUsuario.id_tipo_usuario + '">Eliminar</button</td>'+
                        '<td class="text-center"><button class="btn bg-gradient-info mb-0 toast-btn editButton" data-id="' + tipoUsuario.id_tipo_usuario + '">Modificar</button></td></tr>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }

    // Crear nuevo tipo de usuario
    $('#actionTipoUsuarioButton').click(function() {
        var tipo_usuario = $('#tipo_usuario').val();
        var descripcion_tipo_usuario = $('#descripcion_tipo_usuario').val();

        // Validación de campos vacíos
        if (!tipo_usuario || !descripcion_tipo_usuario) {
            showMessage('danger', "Todos los campos son obligatorios");
            return;
        }

        var url = '../controllers/TipoUsuarioController.php';
        var method = 'POST';
        var data = { tipo_usuario: tipo_usuario, descripcion_tipo_usuario: descripcion_tipo_usuario };

        if (editTipoUsuarioId !== null) {
            method = 'PUT';
            data.id = editTipoUsuarioId;
        }

        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showMessage('success', response.message);
                readAllTipoUsuarios();
                resetForm();
                $('#createOrUpdateTipoUsuarioButton').text('Guardar');
                editTipoUsuarioId = null;
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

    // Abrir formulario para edición
    $('#tipoUsuarioTable').on('click', '.editButton', function() {
        var id = $(this).data('id');
        $.ajax({
            url: '../controllers/TipoUsuarioController.php?id=' + id,
            type: 'GET',
            success: function(response) {
                $('#tipo_usuario').val(response.tipo_usuario);
                $('#descripcion_tipo_usuario').val(response.descripcion_tipo_usuario);
                $('#actionTipoUsuarioButton').text('Modificar');
                editTipoUsuarioId = id;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Inicializar
    readAllTipoUsuarios();

    function resetForm() {
        document.getElementById("tipo_usuario").value = "";
        document.getElementById("descripcion_tipo_usuario").value = "";
    }
});