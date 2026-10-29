# 🏛️ Arremate MH Leilões — Casa de Leilões Online

> **Desafio Técnico — Desenvolvido por Manoela Harrison**
> Casa de Leilões Online com interface em **React 19/TypeScript**, API em **Node.js/Express**, **PostgreSQL** e **Socket.IO**.

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla%20Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Author](https://img.shields.io/badge/Autora-Manoela%20Harrison-fbbf24?style=for-the-badge&logo=github&logoColor=black)

---

## 👩‍💻 Autora & Informações do Desafio

* **Desenvolvedora:** Manoela Harrison
* **Desafio:** Casa de Leilões Online — aplicação web com front-end e back-end.
* **Tecnologias:** React, Node.js/Express, PostgreSQL e Socket.IO.
* **Objetivo:** Criar uma experiência acessível e uma API que aplique as regras de leilão, persistência e auditoria.

---

## 📌 Sobre o Projeto

O **Arremate MH** é uma plataforma concebida para a mediação segura e transparente de leilões eletrônicos de alto padrão — contemplando desde relógios de luxo e clássicos automotivos até tecnologia de ponta e colecionáveis raros.

O projeto reúne interface, API e banco de dados. A interface consome a API para
cadastro/login, vitrine de lotes, lances, histórico e atualizações em tempo real.
O leiloeiro pode buscar livros na Open Library e publicar lotes pelo painel.
O deploy público obrigatório ainda precisa ser concluído.

A interface inicial prioriza:
1. **Fidelidade e refinamento estético:** paleta dark com toques de amarelo dourado e violeta, tipografia contemporânea e efeitos sutis de vidro (*glassmorphism*).
2. **Engenharia de software sólida:** separação clara de responsabilidades, componentes autocontidos com CSS modular (BEM-like), tipagem estrita com TypeScript e zero dependências infladas.
3. **Interatividade rica e fluida:** filtros por categoria, busca, cadastro/login, lances validados no backend e atualização em tempo real.

---

## 🎨 Design System & Identidade Visual

O layout foi inteiramente projetado com **Vanilla CSS** através de um sistema estruturado de *design tokens* nativos em `index.css`:

* **Base Escura Sofisticada (`#0a0b10` / `#141522`):** Proporciona conforto visual prolongado e destaca as imagens dos produtos.
* **Amarelo Dourado & Âmbar (`#fbbf24` / `#facc15` / `#f59e0b`):** Evoca a tradição do martelo de leilão, chamando atenção para valores de lance, status "Ao Vivo" e cronômetros de urgência.
* **Roxo & Violeta Real (`#8b5cf6` / `#7c3aed` / `#c084fc`):** Utilizado em botões de ação primária, cartões de destaque e selos de autenticidade da casa.
* **Tipografia:** 
  * **Plus Jakarta Sans:** Títulos, monograma MH e valores numéricos de impacto.
  * **Inter:** Textos descritivos, metadados e documentação jurídica para máxima legibilidade.

---

## 🚀 Funcionalidades

### 1. Cabeçalho Oficial (Header)
* Logotipo autoral combinando o martelo de leilão com o monograma **MH** em degradê dourado.
* Navegação responsiva com rolagem suave (*smooth scroll*) para todas as seções.
* Badge dinâmico pulsante **"Ao Vivo"**.
* Botão de acesso rápido para login/cadastro e menu retrátil (*drawer*) para dispositivos móveis.

### 2. Seção Hero de Apresentação
* Proposta de valor clara com fotografia temática de leilão de alta resolução.
* Estatísticas de credibilidade da casa (*R$ 14M+ arrematados, 1.250+ lotes auditados, 99.8% de satisfação*).
* Botões de chamada para ação direta para os leilões ativos ou explicação das regras.

### 3. Barra de Busca e Filtros Reativos
* **Busca Instantânea:** Filtra simultaneamente por título, descrição, categoria, código do lote (*ex: LOT-1041*) e localização física.
* **Chips de Categoria:** Seleção rápida entre *Todos*, *Tecnologia*, *Relógios*, *Veículos*, *Arte & Design* e *Colecionáveis*.
* **Ordenação Inteligente:** Por mais recentes, maior lance, menor lance ou leilões encerrando em breve.
* **Contador de Resultados:** Feedback visual imediato da quantidade de lotes encontrados.

### 4. Grade de Lotes em Destaque
* Cards com fotografia em alta definição, crachás de tempo restante com contagem regressiva, histórico de lances e valores formatados no padrão monetário brasileiro (`Intl.NumberFormat('pt-BR')`).
* *Empty State* elegante e amigável com botão de restauração rápida de filtros caso a busca não retorne resultados.

### 5. Itens e dados de demonstração
* O seed cria lotes de livros em estados agendado, ao vivo e encerrado, com usuários e histórico de lances.
* O leiloeiro pode buscar novos livros e capas na Open Library e cadastrar lotes pela aplicação.

### 6. Modais Institucionais e de Ação
* **Modal de Detalhes do Lote (`AuctionModal`):** Histórico de lances, saldo e envio de lances validados pela API.
* **Modal de Acesso (`AuthModal`):** Login e cadastro de licitantes usando a API.
* **Painel do Leiloeiro (`SellerDashboard`):** Busca de itens na Open Library e publicação/cancelamento de lotes.
* **Modal Jurídico & Regulamentar (`LegalModal`):** 
  * **Termos de Uso:** Aceite, irrevogabilidade dos lances e comissão legal de 5%.
  * **Privacidade & LGPD:** Diretrizes de tratamento de dados, conformidade com a Lei nº 13.709/2018 e criptografia de ponta a ponta.
  * **Edital de Leilões:** Condições de venda *ad corpus*, vistoria prévia e mecanismo de prorrogação automática (*Anti-Sniping*).
  * Acessibilidade completa: suporte à tecla <kbd>ESC</kbd>, bloqueio de rolagem do fundo e fechamento ao clicar no backdrop.

### 7. Rodapé Oficial (Footer)
* Logotipo integrado **ARREMATE MH** com selos de ambiente auditado e criptografia SSL.
* Links interativos diretos para os Termos de Uso, Política de Privacidade e Edital.
* Assinatura autoral e créditos do desafio.

---

## 🛠️ Decisões de Arquitetura & Engenharia

| Decisão | Justificativa Técnica |
| :--- | :--- |
| **React 19 + TypeScript** | Utilização da versão mais recente do React com TypeScript estrito (`strict: true`), garantindo tipagem forte em toda a árvore de componentes sem necessidade de `any`. |
| **Vanilla CSS com Tokens** | Optou-se deliberadamente por CSS puro estruturado com variáveis CSS nativas. Isso garante zero dependências de compilação externa (Tailwind/Sass), máxima performance de renderização no navegador e controle granular de animações e micro-interações. |
| **Compatibilidade Cross-Browser** | Implementação de prefixos de compatibilidade (como `-webkit-user-select` e `-webkit-backdrop-filter`) para funcionamento idêntico no Safari (macOS e iOS). |
| **Acessibilidade (a11y)** | Elementos semânticos HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), atributos ARIA explicativos, contraste cromático WCAG AA e navegação acessível por teclado. |
| **Vite 8** | Ambiente de desenvolvimento leve com Hot Module Replacement (HMR) instantâneo e build otimizada em menos de 250ms. |

