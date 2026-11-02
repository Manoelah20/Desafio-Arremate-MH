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
  assert.equal(lot.image_url, '/demo-lot.svg');
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
