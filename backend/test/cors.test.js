const test = require('node:test');
const assert = require('node:assert/strict');
const { isOriginAllowed } = require('../src/utils/cors');

const configuredOrigins = ['http://localhost:5173'];

test('allows another local Vite port during development', () => {
  assert.equal(isOriginAllowed('http://localhost:5175', configuredOrigins, false), true);
  assert.equal(isOriginAllowed('http://127.0.0.1:5175', configuredOrigins, false), true);
});

test('does not allow non-local development origins when an allowlist is configured', () => {
  assert.equal(isOriginAllowed('https://example.com', configuredOrigins, false), false);
  assert.equal(isOriginAllowed('https://localhost:5175', configuredOrigins, false), false);
});

test('keeps production origins restricted to the configured allowlist', () => {
  assert.equal(isOriginAllowed('http://localhost:5175', configuredOrigins, true), false);
  assert.equal(isOriginAllowed('https://desafio-arremate-mh.vercel.app', [
    'https://desafio-arremate-mh.vercel.app',
  ], true), true);
});

test('preserves requests without an Origin header and unconfigured development behavior', () => {
  assert.equal(isOriginAllowed(undefined, configuredOrigins, true), true);
  assert.equal(isOriginAllowed('https://example.com', [], false), true);
});