---

## 📂 Estrutura do Repositório

```text
desafio-arremate/
├── .gitignore                  # Arquivos ignorados pelo Git
├── README.md                   # Documentação oficial do desafio
├── backend/
│   ├── src/
│   │   ├── db/                 # Pool PostgreSQL, schema e dados de demonstração
│   │   ├── middleware/         # Autenticação JWT e controle de perfil
│   │   ├── routes/             # API de usuários, lotes, lances e auditoria
│   │   ├── utils/              # Validação monetária e hash de lances
│   │   └── server.js           # Express, Socket.IO e encerramento de lotes
│   ├── test/                   # Testes unitários de valores e hash
│   ├── .env.example            # Modelo de configuração local
│   └── package.json
└── frontend/
    ├── public/                 # Imagens dos lotes e assets estáticos
    │   ├── rolex-cellini.jpg
    │   ├── rolex-milgauss.jpg
    │   ├── cadillac-1959-pink.jpg
    │   ├── mercedes-amg-gt.jpg
    │   ├── vw-classico-azul.jpg
    │   └── hero-gavel-bg.jpg
    ├── src/
    │   ├── components/
    │   │   ├── Header/         # Cabeçalho com logo MH e menu mobile
    │   │   ├── Hero/           # Banner principal e indicadores de credibilidade
    │   │   ├── SearchBar/      # Busca, filtros de categoria e ordenação
    │   │   ├── AuctionCard/    # Cartão de lote com tempo e valor formatado
    │   │   ├── AuctionGrid/    # Grade de cards e estado vazio (empty state)
    │   │   ├── HowItWorks/     # Guia em 3 etapas para novos participantes
    │   │   ├── AuctionModal/   # Detalhes e lances reais
    │   │   ├── AuthModal/      # Modal de autenticação (login / registro)
    │   │   ├── SellerDashboard/ # Busca externa e gestão de lotes
    │   │   ├── LegalModal/     # Modal de Termos de Uso, LGPD e Edital
    │   │   └── Footer/         # Rodapé com logo oficial e links legais
    │   ├── api.ts              # Cliente REST e mapeamento de lotes
    │   ├── types/
    │   │   └── auction.ts      # Interfaces e tipos estritos TypeScript
    │   ├── App.tsx             # Gerenciamento de estado e fluxo da aplicação
    │   ├── App.css             # Estilos do layout principal
    │   ├── index.css           # Tokens globais de design e tipografia
    │   └── main.tsx            # Ponto de entrada React
    ├── index.html              # HTML base com meta tags e fontes
    ├── package.json            # Scripts e dependências do projeto
    ├── tsconfig.json           # Configurações do compilador TypeScript
    └── vite.config.ts          # Configuração do Vite
```

