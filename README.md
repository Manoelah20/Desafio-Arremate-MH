# 🏛️ Arremate MH — Protótipo de Leilões Online

> **Modelo de projeto — Desenvolvido por Manoela Harrison**
> Protótipo demonstrativo com interface em **React 19/TypeScript**, API em **Node.js/Express**, **PostgreSQL** e eventos em tempo real.

> **Somente demonstração e testes:** lotes, imagens, saldos e lances são fictícios. A aplicação não oferece produtos reais, não processa pagamentos e não gera obrigações comerciais ou jurídicas.
> As fotografias são referências visuais de categoria, não representam os lotes, seus proprietários ou produtos disponíveis para venda.
> Não use dados pessoais ou senhas reais. Nomes de marcas eventualmente encontrados em registros antigos não indicam vínculo ou endosso; a API pública apresenta lotes com conteúdo genérico.

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla%20Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Author](https://img.shields.io/badge/Autora-Manoela%20Harrison-fbbf24?style=for-the-badge&logo=github&logoColor=black)

---

## 👩‍💻 Autoria & Sobre o modelo

* **Desenvolvedora:** Manoela Harrison
* **Projeto:** modelo de uma aplicação web de leilões com front-end e back-end.
* **Tecnologias:** React, Node.js/Express, PostgreSQL, Vercel e Supabase Realtime.
* **Objetivo:** apresentar uma base de projeto com fluxos demonstrativos de lances, persistência de dados, autenticação e atualização em tempo real.

---

## 📌 Sobre o Projeto

O **Arremate MH** é um modelo de projeto que demonstra os fluxos de uma plataforma de leilões online. Não é uma operação comercial: os itens, contas, saldos e valores são fictícios e não representam anúncios, avaliações ou ofertas reais.

O projeto reúne interface, API e banco de dados. A interface demonstra
cadastro/login, catálogo de lotes, lances, histórico e atualizações em tempo real.
O painel do leiloeiro pode consultar metadados bibliográficos na Open Library e
permite testar a publicação de lotes. Capas não são exibidas nem devolvidas
pela busca externa. Os fluxos de API, lance e atualização em tempo real foram
validados em ambiente de demonstração.

A interface inicial prioriza:
1. **Identidade visual:** paleta escura com amarelo dourado e violeta, tipografia contemporânea e efeitos sutis de vidro (*glassmorphism*).
2. **Organização:** interface em componentes React, estilos CSS e tipos TypeScript; API Express separada do frontend.
3. **Interatividade:** filtros por categoria, busca, cadastro/login, lances validados no backend e atualização em tempo real.

---

## 🎨 Design System & Identidade Visual

O layout foi inteiramente projetado com **Vanilla CSS** através de um sistema estruturado de *design tokens* nativos em `index.css`:

* **Base Escura Sofisticada (`#0a0b10` / `#141522`):** Destaca as fotos ilustrativas e os elementos da interface.
* **Amarelo Dourado & Âmbar (`#fbbf24` / `#facc15` / `#f59e0b`):** Evoca a tradição do martelo de leilão, chamando atenção para valores de lance, status "Ao Vivo" e cronômetros de urgência.
* **Roxo & Violeta (`#8b5cf6` / `#7c3aed` / `#c084fc`):** Utilizado em botões de ação primária, cartões de destaque e detalhes visuais.
* **Tipografia:** 
  * **Plus Jakarta Sans:** Títulos, monograma MH e valores numéricos de impacto.
  * **Inter:** Textos descritivos e metadados.

---

## 🚀 Funcionalidades

### 1. Cabeçalho e navegação (Header)
* Logotipo autoral combinando o martelo de leilão com o monograma **MH** em degradê dourado.
* Navegação responsiva com rolagem suave (*smooth scroll*) para as seções.
* Badge pulsante que identifica o ambiente como **"Demo"**.
* Botão de acesso rápido para login/cadastro e menu retrátil (*drawer*) para dispositivos móveis.

### 2. Apresentação do protótipo
* Identificação explícita de que o projeto e seus dados são demonstrativos.
* Atalhos para o catálogo e para a explicação dos fluxos.

### 3. Barra de Busca e Filtros Reativos
* **Busca Instantânea:** Filtra por título, descrição, categoria, código e localização informada no lote.
* **Chips de Categoria:** Seleção rápida entre *Todos*, *Tecnologia*, *Relógios*, *Veículos*, *Arte & Design* e *Colecionáveis*.
* **Ordenação Inteligente:** Por mais recentes, maior lance, menor lance ou leilões encerrando em breve.
* **Contador de Resultados:** Feedback visual imediato da quantidade de lotes encontrados.

### 4. Grade de Lotes em Destaque
* Cards com fotos ilustrativas licenciadas, indicação de tempo restante atualizada periodicamente, histórico de lances e valores formatados no padrão monetário brasileiro (`Intl.NumberFormat('pt-BR')`).
* *Empty State* elegante e amigável com botão de restauração rápida de filtros caso a busca não retorne resultados.

### 5. Itens e dados de demonstração
* O seed cria lotes fictícios em estados agendado, ao vivo e encerrado, com usuários e histórico de lances. Fotos servem apenas como referência visual de categoria.
* O leiloeiro pode consultar metadados de livros da Open Library e testar o cadastro de lotes; capas externas não são usadas.

### 6. Modais de ação e informações da demonstração
* **Modal de Detalhes do Lote (`AuctionModal`):** Histórico de lances, saldo e envio de lances validados pela API.
* **Modal de Acesso (`AuthModal`):** Login e cadastro de licitantes usando a API.
* **Painel do Leiloeiro (`SellerDashboard`):** consulta de metadados bibliográficos e publicação/cancelamento demonstrativos de lotes.
* **Modal de informações (`LegalModal`):** explica que os lances são simulados, descreve os dados usados para testar o sistema e esclarece que não há venda, pagamento ou validade jurídica.
* Os modais podem ser fechados com <kbd>ESC</kbd> ou pelo botão de fechar.

### 7. Rodapé
* Identificação do projeto como demonstração, sem alegações de auditoria ou operação oficial.
* Links para as informações do protótipo.
* Créditos do projeto.

---

## 🛠️ Decisões de Arquitetura & Engenharia

| Decisão | Justificativa Técnica |
| :--- | :--- |
| **React + TypeScript** | Interface em componentes React com tipos TypeScript e verificação de tipos no build. |
| **CSS com tokens** | Estilos próprios e variáveis CSS, sem framework CSS adicional. |
| **Express + PostgreSQL** | API para autenticação, lotes, lances, saldos e verificação de hashes em ambiente de demonstração. |
| **Atualização em tempo real** | Socket.IO no desenvolvimento local e Supabase Broadcast no ambiente publicado. |
| **Vite** | Servidor de desenvolvimento e geração do bundle de produção. |

---

## 📂 Estrutura do Repositório

```text
desafio-arremate/
├── .gitignore                  # Arquivos ignorados pelo Git
├── README.md                   # Documentação do projeto
├── backend/
│   ├── index.js                # Entrada Express detectada pela Vercel
│   ├── src/
│   │   ├── db/                 # Pool PostgreSQL, schema e dados de demonstração
│   │   ├── middleware/         # Autenticação JWT e controle de perfil
│   │   ├── routes/             # API de usuários, lotes, lances e auditoria
│   │   ├── services/           # Broadcast Supabase e encerramento de lotes
│   │   ├── utils/              # Validação monetária e hash de lances
│   │   ├── app.js              # Aplicação Express compartilhada
│   │   └── server.js           # Servidor local com Socket.IO
│   ├── test/                   # Testes de valores, hash e conteúdo público demo
│   ├── .env.example            # Modelo de configuração local
│   └── package.json
└── frontend/
    ├── public/                 # Fotos licenciadas e ilustrações de fallback
    │   ├── carro1.jpg
    │   ├── carro2.jpg
    │   ├── arte-design-pixabay.jpg
    │   ├── arte-design-aquarela.jpg
    │   ├── arte-design-grafite.jpg
    │   ├── colecionaveis-vinil.jpg
    │   ├── colecionaveis-vinil-2.jpg
    │   ├── colecionaveis-gramofone.jpg
    │   ├── tecnologia-pixabay.jpg
    │   ├── relogio1.jpg
    │   ├── relogio2.jpg
    │   ├── demo-lot-art.svg
    │   ├── demo-lot-collectibles.svg
    │   ├── demo-lot-technology.svg
    │   └── demo-lot-watch.svg
    ├── src/
    │   ├── components/
    │   │   ├── Header/         # Cabeçalho com logo MH e menu mobile
    │   │   ├── Hero/           # Apresentação e identificação da demonstração
    │   │   ├── SearchBar/      # Busca, filtros de categoria e ordenação
    │   │   ├── AuctionCard/    # Cartão de lote com tempo e valor formatado
    │   │   ├── AuctionGrid/    # Grade de cards e estado vazio (empty state)
    │   │   ├── HowItWorks/     # Guia em 3 etapas dos fluxos demonstrativos
    │   │   ├── AuctionModal/   # Detalhes e lances demonstrativos
    │   │   ├── AuthModal/      # Modal de autenticação (login / registro)
    │   │   ├── SellerDashboard/ # Busca externa e gestão demonstrativa de lotes
    │   │   ├── LegalModal/     # Informações sobre a demonstração e dados
    │   │   └── Footer/         # Rodapé com identificação do projeto
    │   ├── api.ts              # Cliente REST e mapeamento de lotes
    │   ├── supabase.ts         # Cliente público do Broadcast Realtime
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
* **Node.js** v20+ instalado
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

O backend usa Node.js, Express e PostgreSQL. Localmente, o Socket.IO mantém
compatibilidade de tempo real; na publicação, os eventos passam pelo Broadcast
do Supabase Realtime.

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

O seed cria contas com endereços reservados `example.test`; a senha local de
demonstração é `senha123`. O seed é destrutivo e deve ser usado somente em um
banco descartável/local. Não use essas credenciais em produção nem dados pessoais
ou senhas reais.

Para acrescentar contas e lotes demonstrativos sem apagar dados, use
`npm run seed:demo` depois de revisar `DATABASE_URL` e definir
`ALLOW_DEMO_SEED=arremate-demo-v1`. O comando só aceita conexão com o pooler do
Supabase, é repetível sem duplicar seus lotes e exibe senhas aleatórias no
terminal uma única vez. Não publique essas senhas em documentação pública.

O frontend já consome cadastro/login, lotes, lances e eventos em tempo real. O
usuário leiloeiro de demonstração abre o painel para consultar metadados de
livros da Open Library e publicar lotes de teste; capas externas não são
exibidas nem retornadas pela busca. As rotas incluem depósito de saldo (`/api/auth`),
consulta/criação/cancelamento de lotes (`/api/lots`), lances e histórico
(`/api/bids`) e auditoria/comprovantes (`/api/audit`).

As regras demonstrativas do backend incluem janela de lances entre início e encerramento,
incremento mínimo, bloqueio de lances do líder atual, saldo comprometido apenas
pelos lotes que o licitante ainda lidera, prorrogação anti-sniping de dois
minutos, liquidação transacional no encerramento e verificação da cadeia de
hashes. Identificadores e nomes de licitantes são ocultados ou mascarados nas
respostas públicas de auditoria e eventos ao vivo. A cadeia de hashes ajuda a
detectar alterações, mas não equivale a armazenamento imutável nem a auditoria
independente.

### Publicação gratuita com Vercel e Supabase

A aplicação usa **dois projetos Vercel** ligados ao mesmo repositório privado:
um para o frontend (`frontend`) e outro para a API (`backend`). O Supabase Free
fornece PostgreSQL e Broadcast Realtime. Nenhum serviço é criado por este
repositório automaticamente.

#### Deploy publicado

* **Frontend:** [desafio-arremate-mh.vercel.app](https://desafio-arremate-mh.vercel.app/)
* **API:** [desafio-arremate-mh-u8eb.vercel.app](https://desafio-arremate-mh-u8eb.vercel.app/)
* **Estado da publicação anterior:** frontend acessível; `/health` e `/api/lots` responderam
  com sucesso e o catálogo recebeu quatro lotes demonstrativos. A entrada
  Express reconhecida pela Vercel foi publicada; login, consulta autenticada,
  painel do leiloeiro, detalhes e auditoria foram validados. O fluxo de lance e
  o recebimento do Broadcast Realtime foram testados no frontend local conectado
  ao banco Supabase. O ajuste de sincronização após um lance também foi incluído
  no build publicado pela Vercel. Esta revisão local corrige textos e
  configurações; ela só estará no site depois de enviada e publicada em um novo
  deploy.

Os dados demonstrativos já foram acrescentados ao banco publicado, sem apagar
registros existentes. O comando seguro para repeti-los em outro ambiente é
`npm run seed:demo`, usando `ALLOW_DEMO_SEED=arremate-demo-v1` após confirmar a
conexão em `backend/.env`. As senhas geradas aparecem uma única vez no terminal;
guarde-as em local seguro para avaliação. Esse comando não substitui nem altera
o seed destrutivo `npm run seed`. A interface informa que lotes, lances, saldos e
valores são fictícios e servem apenas para testar o projeto; não são avaliações
de mercado nem ofertas comerciais. Lances feitos durante os testes permanecem
no banco e alteram os lances atuais.

1. Crie um projeto no [Supabase](https://supabase.com/dashboard) pelo plano
   gratuito. Se o painel exigir upgrade ou forma de pagamento, pare e não
   confirme essa opção.
2. No **SQL Editor** do Supabase, execute primeiro todo o conteúdo de
   `backend/src/db/schema.sql` e depois `backend/src/db/supabase-security.sql`.
   O segundo script ativa RLS e revoga leitura direta das tabelas aos papéis
   públicos; a API acessa o banco pelo servidor e o navegador usa apenas
   Broadcast Realtime.
3. Na Vercel, importe o repositório GitHub e crie o primeiro projeto com
   **Root Directory** `frontend`. Configure:
   * `VITE_SUPABASE_URL`: URL do projeto Supabase.
   * `VITE_SUPABASE_PUBLISHABLE_KEY`: chave pública/publishable do Supabase.
   Faça o deploy e copie o domínio de produção atribuído à página.
4. Crie um segundo projeto Vercel a partir do mesmo repositório, com **Root
   Directory** `backend`. Configure as variáveis:
   * `DATABASE_URL`: URI do **Transaction Pooler** exibida em **Connect** no
     Supabase; mantenha os parâmetros SSL/pooler fornecidos pelo painel.
   * `JWT_SECRET`: segredo aleatório, longo e exclusivo.
   * `SUPABASE_URL`: URL do projeto Supabase.
   * `SUPABASE_SECRET_KEY`: chave secreta de servidor do Supabase. Nunca use
     prefixo `VITE_` para esta variável nem a coloque no frontend.
   * `FRONTEND_URL`: domínio de produção do frontend, sem barra final.
   Publique e copie o domínio atribuído à API.
5. Volte às variáveis do projeto `frontend`, defina `VITE_API_URL` como o
   domínio da API (sem barra final) e faça novo deploy.
6. Valide `https://<domínio-da-api>/health`,
   `https://<domínio-da-api>/api/lots` e depois login, publicação de lote, lance
   e evento em tempo real no frontend.

Para criar dados iniciais, configure temporariamente a `DATABASE_URL` do projeto
Supabase em `backend/.env` e execute `npm run seed` no diretório `backend`.
**O seed apaga todos os dados do banco; execute somente em um projeto de teste
novo/descartável.** Ele cria contas de demonstração com a senha local `senha123`;
troque ou descarte essas credenciais antes de usar qualquer dado real.

**Limites dos planos gratuitos:** o Supabase Free pode pausar projetos após uma
semana sem atividade; a Vercel Hobby e o Supabase têm cotas de uso. Verifique os
limites atuais na criação e não selecione upgrades pagos. Na Vercel, o
encerramento/liquidação automática de lotes é verificado a cada requisição da
API; se não houver tráfego no horário final, o processamento ocorre na próxima
requisição.

### Escopo e próximos passos

* O projeto é uma demonstração técnica, não uma casa de leilões operacional.
* Os dados e saldos do ambiente publicado são de teste; lances de avaliação
  permanecem registrados e podem alterar os valores exibidos.
* Esta revisão remove métricas promocionais sem comprovação e textos que
  poderiam ser interpretados como termos, edital ou política legal reais.
* Para publicar esta revisão no site, envie o commit ao repositório conectado à
  Vercel e confirme o resultado do deploy.
* Uma operação comercial real exigiria, entre outras coisas, avaliação
  jurídica, política de privacidade efetiva, controles operacionais e
  integração de pagamento — itens fora do escopo deste protótipo.

---

## 📄 Conteúdo, atribuições e créditos

Modelo de projeto desenvolvido por **Manoela Harrison**. Os ativos SVG próprios
em `frontend/public/demo-lot-*.svg` são usados como fallback; Arte & Design
exibe a identidade Arremate MH. As fotografias abaixo ilustram somente categorias;
não representam os lotes fictícios nem indicam disponibilidade, propriedade,
autenticidade ou endosso:

| Arquivo | Obra e autoria | Licença e origem |
| --- | --- | --- |
| `relogio2.jpg` | “Relógio cronógrafo de luxo com pulseira de couro preta em fundo escuro”, Pixabay | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/tempo-rel%C3%B3gio-rel%C3%B3gio-de-pulso-3091031/) |
| `relogio1.jpg` | “Relógio de bolso prateado vintage e medalhão ornamentado sobre denim azul”, Pixabay | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/rel%C3%B3gio-de-bolso-medalh%C3%A3o-assistir-2569573/) |
| `carro1.jpg` | “Carros Antigos Clássicos”, Pixabay | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/carros-antigos-carros-cl%C3%A1ssicos-7566297/) |
| `carro2.jpg` | “Carro clássico Porsche”, Pixabay | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/carro-carro-cl%C3%A1ssico-porsche-7294294/) |
| `arte-design-pixabay.jpg` | “Arte abstrata em acrílico fluido”, elulela31 | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/arte-resumo-moderno-pintura-4668134/) |
| `arte-design-aquarela.jpg` | “Fundo de textura em aquarela abstrata”, garageband | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/colorido-pintura-fundo-abstract-2468874/) |
| `arte-design-grafite.jpg` | “Mural de graffiti colorido com personagens abstratos de desenho animado e estilo urbano”, MMT | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/pt/photos/grafite-muro-mural-pintura-569265/) |
| `tecnologia-pixabay.jpg` | “Futuristic glowing laptop on desk”, JoshuaWoroniecki | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/photos/laptop-digital-device-technology-5673901/) |
| `colecionaveis-vinil.jpg` | “Vinyl record on turntable close-up”, chienba | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/photos/music-player-record-player-7792956/) |
| `colecionaveis-vinil-2.jpg` | “Vinyl records in record shop”, niro9 | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/photos/record-shop-vinyl-records-music-9180482/) |
| `colecionaveis-gramofone.jpg` | “Vintage gramophone in antique shop”, bogitw | [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/) · [Página da imagem](https://pixabay.com/photos/flea-market-gramophone-music-1262036/) |

As fontes Inter e Plus Jakarta Sans são servidas pelo Google Fonts; consulte os
termos e licenças de seus titulares. Metadados bibliográficos podem ser
consultados na Open Library, que não patrocina nem endossa o projeto. Capas
externas não são incorporadas. Este repositório não concede licença sobre
marcas, fontes ou outros direitos de terceiros, e este aviso não substitui
análise jurídica nem garante que todo conteúdo externo esteja livre de
restrições.

O Pixabay permite uso gratuito, sem atribuição obrigatória, e permite adaptar
seu conteúdo conforme sua Licença de Conteúdo. A licença proíbe redistribuição
do arquivo em base isolada e alerta que certos conteúdos podem envolver direitos
adicionais; as fotos aqui são usadas apenas dentro da interface demonstrativa.
