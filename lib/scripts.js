// Importa a biblioteca XLSX (SheetJS)
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
document.head.appendChild(script);

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

jQuery(document).ready(function ($) {
    var senhaAtual = $("#senhaAtualNumero");
    var senhaNormal = $("#senhaNormal");
    var audioChamada = $("#audioChamada");
    var nomeAtual = $(".nome");
    var ultimaSenhaNumero = $("#ultimaSenhaNumero");
    var inputGuiche = $("#inputGuiche");

    var dados = [];
    var index = 0;

    // Caminho do arquivo Excel fixo no servidor
    const excelFilePath = "501 (3).xlsx"; // Defina o caminho correto

    // Função para carregar o arquivo fixo automaticamente
    function carregarArquivoFixo() {
        fetch(excelFilePath)
            .then(response => response.arrayBuffer())
            .then(data => {
                processarArquivo(data);
            })
            .catch(error => console.error("Erro ao carregar o arquivo Excel:", error));
    }

    // Processa os dados do Excel
    function processarArquivo(data) {
        var workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        var sheetName = workbook.SheetNames[0];
        var sheet = workbook.Sheets[sheetName];

        dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (dados.length > 0 && typeof dados[0][0] === "string") {
            dados.shift(); // Remove o cabeçalho
        }

        if (dados.length > 0) {
            index = 0;
            atualizarTela();
        }
    }

    // Atualiza os elementos na tela
    function atualizarTela() {
        if (dados.length > 0 && index >= 0 && index < dados.length) {
            let ordem = dados[index][0] || "0000"; // Coluna A
            let nome = dados[index][1] || "NOME NÃO DEFINIDO"; // Coluna B

            senhaAtual.text(ordem);
            senhaNormal.val(ordem);
            nomeAtual.text(nome);
        }
    }

    // Chama a função ao carregar a página
    carregarArquivoFixo();

    // Alteração da senha com as setas ← e →
    $("body").on("keydown", function (e) {
        if (dados.length === 0) return;

        if (e.keyCode == 39 && index < dados.length - 1) { // Tecla Direita →
            index++;
            atualizarTela();
            audioChamada.trigger("play");
        }

        if (e.keyCode == 37 && index > 0) { // Tecla Esquerda ←
            index--;
            atualizarTela();
        }
    });

    // Clique no número do guichê para editar
    ultimaSenhaNumero.on("click", function () {
        var valorAtual = $(this).text().trim();
        inputGuiche.val(valorAtual).show().focus();
        $(this).hide();
    });

    // Quando o usuário sai do input ou pressiona "Enter"
    inputGuiche.on("blur keydown", function (e) {
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
