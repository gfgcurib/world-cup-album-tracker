import { createClient } from "@supabase/supabase-js";

// Cliente usado apenas no servidor (API routes). Usa a service role key,
// que NUNCA é exposta ao navegador — fica só nas variáveis de ambiente da Vercel.
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabase() {
  if (!url || !serviceKey) {
    throw new Error(
      "Faltam as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY. Configure no .env.local (local) e na Vercel (produção)."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
