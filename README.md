# 🌟 Sistema de Chamada Pública - Prefeitura de Juiz de Fora

Um sistema web dinâmico e amigável desenvolvido para otimizar o processo de **convocação e chamada de professores e servidores** em processos seletivos públicos.

O projeto foi criado durante a experiência de estágio na Prefeitura Municipal de Lima Duarte, visando substituir métodos manuais e lentos por uma solução digital eficiente e transparente.

---
### 💻 Tecnologias Utilizadas

[HTML] , [CSS] e [JAVASCRIPT]

---

### 📌 Problema Resolvido

O processo de convocação tradicional, que utiliza chamadas manuais e controle em papel, é propenso a erros, lento e menos transparente. Este sistema automatiza a exibição da ordem de chamada, o nome do convocado e a matéria, garantindo:

* **Transparência:** Exibição clara e em tempo real para o público.
* **Eficiência:** Agilidade na transição entre os chamados, com sinalização sonora.
* **Autonomia do Usuário:** Interface administrativa para gerenciamento de dados sem intervenção técnica.

---

### ✨ Principais Funcionalidades

| Funcionalidade | Descrição | Habilidade Demonstrada |
| :--- | :--- | :--- |
| **Chamada Sonora** | Reproduz um som ao avançar o chamado, simulando painéis de senha de bancos. | Utilização da **HTML5 Audio API** e controle de eventos. |
| **Persistência de Estado** | Salva o último professor chamado (`Número de Ordem`) no navegador. | Uso eficiente do **LocalStorage** para experiência contínua. |
| **Navegação por Matérias** | Separação das listas por matéria/convocação, com troca fácil entre as páginas. | Estrutura de navegação modular e URL _friendly_. |
| **Interface de Administração** | Área protegida por senha para upload e associação de planilhas. | Implementação de **Autenticação Simples** (client-side) e **Gestão de Dados**. |

---

### 🛠️ Arquitetura e Tecnologias

Este projeto é uma **Single Page Application (SPA)** de front-end puro, focada em performance e facilidade de deploy.

| Categoria | Tecnologia | Destaque Técnico |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, **Bootstrap** | Desenvolvimento de _Layouts_ Responsivos e Acessíveis. |
| **Lógica** | **JavaScript (Vanilla JS)** | Manipulação do DOM, Lógica de Negócio e Controle de Eventos. |
| **Processamento de Dados** | **SheetJS (xlsx)** | Leitura e _Parsing_ eficiente de dados externos (planilhas Excel). |
| **Armazenamento** | **LocalStorage** | Persistência de dados (configurações, último chamado) no cliente. |
| **Usabilidade** | HTML5 Audio API, Design de Interface. | Experiência focada no usuário final não-técnico. |

---

### ⚙️ Módulo Administrativo (Admin)

Este módulo foi o principal foco de atualização para garantir a **autonomia do cliente (Prefeitura)**, eliminando a dependência de um desenvolvedor para a mudança de listas.

* **Acesso:** `admin.html`
* **Interface Intuitiva:** Área visual para upload de arquivos Excel (`.xlsx`).
* **Associação Simplificada:** Vinculação dos arquivos às páginas de convocação (e.g., `mat.html` ➡️ `matematica.xlsx`).
* **Preview e Teste:** Funções para visualizar o conteúdo e verificar a integridade da estrutura dos dados antes da ativação.

> **Controles Rápidos para o Operador (UX)**
>
> Para otimizar a operação em tela cheia:
>
> * **→ (Seta Direita):** Avança para a próxima pessoa / Incrementa o número de ordem.
> * **← (Seta Esquerda):** Volta para a pessoa anterior / Decrementa o número de ordem.
> * **P (Tecla P):** Tocar novamente o áudio de chamada.

---

### 🚀 Como Rodar o Projeto

Este projeto não requer _backend_ ou instalação de dependências (como Node.js ou NPM), rodando diretamente do navegador.

https://saraingridsousa.github.io/ChamadorDeSenhas/cooped.html
