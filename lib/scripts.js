// Importa a biblioteca XLSX (SheetJS)
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";

// Função para aguardar o carregamento da biblioteca XLSX
function waitForXLSX(callback) {
  if (typeof XLSX !== 'undefined') {
    console.log("✅ Biblioteca XLSX carregada");
    callback();
  } else {
    console.log("⏳ Aguardando biblioteca XLSX...");
    setTimeout(() => waitForXLSX(callback), 100);
  }
}

// Adiciona listener para quando o script XLSX carregar
script.onload = function() {
  console.log("📚 Script XLSX carregado do CDN");
};

script.onerror = function() {
  console.error("❌ Erro ao carregar biblioteca XLSX do CDN");
};

document.head.appendChild(script);

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

jQuery(document).ready(function ($) {
  console.log("🚀 Sistema Chamador de Senhas iniciado");
  console.log("URL atual:", window.location.pathname);
  
  var senhaAtual = $("#senhaAtualNumero");
  var senhaNormal = $("#senhaNormal");
  var audioChamada = $("#audioChamada");
  var nomeAtual = $(".nome");
  var ultimaSenhaNumero = $("#ultimaSenhaNumero");
  var inputGuiche = $("#inputGuiche");

  var dados = [];
  var index = 0;

  // Carrega a navbar
  $("#navbar-container").load("navbar.html");

  // Configuração das páginas e arquivos
  const pageMapping = {
    "arte.html": "arte.xlsx",
    "artv.html": "artv_500.xlsx", 
    "bio.html": "bio.xlsx",
    "braile.html": "braile.xlsx",
    "capoeira.html": "capoeira.xlsx",
    "ciencias.html": "ciencias_502.xlsx",
    "cooped.html": "cooped_499.xlsx",
    "danca.html": "danca_500.xlsx",
    "edfis.html": "edf_502.xlsx",
    "espanhol.html": "espanhol.xlsx",
    "filo.html": "filo.xlsx",
    "fis.html": "fis_502.xlsx",
    "geo.html": "geo_502.xlsx",
    "hist.html": "hist_502.xlsx",
    "home.html": "pra_501.xlsx",
    "info.html": "info.xlsx",
    "ingles.html": "ingles_502.xlsx",
    "intl.html": "intl_500.xlsx",
    "libras.html": "libras_500.xlsx",
    "mat.html": "mat_502.xlsx",
    "musica.html": "musica.xlsx",
    "port.html": "port.xlsx",
    "quim.html": "quimica_502.xlsx",
    "secesc.html": "secesc_488.xlsx",
    "soc.html": "soc.xlsx",
    "teatro.html": "teatro_500.xlsx"
  };

  // Determina qual página está sendo usada
  let currentPage = "";
  const currentPath = window.location.pathname;
  
  Object.keys(pageMapping).forEach(page => {
    const pageName = page.replace('.html', '');
    if (currentPath.includes(pageName) || currentPath.endsWith(page)) {
      currentPage = page;
    }
  });

  // Se não encontrou pela URL, tenta pelo nome do arquivo HTML atual
  if (!currentPage) {
    const fileName = currentPath.split('/').pop() || currentPath.split('\\').pop();
    if (pageMapping[fileName]) {
      currentPage = fileName;
    }
  }

  // Determina o arquivo Excel a ser usado
  let excelFilePath = "";
  if (currentPage) {
    // Verifica se há configuração personalizada no admin
    const fileMapping = JSON.parse(localStorage.getItem("fileMapping") || "{}");
    excelFilePath = fileMapping[currentPage] || pageMapping[currentPage];
    console.log("Página detectada:", currentPage, "Arquivo:", excelFilePath);
  } else {
    console.warn("Página não reconhecida:", window.location.pathname);
  }

  const storageKey = `index_${excelFilePath}`;
  index = parseInt(localStorage.getItem(storageKey)) || 0;

  function carregarArquivoFixo() {
    if (!excelFilePath) {
      console.log("Nenhum arquivo configurado para esta página");
      mostrarMensagemSemArquivo();
      return;
    }

    console.log("🔍 Tentando carregar arquivo:", excelFilePath);

    // Aguarda a biblioteca XLSX estar disponível
    waitForXLSX(() => {
      // Primeiro, tenta carregar do sistema de administração (localStorage)
      const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");
      
      if (uploadedFiles[excelFilePath]) {
        console.log("📁 Carregando arquivo do sistema de administração:", excelFilePath);
        try {
          const fileInfo = uploadedFiles[excelFilePath];
          const data = new Uint8Array(fileInfo.data);
          processarArquivo(data.buffer);
          return;
        } catch (error) {
          console.error("❌ Erro ao carregar do localStorage:", error);
        }
      }
      
      // Fallback: carrega arquivo tradicional do servidor (principalmente para desenvolvimento local)
      console.log("🌐 Tentando carregar arquivo do servidor:", excelFilePath);
      fetch(excelFilePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Arquivo ${excelFilePath} não encontrado no servidor`);
          }
          return response.arrayBuffer();
        })
        .then((data) => {
          processarArquivo(data);
        })
        .catch((error) => {
          console.warn("⚠️ Arquivo não encontrado no servidor (normal no GitHub Pages):", error.message);
          // No GitHub Pages, é esperado que não encontre arquivos tradicionais
          // Mostra mensagem mais amigável
          mostrarMensagemUseAdmin();
        });
    });
  }

  function mostrarMensagemSemArquivo() {
    if (nomeAtual.length > 0) {
      nomeAtual.html(`
        <div style="
          color: white; 
          text-align: center; 
          font-size: clamp(30px, 4vw, 100pt);
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        ">
          LISTA NÃO ANEXADA
        </div>
      `);
    }
  }

  function mostrarMensagemErroArquivo() {
    if (nomeAtual.length > 0) {
      nomeAtual.html(`
        <div style="
          color: white; 
          text-align: center; 
          font-size: clamp(30px, 4vw, 100pt);
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        ">
          LISTA NÃO ENCONTRADA
        </div>
      `);
    }
  }

  function mostrarMensagemUseAdmin() {
    if (nomeAtual.length > 0) {
      nomeAtual.html(`
        <div style="
          color: white; 
          text-align: center; 
          font-size: clamp(30px, 4vw, 100pt);
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        ">
          LISTA NÃO ANEXADA
        </div>
      `);
    }
  }

  function processarArquivo(data) {
    try {
      console.log("📊 Iniciando processamento do arquivo...");
      
      // Verifica se XLSX está disponível
      if (typeof XLSX === 'undefined') {
        throw new Error("Biblioteca XLSX não está disponível");
      }

      var workbook = XLSX.read(new Uint8Array(data), { type: "array" });
      console.log("📖 Workbook carregado, planilhas:", workbook.SheetNames);
      
      var sheetName = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheetName];

      dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      console.log("📋 Dados carregados:", dados.length, "linhas");
      console.log("🔍 Primeiras linhas:", dados.slice(0, 3));

      // Remove cabeçalho se for texto
      if (dados.length > 0 && dados[0] && typeof dados[0][0] === "string" && 
          (dados[0][0].toLowerCase().includes("ordem") || dados[0][0].toLowerCase().includes("sequencia"))) {
        dados.shift();
        console.log("🗑️ Cabeçalho removido, dados restantes:", dados.length);
      }

      // Remove linhas vazias e filtra dados válidos
      const dadosOriginais = dados.length;
      dados = dados.filter(linha => {
        return linha && linha.length >= 2 && linha[0] && linha[1] && 
               linha[0].toString().trim() !== "" && linha[1].toString().trim() !== "";
      });
      
      console.log(`🧹 Filtrados ${dadosOriginais - dados.length} linhas vazias/inválidas`);
      console.log("✅ Dados finais:", dados.length, "linhas válidas");

      if (dados.length === 0) {
        mostrarMensagemArquivoVazio();
      } else {
        atualizarTela();
        console.log("🎉 Arquivo processado com sucesso!");
      }

    } catch (error) {
      console.error("❌ Erro ao processar arquivo:", error);
      mostrarMensagemErroProcessamento(error.message);
    }
  }

  function mostrarMensagemArquivoVazio() {
    if (nomeAtual.length > 0) {
      nomeAtual.html(`
        <div style="
          color: white; 
          text-align: center; 
          font-size: clamp(30px, 4vw, 100pt);
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        ">
          LISTA VAZIA
        </div>
      `);
    }
  }

  function mostrarMensagemErroProcessamento(erro) {
    if (nomeAtual.length > 0) {
      nomeAtual.html(`
        <div style="
          color: white; 
          text-align: center; 
          font-size: clamp(30px, 4vw, 100pt);
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        ">
          ERRO NA LISTA
        </div>
      `);
    }
  }

  function atualizarTela() {
    if (dados.length > 0 && index >= 0 && index < dados.length) {
      let ordem = dados[index][0] || "0000";
      let nome = dados[index][1] || "NOME NÃO DEFINIDO";

      senhaAtual.text(ordem);
      senhaNormal.val(ordem);
      nomeAtual.text(nome);
      
      // Atualiza informações do sistema (se existir elemento)
      const infoElement = $("#sistemaInfo");
      if (infoElement.length > 0) {
        infoElement.html(`
          <small style="color: #666;">
            Arquivo: ${excelFilePath} | 
            Pessoa ${index + 1} de ${dados.length} | 
            ${dados.length - index - 1} restantes
          </small>
        `);
      }
    } else if (dados.length === 0) {
      if (nomeAtual.length > 0) {
        nomeAtual.html(`
          <div style="
            color: white; 
            text-align: center; 
            font-size: clamp(30px, 4vw, 100pt);
            font-weight: 800;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 150px;
            word-wrap: break-word;
            overflow-wrap: break-word;
          ">
            LISTA VAZIA
          </div>
        `);
      }
    }
  }

  carregarArquivoFixo();

  $("body").on("keydown", function (e) {
    if (dados.length === 0) return;

    // Avançar senha (seta direita)
    if (e.keyCode == 39 && index < dados.length - 1) {
      index++;
      localStorage.setItem(storageKey, index);
      atualizarTela();
      audioChamada.trigger("play");
    }

    // Voltar senha (seta esquerda)
    if (e.keyCode == 37 && index > 0) {
      index--;
      localStorage.setItem(storageKey, index);
      atualizarTela();
    }

    // Tocar áudio com a tecla "P"
    if (e.key.toLowerCase() === "p") {
      audioChamada.trigger("play");
    }

    // Definir número do guichê (teclas numéricas 1 a 9)
    if (e.key >= "1" && e.key <= "9") {
      ultimaSenhaNumero.text(e.key);
    }
  });

  // Editar número do guichê manualmente
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
