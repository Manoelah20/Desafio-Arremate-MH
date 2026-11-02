# Arremate MH — Protótipo demonstrativo de leilões

Modelo de aplicação full-stack criado por **Manoela Harrison** para demonstrar
catálogo de lotes, autenticação, lances simulados e atualizações em tempo real.

> **Somente para demonstração e portfólio.** Contas, lotes, valores e lances são
> fictícios. Não há produtos à venda, pagamentos ou entregas. Não use dados
> pessoais nem senhas reais.

## Demonstração

- **Aplicação:** [desafio-arremate-mh.vercel.app](https://desafio-arremate-mh.vercel.app/)
- **API:** [desafio-arremate-mh-u8eb.vercel.app](https://desafio-arremate-mh-u8eb.vercel.app/)

## Funcionalidades

- Cadastro e login de licitantes com JWT.
- Catálogo, busca, filtros por categoria e ordenação de lotes demonstrativos.
- Lances de teste validados pela API, com incremento mínimo e saldo fictício.
- Histórico de lances e verificação da cadeia de hashes de demonstração.
- Atualizações em tempo real com Socket.IO localmente e Supabase Broadcast
  quando configurado no ambiente publicado.
- Painel demonstrativo do leiloeiro para consultar metadados bibliográficos da
  Open Library e testar a publicação de lotes.
- Interface responsiva e explicações sobre demonstração, dados e créditos.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript, Vite e CSS |
| Backend | Node.js, Express, PostgreSQL, JWT e Socket.IO |
| Tempo real | Socket.IO local; Supabase Broadcast no ambiente publicado |
| Hospedagem | Vercel |

## Arquitetura

```text
Navegador (React)
       │ REST / HTTPS
       ▼
API Express ───── PostgreSQL
       │
       └───────── Supabase Broadcast (ambiente publicado)
```

O repositório contém dois projetos Vercel ligados ao mesmo código: o frontend
usa a pasta `frontend/` como raiz e a API usa `backend/`.

## Executar localmente

Requisitos: Node.js compatível com Vite 8 (o backend requer Node.js 20 ou
superior), npm e PostgreSQL.

1. Crie um banco PostgreSQL local e configure as variáveis:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   Copy-Item frontend/.env.example frontend/.env
   ```

2. Em `backend/.env`, defina `DATABASE_URL` para o banco local e configure
   `JWT_SECRET` com um segredo aleatório de pelo menos 32 caracteres.
3. Aplique o schema e inicie a API:

   ```powershell
   Set-Location backend
   npm install
   npm run db:schema
   npm run dev
   ```

4. Em outro terminal, inicie o frontend:

   ```powershell
   Set-Location frontend
   npm install
   npm run dev
   ```

5. Acesse `http://localhost:5173`. A API local fica em
   `http://localhost:3001`; verifique-a em `/api/health`.

O frontend usa `VITE_API_URL` (padrão local: `http://localhost:3001`).
Socket.IO é usado localmente. Para testar Supabase Realtime, configure também
as variáveis Supabase indicadas nos arquivos `.env.example`.

> **Atenção aos dados:** `npm run seed` apaga e recria todos os usuários, lotes
> e lances do banco configurado. Use-o somente em um banco local descartável,
> nunca em produção ou em um banco com dados que queira preservar. O script
> `npm run seed:demo` é restrito a um pooler Supabase e cria dados de teste sem
> apagar os existentes; requer `ALLOW_DEMO_SEED=arremate-demo-v1`.

## Testes e validação

No frontend:

```powershell
npm run build
npm run lint
```

No backend:

```powershell
npm test
```

## Estrutura

```text
backend/
  src/
    db/           # Schema, migração, conexão e dados de demonstração
    middleware/   # Autenticação e autorização
    routes/       # API de usuários, lotes, lances e auditoria
    services/     # Encerramento de lotes e eventos em tempo real
    utils/        # Valores, hashes e dados públicos de demonstração
  test/
frontend/
  public/         # Fotos licenciadas e ilustrações de fallback
  src/
    components/
```

## Fotografias e créditos

As fotografias ilustram categorias e não correspondem aos lotes fictícios.
As imagens do Pixabay são usadas sob a [Licença de Conteúdo do Pixabay](https://pixabay.com/service/license-summary/).

| Arquivo | Autor / origem |
| --- | --- |
| `relogio2.jpg` | Pixabay — [relógio cronógrafo](https://pixabay.com/pt/photos/tempo-rel%C3%B3gio-rel%C3%B3gio-de-pulso-3091031/) |
| `relogio1.jpg` | Pixabay — [relógio de bolso](https://pixabay.com/pt/photos/rel%C3%B3gio-de-bolso-medalh%C3%A3o-assistir-2569573/) |
| `carro1.jpg` | Pixabay — [carros antigos clássicos](https://pixabay.com/pt/photos/carros-antigos-carros-cl%C3%A1ssicos-7566297/) |
| `carro2.jpg` | Pixabay — [Porsche clássico](https://pixabay.com/pt/photos/carro-carro-cl%C3%A1ssico-porsche-7294294/) |
| `arte-design-pixabay.jpg` | elulela31 — [arte abstrata em acrílico](https://pixabay.com/pt/photos/arte-resumo-moderno-pintura-4668134/) |
| `arte-design-aquarela.jpg` | garageband — [textura de aquarela](https://pixabay.com/pt/photos/colorido-pintura-fundo-abstract-2468874/) |
| `arte-design-grafite.jpg` | MMT — [mural de graffiti](https://pixabay.com/pt/photos/grafite-muro-mural-pintura-569265/) |
| `tecnologia-pixabay.jpg` | JoshuaWoroniecki — [laptop futurista](https://pixabay.com/photos/laptop-digital-device-technology-5673901/) |
| `colecionaveis-vinil.jpg` | chienba — [disco de vinil](https://pixabay.com/photos/music-player-record-player-7792956/) |
| `colecionaveis-vinil-2.jpg` | niro9 — [loja de discos](https://pixabay.com/photos/record-shop-vinyl-records-music-9180482/) |
| `colecionaveis-gramofone.jpg` | bogitw — [gramofone vintage](https://pixabay.com/photos/flea-market-gramophone-music-1262036/) |

Os créditos também estão disponíveis no modal de informações da aplicação.
Metadados podem ser consultados na Open Library; capas externas não são
incorporadas. Inter e Plus Jakarta Sans são carregadas do Google Fonts.

## Autoria

**Manoela Harrison** · [GitHub](https://github.com/Manoelah20) ·
[LinkedIn](https://linkedin.com/in/manoelaharrison)