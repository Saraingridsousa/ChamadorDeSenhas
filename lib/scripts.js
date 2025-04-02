// Importa a biblioteca XLSX (SheetJS)
const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
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

  // Carregar a navbar dentro do elemento com id "navbar-container"
  $("#navbar-container").load("navbar.html");

  // Define qual arquivo Excel será carregado para cada página
  let excelFilePath = "";

  if (window.location.pathname.includes("arte.html")) {
    excelFilePath = "arte.xlsx";
  } else if (window.location.pathname.includes("artv.html")) {
    excelFilePath = "artv.xlsx";
  } else if (window.location.pathname.includes("bio.html")) {
    excelFilePath = "bio.xlsx";
  } else if (window.location.pathname.includes("braile.html")) {
    excelFilePath = "braile.xlsx";
  } else if (window.location.pathname.includes("relatorio.html")) {
    excelFilePath = "planilha3.xlsx";
  } else if (window.location.pathname.includes("capoeira.html")) {
    excelFilePath = "capoeira.xlsx";
  } else if (window.location.pathname.includes("ciencias.html")) {
    excelFilePath = "ciencias.xlsx";
  } else if (window.location.pathname.includes("cooped.html")) {
    excelFilePath = "Coordenador.xlsx";
  } else if (window.location.pathname.includes("danca.html")) {
    excelFilePath = "danca.xlsx";
  } else if (window.location.pathname.includes("edfis.html")) {
    excelFilePath = "edfis.xlsx";
  } else if (window.location.pathname.includes("espanhol.html")) {
    excelFilePath = "espanhol.xlsx";
  } else if (window.location.pathname.includes("filo.html")) {
    excelFilePath = "filo.xlsx";
  } else if (window.location.pathname.includes("fis.html")) {
    excelFilePath = "fis.xlsx";
  } else if (window.location.pathname.includes("geo.html")) {
    excelFilePath = "geo.xlsx";
  } else if (window.location.pathname.includes("hist.html")) {
    excelFilePath = "hist.xlsx";
  } else if (window.location.pathname.includes("home.html")) {
    excelFilePath = "501pra_manha.xlsx";
  } else if (window.location.pathname.includes("info.html")) {
    excelFilePath = "info.xlsx";
  } else if (window.location.pathname.includes("ingles.html")) {
    excelFilePath = "ingles.xlsx";
  } else if (window.location.pathname.includes("intl.html")) {
    excelFilePath = "intl.xlsx";
  } else if (window.location.pathname.includes("libras.html")) {
    excelFilePath = "libras.xlsx";
  } else if (window.location.pathname.includes("mat.html")) {
    excelFilePath = "mat.xlsx";
  } else if (window.location.pathname.includes("musica.html")) {
    excelFilePath = "musica.xlsx";
  } else if (window.location.pathname.includes("port.html")) {
    excelFilePath = "port.xlsx";
  } else if (window.location.pathname.includes("quim.html")) {
    excelFilePath = "quim.xlsx";
  } else if (window.location.pathname.includes("secesc.html")) {
    excelFilePath = "secesc.xlsx";
  } else if (window.location.pathname.includes("soc.html")) {
    excelFilePath = "soc.xlsx";
  } else if (window.location.pathname.includes("teatro.html")) {
    excelFilePath = "teatro.xlsx";
  }

  const storageKey = `index_${excelFilePath}`;
  index = parseInt(localStorage.getItem(storageKey)) || 0;

  function carregarArquivoFixo() {
    fetch(excelFilePath)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        processarArquivo(data);
      })
      .catch((error) =>
        console.error("Erro ao carregar o arquivo Excel:", error)
      );
  }

  function processarArquivo(data) {
    var workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];

    dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (dados.length > 0 && typeof dados[0][0] === "string") {
      dados.shift();
    }

    atualizarTela();
  }

  function atualizarTela() {
    if (dados.length > 0 && index >= 0 && index < dados.length) {
      let ordem = dados[index][0] || "0000";
      let nome = dados[index][1] || "NOME NÃO DEFINIDO";

      senhaAtual.text(ordem);
      senhaNormal.val(ordem);
      nomeAtual.text(nome);
    }
  }

  carregarArquivoFixo();

  $("body").on("keydown", function (e) {
    if (dados.length === 0) return;

    if (e.keyCode == 39 && index < dados.length - 1) {
      index++;
      localStorage.setItem(storageKey, index);
      atualizarTela();
      audioChamada.trigger("play");
    }

    if (e.keyCode == 37 && index > 0) {
      index--;
      localStorage.setItem(storageKey, index);
      atualizarTela();
    }
  });

  ultimaSenhaNumero.on("click", function () {
    var valorAtual = $(this).text().trim();
    inputGuiche.val(valorAtual).show().focus();
    $(this).hide();
  });

  inputGuiche.on("blur keydown", function (e) {
    if (e.type === "blur" || e.keyCode === 13) {
      var novoValor = $(this).val().trim();
      if (/^[1-9]$/.test(novoValor)) {
        ultimaSenhaNumero.text(novoValor);
      }
      $(this).hide();
      ultimaSenhaNumero.show();
    }
  });
});
