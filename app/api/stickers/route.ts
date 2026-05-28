import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET: devolve os overrides salvos { code: collected }.
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("sticker_overrides")
      .select("code, collected");
    if (error) throw error;
    const overrides: Record<string, boolean> = {};
    for (const row of data ?? []) overrides[row.code] = row.collected;
    return NextResponse.json({ overrides });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST { code, collected }: grava/atualiza o estado de uma figurinha.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body?.code ?? "").trim();
    const collected = Boolean(body?.collected);
    if (!code) {
      return NextResponse.json({ error: "code é obrigatório" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { error } = await supabase
      .from("sticker_overrides")
      .upsert(
        { code, collected, updated_at: new Date().toISOString() },
        { onConflict: "code" }
      );
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : typeof e === "object" && e !== null
          ? JSON.stringify(e)
          : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
