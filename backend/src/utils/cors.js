function isLocalDevelopmentOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.protocol === 'http:'
      && url.origin === origin
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch {
    return false;
  }
}

function isOriginAllowed(origin, allowedOrigins, isProduction) {
  if (!origin || allowedOrigins.includes(origin)) return true;
  if (isProduction) return false;
  if (allowedOrigins.length === 0) return true;
  return isLocalDevelopmentOrigin(origin);
}

module.exports = { isOriginAllowed };
