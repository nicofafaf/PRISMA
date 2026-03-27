import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Datenbank nicht konfiguriert." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("shared_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Profil nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({ profile: data });
}
