const test = require('node:test');
const assert = require('node:assert/strict');
const { amountToCents, centsToAmount, createBidHash, maskName } = require('../src/utils/bid');

test('converte valores monetários sem perder centavos', () => {
  assert.equal(amountToCents('123.45'), 12345n);
  assert.equal(amountToCents(250), 25000n);
  assert.equal(centsToAmount(12345n), '123.45');
});

test('rejeita valores inválidos ou acima da precisão do banco', () => {
  for (const value of [-1, '1.234', '1e3', '1000000000000.00', 'NaN', null]) {
    assert.throws(() => amountToCents(value));
  }
});

test('gera o mesmo hash para valor e data em formatos equivalentes do PostgreSQL', () => {
  const original = createBidHash(
    '0'.repeat(64),
    'bid-id',
    'lot-id',
    'bidder-id',
    250,
    '2026-10-29T19:00:00.123Z'
  );
  const readBack = createBidHash(
    '0'.repeat(64),
    'bid-id',
    'lot-id',
    'bidder-id',
    '250.00',
    new Date('2026-10-29T19:00:00.123Z')
  );

  assert.equal(original, readBack);
});

test('hash muda quando os dados encadeados são alterados', () => {
  const hash = createBidHash(
    '0'.repeat(64),
    'bid-id',
    'lot-id',
    'bidder-id',
    '250.00',
    '2026-10-29T19:00:00.123Z'
  );

  assert.notEqual(hash, createBidHash(
    '0'.repeat(64),
    'bid-id',
    'lot-id',
    'bidder-id',
    '251.00',
    '2026-10-29T19:00:00.123Z'
  ));
});

test('mascara nomes sem devolver a identidade completa', () => {
  assert.equal(maskName('Carlos'), 'C****s');
  assert.equal(maskName('Ana'), 'A*a');
  assert.equal(maskName('A'), 'A*');
});
