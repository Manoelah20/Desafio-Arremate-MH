const crypto = require('crypto');

const MAX_AMOUNT_CENTS = 99999999999999n;

function amountToCents(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new TypeError('Valor monetário inválido.');
  }

  const normalized = String(value).trim();
  const match = normalized.match(/^(\d{1,12})(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw new TypeError('Valor monetário inválido.');
  }

  const cents = BigInt(match[1]) * 100n + BigInt((match[2] || '').padEnd(2, '0') || '0');
  if (cents > MAX_AMOUNT_CENTS) {
    throw new RangeError('Valor monetário excede o limite permitido.');
  }

  return cents;
}

function centsToAmount(cents) {
  const value = typeof cents === 'bigint' ? cents : BigInt(cents);
  const absoluteValue = value < 0n ? -value : value;
  const whole = absoluteValue / 100n;
  const fraction = String(absoluteValue % 100n).padStart(2, '0');
  return `${value < 0n ? '-' : ''}${whole}.${fraction}`;
}

function canonicalTimestamp(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Data do lance inválida.');
  }
  return date.toISOString();
}

function createBidHash(prevHash, bidId, lotId, bidderId, amount, createdAt) {
  const canonicalAmount = centsToAmount(amountToCents(amount));
  const timestamp = canonicalTimestamp(createdAt);
  return crypto
    .createHash('sha256')
    .update(`${prevHash}${bidId}${lotId}${bidderId}${canonicalAmount}${timestamp}`)
    .digest('hex');
}

function maskName(name) {
  if (typeof name !== 'string' || name.length === 0) return '';
  if (name.length <= 2) return `${name[0]}*`;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
}

module.exports = { amountToCents, centsToAmount, canonicalTimestamp, createBidHash, maskName };
