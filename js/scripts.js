$(document).ready(function(){
    $('#loginButton').click(function(){

        var mail = $('#mail').val();
        var password = $('#password').val();
        
        $.ajax({
            url: './controllers/LoginController.php',
            type: 'POST',
            data: {mail: mail, password: password},
            success: function(response){
                var data = JSON.parse(response);
                if(data.status == 'success'){
                    window.location.href = data.redirect;
                } else {
                    alert(data.message);
                }
            }
        });
    });
});