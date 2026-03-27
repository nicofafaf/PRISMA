import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { deriveArchetype } from "@/lib/archetypes";

// ─── GET /api/profiles ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get("gender") ?? "alle";
  const page   = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const limit  = 24;

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { profiles: [], total: 0, configured: false },
      { status: 200 }
    );
  }

  let query = supabase
    .from("shared_profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (gender && gender !== "alle") {
    query = query.eq("gender", gender);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[GET /api/profiles]", error);
    const msg = error.message ?? "";
    const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
    const migrationPending =
      code === "42P01" ||
      msg.includes("Could not find the table") ||
      /shared_profiles/i.test(msg) && /does not exist/i.test(msg);

    return NextResponse.json(
      {
        profiles: [] as const,
        total: 0,
        configured: true,
        dbReady: false,
        dbHint: migrationPending ? "migration" : "error",
        error: msg,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    profiles: data ?? [],
    total: count ?? 0,
    configured: true,
    dbReady: true,
  });
}

// ─── POST /api/profiles ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Datenbank nicht konfiguriert." }, { status: 503 });
  }

  let body: { name?: string; gender: string; dna: Record<string, number> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON." }, { status: 400 });
  }

  const { name, gender, dna } = body;
  if (!gender || !dna) {
    return NextResponse.json({ error: "Fehlende Felder: gender, dna" }, { status: 400 });
  }

  // Archetyp serverseitig berechnen (nicht vom Client übernehmen)
  const archetype = deriveArchetype(dna);

  const { data, error } = await supabase
    .from("shared_profiles")
    .insert({
      name: name?.trim() || null,
      gender,
      dna,
      archetype_name:   archetype.name,
      archetype_color:  archetype.color,
      archetype_traits: archetype.traits,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/profiles]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data }, { status: 201 });
}
