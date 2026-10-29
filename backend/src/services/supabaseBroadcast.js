const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

async function publishSupabaseBroadcast(topic, event, payload) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Configure SUPABASE_URL e SUPABASE_SECRET_KEY para habilitar o tempo real.');
  }

  const endpoint = new URL(
    `/realtime/v1/api/broadcast/${encodeURIComponent(topic)}/events/${encodeURIComponent(event)}`,
    SUPABASE_URL
  );
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase Realtime respondeu HTTP ${response.status}.`);
  }
}

module.exports = publishSupabaseBroadcast;