---

## 💻 Instruções para Execução Local

### Pré-requisitos
* **Node.js** v18+ instalado
* **npm** ou gerenciador de pacotes equivalente

### Passo a Passo

1. **Acesse o diretório do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a URL da API:**
   ```bash
   copy .env.example .env
   ```
   No PowerShell, use `Copy-Item .env.example .env`. O padrão aponta para
   `http://localhost:3001`.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Abra no navegador:**
   ```text
   http://localhost:5173
   ```

### Scripts de Validação

* `npm run build`: Valida toda a tipagem TypeScript (`tsc -b`) e gera a build de produção.
* `npm run lint`: Executa a verificação estática do ESLint.
* `npm run preview`: Executa localmente o bundle otimizado de produção.

### Backend e PostgreSQL

O backend usa Node.js, Express, PostgreSQL e Socket.IO. A API e o frontend
devem estar ativos ao mesmo tempo para usar a aplicação.

1. Instale o PostgreSQL e crie um banco local chamado `arremate_mh`.
2. No diretório `backend`, instale as dependências e crie seu arquivo de ambiente:
   ```bash
   cd backend
   npm install
   copy .env.example .env
   ```
   No PowerShell, o comando para copiar é `Copy-Item .env.example .env`.
3. Edite `backend/.env` com a URL do banco e gere um `JWT_SECRET` aleatório,
   longo e exclusivo. `FRONTEND_URL` deve apontar para a origem do frontend.
4. Crie schema e dados de demonstração:
   ```bash
   npm run seed
   ```
   **Atenção:** o seed remove os dados existentes no banco configurado antes de
   recriar o schema e os dados. Use somente um banco descartável/local.
5. Inicie a API:
   ```bash
   npm run dev
   ```
   A API fica em `http://localhost:3001`; o health check é
   `http://localhost:3001/health`. Para validar as regras puras do backend,
   execute `npm test`.

O seed cria o leiloeiro `leiloeiro@arrematemh.com` e os licitantes
`carlos@email.com` e `ana@email.com`; a senha local de demonstração é
`senha123`. Não use essas credenciais em produção.

O frontend já consome cadastro/login, lotes, lances e eventos Socket.IO. O
usuário leiloeiro de demonstração abre o painel para buscar livros na Open
Library e publicar lotes. As rotas incluem depósito de saldo (`/api/auth`),
consulta/criação/cancelamento de lotes (`/api/lots`), lances e histórico
(`/api/bids`) e auditoria/comprovantes (`/api/audit`).

As regras do backend incluem janela de lances entre início e encerramento,
incremento mínimo, bloqueio de lances do líder atual, saldo comprometido apenas
pelos lotes que o licitante ainda lidera, prorrogação anti-sniping de dois
minutos, liquidação transacional no encerramento e verificação da cadeia de
hashes. Identificadores e nomes de licitantes são ocultados ou mascarados nas
respostas públicas de auditoria, comprovantes e eventos ao vivo.

### Publicação na Vercel e Render

O frontend é publicado na Vercel; o backend Node.js e PostgreSQL ficam no Render,
pois a API mantém conexões Socket.IO. O arquivo `render.yaml` prepara apenas a
API e o banco.

1. Na Vercel, importe o repositório GitHub e defina `frontend` como diretório
   raiz do projeto. A configuração `frontend/vercel.json` seleciona Vite, `dist`
   e as rotas do frontend.
2. Crie o deploy inicial do frontend. Em **Environment Variables**, configure
   `VITE_API_URL` com a URL que será atribuída ao backend, por exemplo
   `https://arremate-api.onrender.com`, e faça novo deploy após criar a API.
3. No Render, crie um Blueprint usando `render.yaml`. Ele configura o PostgreSQL,
   gera um `JWT_SECRET` e aplica o schema ao iniciar a API. Informe `FRONTEND_URL`
   com a origem exata do site publicado na Vercel (sem barra final).
4. Verifique `https://<url-da-api>/health` e depois teste login, lances e
   atualização Socket.IO pelo domínio público da Vercel.

Confira as condições e os custos atuais do plano do provedor antes de publicar;
instâncias gratuitas podem suspender o serviço ou limitar o tempo de vida do
banco. O seed não roda no deploy porque apaga os dados do banco. Para a avaliação,
use uma instância descartável e prepare as contas de teste com segurança antes
de compartilhar o endereço público.

### Pendências para a entrega

* Publicar o frontend na Vercel e a API/PostgreSQL no Render; a CLI da Vercel
  precisa estar autenticada (`vercel login`) ou o repositório deve ser importado
  pelo painel web.
* Informar o link público e as credenciais de avaliação no formulário de entrega;
  não reutilizar as credenciais locais do seed.

---

## 📄 Licença e Créditos

Projeto desenvolvido por **Manoela Harrison** como solução para o **Desafio Técnico — Casa de Leilões Online**.  
Todos os direitos reservados &copy; 2026.
