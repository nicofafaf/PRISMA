-- ─────────────────────────────────────────────────────────────────────────────
-- PRISMA · Shared Profiles
-- Führe dieses SQL in deinem Supabase-Projekt unter:
-- Dashboard → SQL Editor → "New query" aus.
-- ─────────────────────────────────────────────────────────────────────────────

-- UUID-Erweiterung (in Supabase meist schon aktiv)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabelle anlegen
CREATE TABLE IF NOT EXISTS public.shared_profiles (
  id               UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name             TEXT,                                          -- NULL = anonym
  gender           TEXT        NOT NULL DEFAULT 'keine_angabe',  -- see gender options
  dna              JSONB       NOT NULL,                          -- { structure: 72, ... }
  archetype_name   TEXT        NOT NULL,
  archetype_color  TEXT        NOT NULL DEFAULT '#00e5ff',
  archetype_traits TEXT[]      NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security aktivieren
ALTER TABLE public.shared_profiles ENABLE ROW LEVEL SECURITY;

-- Jeder darf lesen
CREATE POLICY "public_read"
  ON public.shared_profiles
  FOR SELECT
  USING (true);

-- Jeder darf ein neues Profil einstellen
CREATE POLICY "public_insert"
  ON public.shared_profiles
  FOR INSERT
  WITH CHECK (true);

-- Kein Update / Delete von außen möglich
-- (Verwaltung nur direkt im Supabase-Dashboard)
