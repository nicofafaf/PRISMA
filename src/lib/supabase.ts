import { createClient } from "@supabase/supabase-js";

// Server (API routes): Prefer SUPABASE_* — auf Netlify zur Laufzeit gesetzt, ohne Build-Cache-Probleme.
// Lokal / optional: NEXT_PUBLIC_* wie in env.example
const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnon =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Client wird nur instanziiert wenn env-vars gesetzt sind
export const supabase =
  supabaseUrl && supabaseAnon
    ? createClient(supabaseUrl, supabaseAnon)
    : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnon);

// ─── Typen die mit der DB-Tabelle übereinstimmen ──────────────────────────────

export interface SharedProfileRow {
  id: string;
  name: string | null;
  gender: string;
  dna: Record<string, number>;
  archetype_name: string;
  archetype_color: string;
  archetype_traits: string[];
  created_at: string;
}
