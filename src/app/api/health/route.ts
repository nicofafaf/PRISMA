import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type DbStatus = "inactive" | "migration_pending" | "error" | "active";

function tableMissingMessage(msg: string, code?: string) {
  return (
    code === "42P01" ||
    msg.includes("Could not find the table") ||
    msg.includes("does not exist") ||
    /relation\s+"?shared_profiles"?\s+does not exist/i.test(msg)
  );
}

// GET /api/health — Supabase erreichbar? Tabelle shared_profiles vorhanden?
export async function GET() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        database: "inactive" as DbStatus,
        message:
          "Supabase nicht konfiguriert. Setze SUPABASE_URL und SUPABASE_ANON_KEY (oder NEXT_PUBLIC_*).",
      },
      { status: 200 }
    );
  }

  const { error } = await supabase.from("shared_profiles").select("id").limit(1);

  if (error) {
    const msg = error.message ?? "";
    const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
    const missing = tableMissingMessage(msg, code);

    return NextResponse.json(
      {
        ok: false,
        configured: true,
        database: (missing ? "migration_pending" : "error") as DbStatus,
        message: missing
          ? "Tabelle „shared_profiles“ fehlt. SQL aus supabase/migrations/001_shared_profiles.sql im Supabase SQL-Editor ausführen."
          : msg,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      configured: true,
      database: "active" as DbStatus,
      message: "Datenbank aktiv und erreichbar.",
    },
    { status: 200 }
  );
}
