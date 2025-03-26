function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

jQuery(document).ready(function($) {

    var senhaAtual   = $("#senhaAtualNumero");
    var senhaNormal  = $("#senhaNormal");
    var audioChamada = $("#audioChamada");
    var ultimaSenhaNumero = $("#ultimaSenhaNumero");
    var inputGuiche = $("#inputGuiche");

    // Alteração da senha com as setas ← e →
    $("body").on('keydown', function(e) {
        if (e.keyCode == 39) { // Tecla Direita →
            var senha = parseInt(senhaNormal.val()) + 1;
            senhaAtual.html(pad(senha, 4));
            senhaNormal.val(pad(senha, 4));
            audioChamada.trigger("play");
        }
        if (e.keyCode == 37) { // Tecla Esquerda ←
            var senha = parseInt(senhaNormal.val()) - 1;
            senhaAtual.html(pad(senha, 4));
            senhaNormal.val(pad(senha, 4));
        }
    });

    // Clique no número do guichê para editar
    ultimaSenhaNumero.on("click", function() {
        var valorAtual = $(this).text().trim();
        inputGuiche.val(valorAtual).show().focus();
        $(this).hide();
    });

    // Quando o usuário sai do input ou pressiona "Enter"
    inputGuiche.on("blur keydown", function(e) {
        if (e.type === "blur" || e.keyCode === 13) { 
            var novoValor = $(this).val().trim();

            // Verifica se é um número válido de 1 a 9
            if (/^[1-9]$/.test(novoValor)) {
                ultimaSenhaNumero.text(novoValor);
            }

            // Esconde o input e exibe novamente o texto
            $(this).hide();
            ultimaSenhaNumero.show();
        }
    });

});
