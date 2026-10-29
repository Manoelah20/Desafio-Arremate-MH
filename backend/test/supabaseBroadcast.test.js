const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SUPABASE_URL = 'https://auction-project.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'server-only-test-key';

const publishSupabaseBroadcast = require('../src/services/supabaseBroadcast');

test('publica apenas o evento solicitado no canal Realtime público', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => {
    global.fetch = originalFetch;
  });

  let request;
  global.fetch = async (url, options) => {
    request = { url: String(url), options };
    return { ok: true, status: 200 };
  };

  await publishSupabaseBroadcast('lot:lot-id', 'new_bid', { lot_id: 'lot-id' });

  assert.equal(
    request.url,
    'https://auction-project.supabase.co/realtime/v1/api/broadcast/lot%3Alot-id/events/new_bid'
  );
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.apikey, 'server-only-test-key');
  assert.equal(request.options.headers.Authorization, undefined);
  assert.equal(request.options.body, JSON.stringify({ lot_id: 'lot-id' }));
});

test('sinaliza erros HTTP do Supabase sem expor chaves', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => {
    global.fetch = originalFetch;
  });
  global.fetch = async () => ({ ok: false, status: 429 });

  await assert.rejects(
    publishSupabaseBroadcast('lot:lot-id', 'new_bid', {}),
    { message: 'Supabase Realtime respondeu HTTP 429.' }
  );
});
