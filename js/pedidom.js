$(document).ready(function() {
    //Variable que contrala el numero de mesa seleccionada
    var mesa = null;

    // Mostrar mensajes en el alert
    function showMessage(type, message) {
        //Aperturamos el elemento html y agregamos el mensaje
        $('.mensaje').html(
            '<div class="alert alert-' + type + ' alert-dismissible text-white fade show" role="alert"><span class="text-sm">'
            + message +'<button type="button" class="btn-close text-lg py-3 opacity-10" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }

    //Funcion para cargar las mesas disponibles
    function cargarMesasDisponibles(){
        //Deshabilitando el boton para agregar productos
        $.ajax({
            url: '../controllers/PedidoController.php?mesa=true',
            type: 'GET',
            success: function(response) {
                var select = $('#mesas');
                select.empty(); // Limpiar el select
                if(response.length===0)
                    select.append('<option>Sin mesas disponibles</option>');
                else {
                    response.forEach(function(mesa) {
                        select.append('<option value="' + mesa.num_mesa + '">Num. Mesa: ' + mesa.num_mesa + '&emsp;|&emsp;Máx. Personas: ' + mesa.cant_personas + '</option>');
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error al cargar mesas disponibles: " + textStatus + " - " + errorThrown);
            }
        });
    }

    cargarMesasDisponibles();

    $('#selectMesa').click(function() {
        mesa = $('#mesas').val();
        var data = { num_mesa : mesa, estado : 'O'};
        $.ajax({
            url: '../controllers/PedidoController.php',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                cargarMesasDisponibles();
                $('#selectMesa').prop('disabled', true);
                $('#btns').append('<button type="button" id="changeMesa" class="btn bg-gradient-warning toast-btn">CAMBIAR DE MESA</button>');
                $('#btns').append('<button type="button" id="newProduct" class="btn bg-gradient-info toast-btn" data-bs-toggle="modal" data-bs-target="#productModal">+ PRODUCTO</button>');
                $('#dato').append('<div class="mb-2 form-inline><label class="form-label" for="fecha">Fecha:</label><input type="text" class="form-control border" id="fecha" readonly></div><div class="mb-2"></div>');
                $('#dato').append('<div class="form-inline"><label class="form-label" for="cliente">Cliente:</label><select name="cliente" id="cliente" class="form-control border"></select><button type="button" id="selectCliente" class="btn bg-gradient-info toast-btn">Seleccionar</button></div>');
                $('#tdatos').empty();
                $('#tdatos').append('<div class="d-flex align-items-center mb-2"><label class="form-label me-2" for="total">Total: $</label><div class="col-8"><input type="text" class="form-control border" id="total" readonly></div></div>');
                $('#fin').append('<div class="mb-2"><button type="button" id="realizarPedido" class="btn bg-gradient-success toast-btn">REALIZAR PEDIDO</button></div>');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    $(document).on('click', '#changeMesa', function() {
        var data = { num_mesa : mesa, estado : 'D'};
        $.ajax({
            url: '../controllers/PedidoController.php',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                cargarMesasDisponibles();
                $('#selectMesa').prop('disabled', false);
                $('#fin').empty();
                $('#btns').empty();
                $('#dato').empty();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Cargar productos en el modal
    $(document).on('click', '#newProduct', function() {
        $.ajax({
            url: '../controllers/PedidoController.php?productos=true',
            type: 'GET',
            success: function(response) {
                var productTable = $('#productTable').DataTable();
                productTable.clear();
                response.forEach(function(producto) {
                    productTable.row.add([
                        producto.nombre,
                        producto.precio,
                        '<input type="number" class="form-control" id="cantidad_' + producto.id_item + '" min="1" value="1">',
                        '<button type="button" class="btn bg-gradient-info addProduct" data-id="' + producto.id_item + '" data-nombre="' + producto.nombre + '" data-precio="' + producto.precio + '">Agregar</button>'
                    ]).draw();
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error al cargar productos: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Agregar producto seleccionado a la tabla de pedidos
    $(document).on('click', '.addProduct', function() {
        var id_item = $(this).data('id');
        var nombre = $(this).data('nombre');
        var precio = $(this).data('precio');
        var cantidad = $('#cantidad_' + id_item).val();

        var nuevaFila = '<tr>' +
            '<td class="text-center">' + id_item + '</td>' +
            '<td>' + nombre + '</td>' +
            '<td class="text-center">' + cantidad + '</td>' +
            '<td class="text-center">' + precio + '</td>' +
            '<td class="text-center">' + (cantidad * precio) + '</td>' +
            '<td class="text-center"><button type="button" class="btn btn-danger removeProduct">Eliminar</button></td>' +
            '</tr>';

        $('#body-t').append(nuevaFila);
        $('#productModal').modal('hide');
    });

    // Eliminar producto de la tabla de pedidos
    $(document).on('click', '.removeProduct', function() {
        $(this).closest('tr').remove();
    });

    // Inicializar DataTable para productos
    $('#productTable').DataTable({
        "language": {//Asignamos el lenguaje de la datatable
            "url": "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
        }
    });
});
