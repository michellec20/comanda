$(document).ready(function() {
    function fetchNewOrders() {
        $.ajax({
            url: '../controllers/PedidoCocina.php',
            type: 'GET',
            success: function(data) {
                // Limpiar el área de nuevos pedidos
                $('#nuevo').empty();

                // Verifica si hay datos y los recorre para mostrar los nuevos pedidos
                if (Array.isArray(data)) {
                    data.forEach(function(order) {
                        $('#nuevo').append('<div class="order-item">Pedido ID: ' + order.id_pedido + '</div>');
                    });
                } else if (data.id_pedido) {
                    $('#nuevo').append('<div class="order-item">Pedido ID: ' + data.id_pedido + '</div>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener los nuevos pedidos:', error);
            }
        });
    }

    // Refresca cada 5 segundos
    setInterval(fetchNewOrders, 5000);
});