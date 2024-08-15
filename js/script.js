$(document).ready(function() {
    var tap = null;

    // Leer todos los tipos de usuario
    function readAllCategorias() {
        $.ajax({
            url: '../controllers/CategoriaController.php',
            type: 'GET',
            success: function(response) {
                // Aquí podrías actualizar tu tabla o lista con los datos recibidos
                $('#acordion').empty();
                response.forEach(function(categoria) {
                    $('#acordion').append(
                        '<button class="btn bg-gradient-new mb-0 toast-btn acmenu" data-id="' + categoria.nombre_categoria + '">'+categoria.nombre_categoria+'</button>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }


    // Leer todos los productos
    function readAllProductos() {
        $.ajax({
            url: '../controllers/ProductoController.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
                $('#cartas').empty();
                response.forEach(function(menuitem) {
                    $('#cartas').append(
                        '<div id="' + menuitem.nombre_categoria + '" class="accordion-content col">'+
                        '<div class="card">'+
                        '<img src="' + menuitem.foto + '" class="card-img-top" alt="Producto" width="50">'+
                        '<div class="card-body">'+
                        '<h5 class="card-title">'+ menuitem.nombre + '</h5>'+
                        '<p class="font-weight-bold">'+ menuitem.descripcion + '</p>'+
                        '<p class="card-text">$'+ menuitem.precio + '</p>'+
                        '</div></div></div>');
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + ' - ' + textStatus + ' - ' + errorThrown);
                showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    }

    $('#acordion').on('click', '.acmenu', function() {
        tap = $(this).data('id');
        toggleContent(tap);
    });

    function toggleContent(contentName) {
        var contents = document.querySelectorAll('.accordion-content');
        contents.forEach(function(content) {
            content.style.display = content.id === contentName ? 'block' : 'none';
        });
    }
    // Inicializar
    readAllCategorias();
    readAllProductos();
});