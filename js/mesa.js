$(document).ready(function() {

    var deleteMesaId = null;
    var editMesaId = null;

    // Mostrar mensajes en el alert
    function showMessage(type, message) {
        $('.mensaje').html(
            '<div class="alert alert-' + type + ' alert-dismissible text-white fade show" role="alert"><span class="text-sm">'
            + message +'<button type="button" class="btn-close text-lg py-3 opacity-10" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }

    // Leer todos los tipos de usuario
    function loadNumMesa() {
        $.ajax({
            url: '../controllers/MesaController.php?cant=true',
            type: 'GET',
            dataType: 'text', // Asegurarse de que el tipo de datos esperado es texto
            success: function(response) {
                // Aquí podrías actualizar tu tabla o lista con los datos recibidos
                $('#num_mesa').val("");
                $('#num_mesa').val(response); // Usar la respuesta directamente como texto
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en mostrar datos: " + textStatus + " - " + errorThrown);
            }
        });
    }

    function readAllMesas() {
        $.ajax({
            url: '../controllers/MesaController.php',
            type: 'GET',
            success: function(response) {
                // Aquí podrías actualizar tu tabla o lista con los datos recibidos
                $('#body-t').empty();
                response.forEach(function(mesa) {
                    $('#body-t').append(
                        '<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + mesa.num_mesa + '</p></td>'+
                        '<td class="text-start"><p class="text-xs font-weight-bold mb-0">' + mesa.cant_personas + '</p></td>'+
                        '<td class="text-start"><p class="text-xs font-weight-bold mb-0">' + mesa.estado + '</p></td>'+
                        '<td class="text-center"><button class="btn bg-gradient-danger rw-20 mb-0 toast-btn deleteButton" data-id="' + mesa.num_mesa + '">Eliminar</button</td>'+
                        '<td class="text-center"><button class="btn bg-gradient-info mb-0 toast-btn editButton" data-id="' + mesa.num_mesa + '">Modificar</button></td></tr>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en mostrar datos: " + textStatus + " - " + errorThrown);
            }
        });
    }

    // Crear o modificar una mesa
    $('#actionMesaButton').click(function() {
        var num_mesa = $('#num_mesa').val();
        var cant_personas = $('#cant_personas').val();
        var estado = $('#estado').val();

        // Validación de campos vacíos
        if (!num_mesa || !cant_personas || !estado) {
            showMessage('danger', "Todos los campos son obligatorios");
            return;
        }

        var url = '../controllers/MesaController.php';
        var method = 'POST';
        var data = { num_mesa: num_mesa, cant_personas: cant_personas , estado : estado};

        if (editMesaId !== null) {
            method = 'PUT';
            delete data.num_mesa;
            data.id = editMesaId;
        }

        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showMessage('success', response.message);
                $('#actionMesaButton').text('Guardar');
                editMesaId = null;
                resetForm();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });


    // Abrir modal de confirmación de eliminación
    $('#mesaTable').on('click', '.deleteButton', function() {
        deleteMesaId = $(this).data('id');
        $('#confirmDeleteModal').modal('show');
    });

    // Confirmar eliminación
    $('#confirmDeleteButton').click(function() {
        if (deleteMesaId !== null) {
            $.ajax({
                url: '../controllers/MesaController.php',
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({ id: deleteMesaId }),
                success: function(response) {
                    showMessage('success', response.message);
                    $('#confirmDeleteModal').modal('hide');
                    resetForm();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showMessage('danger', "Error en la solicitud de eliminar: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    // Abrir formulario para edición
    $('#mesaTable').on('click', '.editButton', function() {
        var id = $(this).data('id');
        $.ajax({
            url: '../controllers/MesaController.php?id=' + id,
            type: 'GET',
            success: function(response) {
                $('#cant_personas').val(response.cant_personas);
                $('#estado').val(response.estado);
                $('#num_mesa').val(id);
                $('#actionMesaButton').text('Modificar');
                editMesaId = id;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud de busqueda: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Inicializar
    loadNumMesa();
    readAllMesas();

    function resetForm() {
        loadNumMesa();
        readAllMesas();
        document.getElementById("cant_personas").value = "";
        document.getElementById("estado").value = "";
    }
});