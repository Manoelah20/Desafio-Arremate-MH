# Interface do protótipo Arremate MH

Este frontend faz parte de um modelo de projeto e serve somente para demonstração
e testes. Os itens, valores, lances, contas e comprovantes exibidos são fictícios.
Não há produtos à venda, pagamento, entrega, avaliação de mercado ou obrigação
comercial/jurídica. Não use dados pessoais ou senhas reais.

## Tecnologias

- React e TypeScript, com Vite.
- API Express e PostgreSQL; configuração local em `.env`.
- Socket.IO no ambiente local e Supabase Broadcast quando configurado.

## Executar localmente

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e configure `VITE_API_URL`.
3. Execute `npm run dev`.
4. Valide com `npm run build` e `npm run lint`.

Para configurar e iniciar o backend e o banco, consulte o [README principal](../README.md).

## Conteúdo e atribuições

- Os lotes públicos da API são apresentados com nomes, descrições e ilustração
  genéricos de demonstração. Valores, estados e histórico de lances são mantidos
  para exercitar os fluxos.
- As fotografias locais em `public/demo-lot-*.jpg` ilustram apenas as categorias
  dos lotes fictícios; não representam itens disponíveis para venda. As
  imagens SVG em `public/demo-lot-*.svg` são próprias e usadas como fallback;
  a de Arte & Design exibe a identidade visual Arremate MH.
- As atribuições, licenças e links de origem das fotografias estão no README
  principal. A imagem de colecionáveis é distribuída sob CC BY-SA 4.0; as demais
  fotografias estão sob CC0.
- O painel pode consultar metadados bibliográficos da Open Library para testes.
  As capas não são exibidas nem devolvidas pelo endpoint de busca. A Open
  Library não patrocina nem endossa o projeto.
- As fontes Inter e Plus Jakarta Sans são carregadas do Google Fonts; consulte
  os termos e licenças publicados pelos respectivos titulares.
- Marcas de terceiros, se encontradas em dados antigos ou em consultas, não
  indicam afiliação, autorização ou endosso. Este projeto não concede licença
  sobre marcas, fontes ou outros direitos de terceiros.

Este aviso descreve o escopo técnico da demonstração e não é aconselhamento
jurídico nem garantia de que todo conteúdo externo esteja livre de restrições.
