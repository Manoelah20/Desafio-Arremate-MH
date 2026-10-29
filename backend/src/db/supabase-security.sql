-- Execute este script no SQL Editor do Supabase após schema.sql.
-- O backend acessa o banco com a connection string e autentica via JWT próprio.
-- O navegador só deve usar o publishable/anon key para Supabase Realtime.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.users, public.lots, public.bids, public.audit_log
  FROM anon, authenticated;
