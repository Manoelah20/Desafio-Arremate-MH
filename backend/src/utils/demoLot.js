function categoryFromLot(lot) {
  const subjects = Array.isArray(lot.external_data?.subjects)
    ? lot.external_data.subjects.filter((subject) => typeof subject === 'string')
    : [];
  const source = `${lot.title || ''} ${subjects.join(' ')}`.toLowerCase();

  if (/rel[oó]gio|watch/.test(source)) return 'Relógios';
  if (/carro|ve[ií]culo|autom[oó]vel/.test(source)) return 'Veículos';
  if (/arte|pintura|design/.test(source)) return 'Arte & Design';
  if (/computador|tecnologia/.test(source)) return 'Tecnologia';
  return 'Colecionáveis';
}

function toPublicDemoLot(lot) {
  const category = categoryFromLot(lot);
  const imageByCategory = {
    'Relógios': ['/relogio2.jpg', '/relogio1.jpg'],
    'Veículos': ['/carro1.jpg', '/carro2.jpg'],
    'Arte & Design': [
      '/arte-design-pixabay.jpg',
      '/arte-design-aquarela.jpg',
      '/arte-design-abstrata-2.jpg',
    ],
    Tecnologia: ['/tecnologia-pixabay.jpg'],
    Colecionáveis: [
      '/colecionaveis-vinil.jpg',
      '/colecionaveis-gramofone.jpg',
      '/colecionaveis-vinil-2.jpg',
    ],
  };
  const categoryImages = imageByCategory[category];
  const imageOptions = Array.isArray(categoryImages)
    ? categoryImages
    : [categoryImages];
  const lastHexDigit = typeof lot.id === 'string'
    ? lot.id.match(/[0-9a-f]$/i)?.[0]
    : null;
  const imageIndex = lastHexDigit
    ? Number.parseInt(lastHexDigit, 16) % imageOptions.length
    : 0;
  return {
    ...lot,
    demo: true,
    title: `Lote demonstrativo — ${category}`,
    description: 'Item e informações fictícios, incluídos apenas para testar a aplicação. Não representam produto disponível para venda.',
    image_url: imageOptions[imageIndex],
    external_data: { source: 'Demonstração', demo: true, subjects: [category] },
    auctioneer_name: 'Conta de demonstração',
    winner_name: lot.winner_name ? 'Conta de teste' : null,
    winner_display: lot.winner_display ? 'Conta de teste' : null,
  };
}

module.exports = { toPublicDemoLot };
