-- Schema do banco de dados Arremate MH
-- Modelo demonstrativo de projeto por Manoela Harrison

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tipos de perfil de usuário
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('leiloeiro', 'licitante');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Tipos de status de lote
DO $$ BEGIN
  CREATE TYPE lot_status AS ENUM ('agendado', 'ao_vivo', 'encerrado', 'cancelado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================
-- TABELA: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(255)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  role       user_role     NOT NULL DEFAULT 'licitante',
  balance    NUMERIC(14,2) NOT NULL DEFAULT 1000.00, -- saldo inicial simulado para licitantes
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: lots
-- ============================================================
CREATE TABLE IF NOT EXISTS lots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auctioneer_id   UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(255)  NOT NULL,
  description     TEXT,
  image_url       TEXT,
  external_data   JSONB,              -- dados brutos da API pública (Open Library)
  initial_bid     NUMERIC(14,2) NOT NULL,
  min_increment   NUMERIC(14,2) NOT NULL DEFAULT 10.00,
  current_bid     NUMERIC(14,2) NOT NULL DEFAULT 0,
  winner_id       UUID          REFERENCES users(id),
  status          lot_status    NOT NULL DEFAULT 'agendado',
  starts_at       TIMESTAMPTZ   NOT NULL,
  ends_at         TIMESTAMPTZ   NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_dates CHECK (ends_at > starts_at),
  CONSTRAINT chk_initial_bid CHECK (initial_bid > 0)
);

-- ============================================================
-- TABELA: bids
-- ============================================================
CREATE TABLE IF NOT EXISTS bids (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id      UUID          NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  bidder_id   UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount      NUMERIC(14,2) NOT NULL,
  -- hash SHA-256 encadeado: sha256(prev_hash || bid_id || lot_id || bidder_id || amount || created_at)
  -- ajuda a detectar alterações quando a cadeia é verificada; não é armazenamento imutável
  chain_hash  VARCHAR(64)   NOT NULL,
  prev_hash   VARCHAR(64)   NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_amount CHECK (amount > 0)
);

-- ============================================================
-- TABELA: audit_log (comprovantes e auditoria)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id     UUID NOT NULL REFERENCES lots(id),
  event_type VARCHAR(50) NOT NULL, -- 'bid', 'lot_closed', 'lot_cancelled', 'lot_extended'
  payload    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES de performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_lots_status       ON lots(status);
CREATE INDEX IF NOT EXISTS idx_lots_ends_at      ON lots(ends_at);
CREATE INDEX IF NOT EXISTS idx_bids_lot_id       ON bids(lot_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id    ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_audit_lot_id      ON audit_log(lot_id);
