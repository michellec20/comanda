$(document).ready(function(){

    // Mostrar mensajes en el alert
    function showMessage(message) {
        $('.alerta').html(
            '<div class="alert alert-danger alert-dismissible text-white" role="alert"><span class="text-sm">'+ message +'</span><button type="button" class="btn-close text-lg py-3 opacity-10" data-bs-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
    }

    $('#loginButton').click(function(){
        var mail = $('#mail').val();
        var password = $('#password').val();

        $.ajax({
            url: '../comanda/controllers/loginController.php',
            type: 'POST',
            data: { mail: mail, password: password},
            success: function(response){
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if(response.status === 'success'){
                        window.location.href = response.redirect;
                    } else {
                        showMessage(response.message);
                    }
                } catch (e) {
                    showMessage("Error parsing server response: " + e.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                showMessage("Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });
});