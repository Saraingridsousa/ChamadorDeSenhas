// Administração do Sistema Chamador de Senhas
// Importa a biblioteca XLSX
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";

// Função para aguardar o carregamento da biblioteca XLSX
function waitForXLSX(callback) {
  if (typeof XLSX !== 'undefined') {
    console.log("✅ Biblioteca XLSX carregada no admin");
    callback();
  } else {
    console.log("⏳ Aguardando biblioteca XLSX no admin...");
    setTimeout(() => waitForXLSX(callback), 100);
  }
}

script.onload = function() {
  console.log("📚 Script XLSX carregado do CDN no admin");
};

document.head.appendChild(script);

jQuery(document).ready(function ($) {
  // Carrega a navbar
  $("#navbar-container").load("navbar.html");

  // Configuração das páginas e seus arquivos padrão
  const pageMapping = {
    "arte.html": { name: "Arte", defaultFile: "arte.xlsx" },
    "artv.html": { name: "Artes Visuais", defaultFile: "artv_500.xlsx" },
    "bio.html": { name: "Biologia", defaultFile: "bio.xlsx" },
    "braile.html": { name: "Braile", defaultFile: "braile.xlsx" },
    "capoeira.html": { name: "Capoeira", defaultFile: "capoeira.xlsx" },
    "ciencias.html": { name: "Ciências", defaultFile: "ciencias_502.xlsx" },
    "cooped.html": { name: "COO.PED", defaultFile: "cooped_499.xlsx" },
    "danca.html": { name: "Dança", defaultFile: "danca_500.xlsx" },
    "edfis.html": { name: "Ed.Física", defaultFile: "edf_502.xlsx" },
    "espanhol.html": { name: "Espanhol", defaultFile: "espanhol.xlsx" },
    "filo.html": { name: "Filosofia", defaultFile: "filo.xlsx" },
    "fis.html": { name: "Física", defaultFile: "fis_502.xlsx" },
    "geo.html": { name: "Geografia", defaultFile: "geo_502.xlsx" },
    "hist.html": { name: "História", defaultFile: "hist_502.xlsx" },
    "home.html": { name: "PR-A", defaultFile: "pra_501.xlsx" },
    "info.html": { name: "Informática", defaultFile: "info.xlsx" },
    "ingles.html": { name: "Inglês", defaultFile: "ingles_502.xlsx" },
    "intl.html": { name: "Int.Libras", defaultFile: "intl_500.xlsx" },
    "libras.html": { name: "Libras", defaultFile: "libras_500.xlsx" },
    "mat.html": { name: "Matemática", defaultFile: "mat_502.xlsx" },
    "musica.html": { name: "Música", defaultFile: "musica.xlsx" },
    "port.html": { name: "Português/Literatura", defaultFile: "port.xlsx" },
    "quim.html": { name: "Química", defaultFile: "quimica_502.xlsx" },
    "secesc.html": { name: "SEC.ESC", defaultFile: "secesc_488.xlsx" },
    "soc.html": { name: "Sociologia", defaultFile: "soc.xlsx" },
    "teatro.html": { name: "Teatro", defaultFile: "teatro_500.xlsx" }
  };

  // Variáveis globais
  let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");
  let fileMapping = JSON.parse(localStorage.getItem("fileMapping") || "{}");

  // Inicializar sistema
  init();

  function init() {
    renderFilesList();
    renderMappings();
    setupEventListeners();
    logStatus("Sistema de administração carregado", "success");
  }

  function setupEventListeners() {
    // Upload de arquivos
    const fileInput = $("#fileInput");
    const uploadZone = $("#uploadZone");

    fileInput.on("change", handleFileSelect);

    // Drag & Drop
    uploadZone.on("dragover", function (e) {
      e.preventDefault();
      $(this).addClass("dragover");
    });

    uploadZone.on("dragleave", function (e) {
      e.preventDefault();
      $(this).removeClass("dragover");
    });

    uploadZone.on("drop", function (e) {
      e.preventDefault();
      $(this).removeClass("dragover");
      const files = e.originalEvent.dataTransfer.files;
      processFiles(files);
    });

    // Botões de ação
    $("#saveConfig").on("click", saveConfiguration);
    $("#resetConfig").on("click", resetConfiguration);
    $("#testConfig").on("click", testConfiguration);

    // Modal
    $(".close").on("click", function () {
      $("#configModal").hide();
    });

    $(window).on("click", function (e) {
      if ($(e.target).is("#configModal")) {
        $("#configModal").hide();
      }
    });
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    processFiles(files);
  }

  function processFiles(files) {
    Array.from(files).forEach(file => {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = new Uint8Array(e.target.result);
          
          // Aguarda XLSX estar disponível antes de validar
          waitForXLSX(() => {
            // Validar arquivo Excel
            try {
              const workbook = XLSX.read(data, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              
              // Salvar arquivo
              const fileInfo = {
                name: file.name,
                size: file.size,
                data: Array.from(data),
                sheets: workbook.SheetNames,
                rows: jsonData.length,
                uploadDate: new Date().toISOString()
              };
              
              uploadedFiles[file.name] = fileInfo;
              localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
              
              renderFilesList();
              logStatus(`Arquivo ${file.name} carregado com sucesso (${jsonData.length} linhas)`, "success");
              
            } catch (error) {
              console.error("Erro ao processar arquivo:", error);
              logStatus(`Erro ao processar ${file.name}: ${error.message}`, "error");
            }
          });
        };
        
        reader.readAsArrayBuffer(file);
      } else {
        logStatus(`Arquivo ${file.name} não é um Excel válido`, "warning");
      }
    });
  }

  function renderFilesList() {
    const container = $("#filesList");
    container.empty();

    if (Object.keys(uploadedFiles).length === 0) {
      container.html('<p class="text-muted">Nenhum arquivo carregado ainda.</p>');
      return;
    }

    Object.entries(uploadedFiles).forEach(([fileName, fileInfo]) => {
      const fileItem = $(`
        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">📊</div>
            <div class="file-details">
              <h4>${fileName}</h4>
              <p>${formatFileSize(fileInfo.size)} • ${fileInfo.rows} linhas • Carregado em ${formatDate(fileInfo.uploadDate)}</p>
            </div>
          </div>
          <div class="file-actions">
            <button class="btn-small btn-configure" onclick="configureFile('${fileName}')">⚙️ Configurar</button>
            <button class="btn-small btn-remove" onclick="removeFile('${fileName}')">🗑️ Remover</button>
          </div>
        </div>
      `);
      container.append(fileItem);
    });
  }

  function renderMappings() {
    const container = $("#mappingContainer");
    container.empty();

    Object.entries(pageMapping).forEach(([page, info]) => {
      const mappedFile = fileMapping[page] || info.defaultFile;
      const fileExists = uploadedFiles[mappedFile] ? true : false;
      const hasCustomMapping = fileMapping[page] ? true : false;
      
      let statusClass, statusText;
      
      if (hasCustomMapping && fileExists) {
        statusClass = "active";
        statusText = "Configurado";
      } else if (!hasCustomMapping && uploadedFiles[info.defaultFile]) {
        statusClass = "active";
        statusText = "Padrão ativo";
      } else if (hasCustomMapping && !fileExists) {
        statusClass = "inactive";
        statusText = "Arquivo não encontrado";
      } else {
        statusClass = "warning";
        statusText = "Sem convocação";
      }

      const mappingItem = $(`
        <div class="mapping-item">
          <div class="mapping-info">
            <div class="mapping-page">${info.name} (${page})</div>
            <div class="mapping-file">
              ${hasCustomMapping || uploadedFiles[info.defaultFile] ? `Arquivo: ${mappedFile}` : 'Nenhum arquivo configurado'}
            </div>
          </div>
          <div class="mapping-status">
            <div class="status-indicator ${statusClass}"></div>
            <span>${statusText}</span>
            <button class="btn-small btn-configure" onclick="configurePage('${page}')">
              ${hasCustomMapping || uploadedFiles[info.defaultFile] ? 'Alterar' : 'Configurar'}
            </button>
          </div>
        </div>
      `);
      container.append(mappingItem);
    });
  }

  function configureFile(fileName) {
    const fileInfo = uploadedFiles[fileName];
    const modalContent = `
      <h4>📊 ${fileName}</h4>
      <div class="form-group">
        <label>Tamanho:</label>
        <p>${formatFileSize(fileInfo.size)}</p>
      </div>
      <div class="form-group">
        <label>Linhas de dados:</label>
        <p>${fileInfo.rows}</p>
      </div>
      <div class="form-group">
        <label>Planilhas:</label>
        <p>${fileInfo.sheets.join(', ')}</p>
      </div>
      <div class="form-group">
        <label>Data de upload:</label>
        <p>${formatDate(fileInfo.uploadDate)}</p>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" onclick="previewFile('${fileName}')">👁️ Visualizar Dados</button>
      </div>
    `;
    
    $("#modalContent").html(modalContent);
    $("#configModal").show();
  }

  function configurePage(page) {
    const info = pageMapping[page];
    const currentFile = fileMapping[page] || info.defaultFile;
    
    let optionsHtml = '<option value="">-- Nenhum arquivo (sem convocação) --</option>';
    Object.keys(uploadedFiles).forEach(fileName => {
      const selected = fileName === currentFile ? 'selected' : '';
      optionsHtml += `<option value="${fileName}" ${selected}>${fileName}</option>`;
    });

    const modalContent = `
      <h4>🔗 Configurar ${info.name}</h4>
      <div class="form-group">
        <label>Página:</label>
        <p>${page}</p>
      </div>
      <div class="form-group">
        <label>Arquivo Excel:</label>
        <select id="fileSelect" class="form-control">
          ${optionsHtml}
        </select>
        <small style="color: #666; margin-top: 5px; display: block;">
          💡 Deixe em branco se não houver convocação para esta categoria
        </small>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" onclick="savePageMapping('${page}')">💾 Salvar</button>
        <button class="btn btn-secondary" onclick="resetPageMapping('${page}')">🔄 Usar Padrão</button>
        <button class="btn btn-warning" onclick="clearPageMapping('${page}')">🚫 Remover Configuração</button>
      </div>
    `;
    
    $("#modalContent").html(modalContent);
    $("#configModal").show();
  }

  function savePageMapping(page) {
    const selectedFile = $("#fileSelect").val();
    
    if (selectedFile) {
      fileMapping[page] = selectedFile;
      logStatus(`Arquivo ${selectedFile} associado à página ${pageMapping[page].name}`, "success");
    } else {
      // Remove o mapeamento se nenhum arquivo foi selecionado
      delete fileMapping[page];
      logStatus(`Configuração removida para ${pageMapping[page].name} - sem convocação`, "info");
    }
    
    localStorage.setItem("fileMapping", JSON.stringify(fileMapping));
    renderMappings();
    $("#configModal").hide();
  }

  function clearPageMapping(page) {
    delete fileMapping[page];
    localStorage.setItem("fileMapping", JSON.stringify(fileMapping));
    renderMappings();
    logStatus(`Configuração removida para ${pageMapping[page].name}`, "info");
    $("#configModal").hide();
  }

  function resetPageMapping(page) {
    delete fileMapping[page];
    localStorage.setItem("fileMapping", JSON.stringify(fileMapping));
    renderMappings();
    logStatus(`Configuração da página ${pageMapping[page].name} resetada para o padrão`, "info");
    $("#configModal").hide();
  }

  function previewFile(fileName) {
    const fileInfo = uploadedFiles[fileName];
    const data = new Uint8Array(fileInfo.data);
    
    waitForXLSX(() => {
      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        let previewHtml = '<h4>👁️ Prévia dos Dados</h4><div style="max-height: 400px; overflow-y: auto;"><table class="table table-striped"><thead><tr>';
        
        // Cabeçalho
        if (jsonData.length > 0) {
          jsonData[0].forEach((header, index) => {
            previewHtml += `<th>Col ${index + 1}: ${header || 'Vazia'}</th>`;
          });
          previewHtml += '</tr></thead><tbody>';
          
          // Primeiras 10 linhas de dados
          for (let i = 1; i < Math.min(11, jsonData.length); i++) {
            previewHtml += '<tr>';
            jsonData[i].forEach(cell => {
              previewHtml += `<td>${cell || '<em>vazio</em>'}</td>`;
            });
            previewHtml += '</tr>';
          }
        }
        
        previewHtml += '</tbody></table></div>';
        if (jsonData.length > 11) {
          previewHtml += `<p class="text-muted">... e mais ${jsonData.length - 11} linhas</p>`;
        }
        
        previewHtml += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
          <strong>💡 Dica:</strong> 
          <ul style="margin: 5px 0 0 20px;">
            <li>Coluna 1 deve conter a <strong>Ordem/Sequência</strong></li>
            <li>Coluna 2 deve conter o <strong>Nome da Pessoa</strong></li>
            <li>A primeira linha pode ser cabeçalho (será ignorada automaticamente)</li>
          </ul>
        </div>`;
        
        $("#modalContent").html(previewHtml);
        
      } catch (error) {
        $("#modalContent").html(`<p class="text-danger">Erro ao visualizar arquivo: ${error.message}</p>`);
      }
    });
  }

  function saveConfiguration() {
    // Gerar arquivo de configuração para download
    const config = {
      uploadedFiles: uploadedFiles,
      fileMapping: fileMapping,
      timestamp: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chamador-senhas-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logStatus("Configuração salva e baixada", "success");
  }

  function resetConfiguration() {
    if (confirm("Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("uploadedFiles");
      localStorage.removeItem("fileMapping");
      uploadedFiles = {};
      fileMapping = {};
      renderFilesList();
      renderMappings();
      logStatus("Configuração resetada", "warning");
    }
  }

  function testConfiguration() {
    let errors = 0;
    let warnings = 0;
    let configured = 0;
    let empty = 0;

    logStatus("Iniciando teste do sistema...", "info");

    // Testar cada página
    Object.entries(pageMapping).forEach(([page, info]) => {
      const mappedFile = fileMapping[page] || info.defaultFile;
      const hasCustomMapping = fileMapping[page] ? true : false;
      
      if (hasCustomMapping) {
        if (!uploadedFiles[mappedFile]) {
          logStatus(`❌ Erro: Arquivo ${mappedFile} configurado mas não encontrado para ${info.name}`, "error");
          errors++;
        } else {
          logStatus(`✅ OK: ${info.name} configurado corretamente`, "success");
          configured++;
        }
      } else if (uploadedFiles[info.defaultFile]) {
        logStatus(`✅ OK: ${info.name} usando arquivo padrão`, "success");  
        configured++;
      } else {
        logStatus(`ℹ️ Info: ${info.name} sem convocação configurada`, "info");
        empty++;
      }
    });

    // Resumo
    logStatus(`📊 Resumo: ${configured} configuradas, ${empty} sem convocação, ${errors} erros`, "info");
    
    if (errors === 0) {
      logStatus("🎉 Teste concluído: Sistema funcionando corretamente!", "success");
    } else {
      logStatus(`❌ Teste concluído: ${errors} erros encontrados que precisam ser corrigidos`, "error");
    }
  }

  // Funções utilitárias
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  function logStatus(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const statusLog = $("#statusLog");
    
    const statusItem = $(`<p class="status-item ${type}">[${timestamp}] ${message}</p>`);
    statusLog.prepend(statusItem);
    
    // Manter apenas os últimos 20 logs
    if (statusLog.children().length > 20) {
      statusLog.children().last().remove();
    }
  }

  // Funções globais (chamadas pelos botões)
  window.removeFile = function(fileName) {
    if (confirm(`Tem certeza que deseja remover o arquivo ${fileName}?`)) {
      delete uploadedFiles[fileName];
      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
      
      // Remover mapeamentos que usam este arquivo
      Object.keys(fileMapping).forEach(page => {
        if (fileMapping[page] === fileName) {
          delete fileMapping[page];
        }
      });
      localStorage.setItem("fileMapping", JSON.stringify(fileMapping));
      
      renderFilesList();
      renderMappings();
      logStatus(`Arquivo ${fileName} removido`, "warning");
    }
  };

  window.configureFile = configureFile;
  window.configurePage = configurePage;
  window.savePageMapping = savePageMapping;
  window.resetPageMapping = resetPageMapping;
  window.clearPageMapping = clearPageMapping;
  window.previewFile = previewFile;
});
