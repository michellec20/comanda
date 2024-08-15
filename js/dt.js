$(document).ready(function() {

    function readAllMesas() {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: '../controllers/MesaController.php',
          type: 'GET',
          success: function(response) {
            resolve(response);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            reject(new Error("Error en mostrar datos: " + textStatus + " - " + errorThrown));
          }
        });
      });
    }

    function actualizarTablaMesas(mesas) {
      const cuerpo = $('#cuerpo');
      cuerpo.empty();
      mesas.forEach(function(mesa) {
        cuerpo.append(
          '<tr><td class="text-center"><p class="text-xs font-weight-bold mb-0">' + mesa.num_mesa + '</p></td>' +
          '<td class="text-start"><p class="text-xs font-weight-bold mb-0">' + mesa.cant_personas + '</p></td>' +
          '<td class="text-start"><p class="text-xs font-weight-bold mb-0">' + mesa.estado + '</p></td></tr>'
        );
      });
    }

    let table = new DataTable('#myTable', {
        language: {
            url: '//cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json',
        },
    });

    readAllMesas()
    
    .then(function(response) {
        actualizarTablaMesas(response);
    })
    .catch(function(error) {
        console.error(error); // Aquí manejas cualquier error que haya ocurrido durante la llamada AJAX
        showMessage('danger', error.message);
    });

});