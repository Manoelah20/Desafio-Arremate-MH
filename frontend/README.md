# 🏛️ Arremate MH Leilões — Casa de Leilões Online

> **Desafio Técnico — Desenvolvido por Manoela Harrison**  
> Frontend React 19/TypeScript ligado à API Node.js e ao Broadcast Realtime do Supabase da Casa de Leilões Arremate MH.

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla%20Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Author](https://img.shields.io/badge/Autora-Manoela%20Harrison-fbbf24?style=for-the-badge&logo=github&logoColor=black)

---

## 👩‍💻 Autora & Informações do Desafio

* **Desenvolvedora:** Manoela Harrison
* **Desafio:** Casa de Leilões Online — aplicação web com front-end e back-end.
* **Objetivo:** Oferecer uma experiência de leilão conectada à API real, com cadastro, lances e atualização em tempo real.

---

## 📌 Sobre o Projeto

O **Arremate MH** é uma plataforma concebida para a mediação segura e transparente de leilões eletrônicos de alto padrão — contemplando desde relógios de luxo e clássicos automotivos até tecnologia de ponta e colecionáveis raros.

O frontend consome a API do backend e prioriza:
1. **Fidelidade e refinamento estético:** paleta dark com toques de amarelo dourado e violeta, tipografia contemporânea e efeitos sutis de vidro (*glassmorphism*).
2. **Engenharia de software sólida:** separação clara de responsabilidades, componentes autocontidos com CSS modular (BEM-like), tipagem estrita com TypeScript e zero dependências infladas.
3. **Interatividade rica e fluida:** filtros reativos, busca, autenticação, lances reais e atualização em tempo real.

---

## 🎨 Design System & Identidade Visual

O layout foi inteiramente projetado com **Vanilla CSS** através de um sistema estruturado de *design tokens* nativos em `src/index.css`:

* **Base Escura Sofisticada (`#0a0b10` / `#141522`):** Proporciona conforto visual prolongado e destaca as imagens dos produtos.
* **Amarelo Dourado & Âmbar (`#fbbf24` / `#facc15` / `#f59e0b`):** Evoca a tradição do martelo de leilão, chamando atenção para valores de lance, status "Ao Vivo" e cronômetros de urgência.
* **Roxo & Violeta Real (`#8b5cf6` / `#7c3aed` / `#c084fc`):** Utilizado em botões de ação primária, cartões de destaque e selos de autenticidade da casa.
* **Tipografia:** 
  * **Plus Jakarta Sans:** Títulos, monograma MH e valores numéricos de impacto.
  * **Inter:** Textos descritivos, metadados e documentação jurídica para máxima legibilidade.

---

## 🚀 Funcionalidades do Frontend

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

### 5. Catálogo de Lotes Realistas
* **Rolex Cellini Date 39mm Ouro Everose** (estojo original e lacre).
* **Rolex Oyster Perpetual Milgauss 116400GV** (safira verde icônica).
* **Cadillac Coupe de Ville 1959 Clássico Rosa** (ícone rabo de peixe).
* **Mercedes-AMG GT Coupe 4.0 V8 Biturbo Azul** (superesportivo alemão).
* **Volkswagen 1600 TL Fastback 1972 Clássico Azul** (raridade de coleção).
* **MacBook Pro 16" M3 Max**, **Leica M11 Rangefinder** e **Fender Stratocaster Custom Shop '62**.

### 6. Modais Institucionais e de Ação
* **Modal de Detalhes do Lote (`AuctionModal`):** Histórico de lances, saldo e envio de lances validados pela API.
* **Modal de Acesso (`AuthModal`):** Login e cadastro de licitantes por meio da API.
* **Painel do Leiloeiro (`SellerDashboard`):** Busca de livros na Open Library, publicação e cancelamento de lotes sem lances.
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
frontend/
├── public/                     # Imagens dos lotes e assets estáticos
│   ├── rolex-cellini.jpg
│   ├── rolex-milgauss.jpg
│   ├── cadillac-1959-pink.jpg
│   ├── mercedes-amg-gt.jpg
│   ├── vw-classico-azul.jpg
│   └── hero-gavel-bg.jpg
├── src/
│   ├── components/
│   │   ├── Header/             # Cabeçalho com logo MH e menu mobile
│   │   ├── Hero/               # Banner principal e indicadores de credibilidade
│   │   ├── SearchBar/          # Busca, filtros de categoria e ordenação
│   │   ├── AuctionCard/        # Cartão de lote com tempo e valor formatado
│   │   ├── AuctionGrid/        # Grade de cards e estado vazio (empty state)
│   │   ├── HowItWorks/         # Guia em 3 etapas para novos participantes
│   │   ├── AuctionModal/       # Detalhes, histórico e lances reais
│   │   ├── AuthModal/          # Modal de autenticação (login / registro)
│   │   ├── SellerDashboard/    # Busca externa e gerenciamento de lotes
│   │   ├── LegalModal/         # Modal de Termos de Uso, LGPD e Edital
│   │   └── Footer/             # Rodapé com logo oficial e links legais
│   ├── api.ts                  # Cliente REST e mapeamento de lotes
│   ├── types/
│   │   └── auction.ts          # Interfaces e tipos estritos TypeScript
│   ├── App.tsx                 # Gerenciamento de estado e fluxo da aplicação
│   ├── App.css                 # Estilos do layout principal
│   ├── index.css               # Tokens globais de design e tipografia
│   └── main.tsx                # Ponto de entrada React
├── index.html                  # HTML base com meta tags e fontes
├── package.json                # Scripts e dependências do projeto
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configuração do Vite
```

---

## 💻 Instruções para Execução Local

### Pré-requisitos
* **Node.js** v18+ instalado
* **npm** ou gerenciador de pacotes equivalente

### Passo a Passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   Crie o arquivo `.env` copiando `.env.example`. Para uso local, mantenha
   `VITE_API_URL=http://localhost:3001`; sem configuração Supabase, o app usa
   Socket.IO local e consulta periódica como fallback. Para usar Realtime local,
   configure também a URL e a chave pública Supabase. O guia de publicação Vercel + Supabase está no
   [README principal](../README.md).

3. **Abra no navegador:**
   ```text
   http://localhost:5173
   ```

### Scripts de Validação

* `npm run build`: Valida toda a tipagem TypeScript (`tsc -b`) e gera a build de produção.
* `npm run lint`: Executa a verificação estática do ESLint.
* `npm run preview`: Executa localmente o bundle otimizado de produção.

---

## 🔮 Visão de Futuro (Próximas Etapas)

* **Tempo real:** o deploy usa canais Broadcast do Supabase; o ambiente local mantém Socket.IO como alternativa.

---

## 📄 Licença e Créditos

Projeto desenvolvido por **Manoela Harrison** como solução para o **Desafio Técnico — Casa de Leilões Online**.  
Todos os direitos reservados &copy; 2026.
