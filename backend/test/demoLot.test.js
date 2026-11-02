const test = require('node:test');
const assert = require('node:assert/strict');
const { toPublicDemoLot } = require('../src/utils/demoLot');

test('public demo lots do not expose third-party titles, descriptions, metadata, or images', () => {
  const lot = toPublicDemoLot({
    id: 'lot-id',
    title: 'Título comercial identificável',
    description: 'Genuine product with original certificate.',
    image_url: 'https://assets.invalid/watch-image',
    external_data: {
      source: 'Open Library',
      author: 'Third-party author',
      subjects: ['Relógios'],
      cover_url: 'https://assets.invalid/cover-image',
    },
    initial_bid: '250.00',
    current_bid: '325.00',
    total_bids: 4,
    status: 'ao_vivo',
    winner_name: 'Real looking name',
  });

  assert.equal(lot.title, 'Lote demonstrativo — Relógios');
  assert.equal(lot.demo, true);
  assert.match(lot.description, /fictícios/);
  assert.equal(lot.image_url, '/relogio1.jpg');
  assert.deepEqual(lot.external_data, {
    source: 'Demonstração',
    demo: true,
    subjects: ['Relógios'],
  });

  assert.equal(lot.auctioneer_name, 'Conta de demonstração');
  assert.equal(lot.winner_name, 'Conta de teste');
  assert.equal(lot.initial_bid, '250.00');
  assert.equal(lot.current_bid, '325.00');
  assert.equal(lot.total_bids, 4);
  assert.equal(lot.status, 'ao_vivo');
  assert.doesNotMatch(JSON.stringify(lot), /Título comercial identificável|Third-party author|assets\.invalid/);
});

test('public demo lots select the licensed photo for each category', () => {
  const cases = [
    { subject: 'Tecnologia', image: '/tecnologia-pixabay.jpg' },
    { subject: 'Relógios', image: '/relogio2.jpg' },
    { subject: 'Veículos', image: '/carro1.jpg' },
    { subject: 'Arte & Design', image: '/arte-design-pixabay.jpg' },
    { subject: 'Colecionáveis', image: '/colecionaveis-vinil.jpg' },
  ];

  for (const { subject, image } of cases) {
    const lot = toPublicDemoLot({
      title: 'Lote de teste',
      external_data: { subjects: [subject] },
    });
    assert.equal(lot.external_data.subjects[0], subject);
    assert.equal(lot.image_url, image);
  }
});

test('individual vehicle and watch lots each receive one of their licensed photos', () => {
  const cases = [
    { subject: 'Veículos', id: 'lot-0', image: '/carro1.jpg' },
    { subject: 'Veículos', id: 'lot-1', image: '/carro2.jpg' },
    { subject: 'Relógios', id: 'lot-0', image: '/relogio2.jpg' },
    { subject: 'Relógios', id: 'lot-1', image: '/relogio1.jpg' },
    { subject: 'Arte & Design', id: 'lot-0', image: '/arte-design-pixabay.jpg' },
    { subject: 'Arte & Design', id: 'lot-1', image: '/arte-design-aquarela.jpg' },
    { subject: 'Arte & Design', id: 'lot-2', image: '/arte-design-grafite.jpg' },
    { subject: 'Colecionáveis', id: 'lot-0', image: '/colecionaveis-vinil.jpg' },
    { subject: 'Colecionáveis', id: 'lot-1', image: '/colecionaveis-gramofone.jpg' },
    { subject: 'Colecionáveis', id: 'lot-2', image: '/colecionaveis-vinil-2.jpg' },
  ];

  for (const { subject, id, image } of cases) {
    const lot = toPublicDemoLot({
      id,
      title: 'Lote de teste',
      external_data: { subjects: [subject] },
    });
    assert.equal(lot.image_url, image);
  }
});
