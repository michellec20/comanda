// js/scripts.js
$(document).ready(function(){
    $('#loginButton').click(function(){
        var mail = $('#mail').val();
        var password = $('#password').val();

        alert(mail+ " " + password);

        $.ajax({
            url: '../controllers/loginController.php',
            type: 'POST',
            data: { mail: mail, password: password},
            success: function(response){
                alert("ECO");
                try {
                    var data = JSON.parse(response);
                    if(data.status === 'success'){
                        window.location.href = data.redirect;
                    } else {
                        alert(data.message);
                    }
                } catch (e) {
                    alert("Error parsing server response: " + e.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("Error en la solicitud: " + textStatus + " - " + errorThrown);
            }
        });
    });
});