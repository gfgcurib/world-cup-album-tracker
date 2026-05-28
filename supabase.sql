-- Rode isto no Supabase: Dashboard > SQL Editor > New query > Run.
-- Cria a tabela onde ficam salvas as alterações de figurinhas.

create table if not exists public.sticker_overrides (
  code text primary key,
  collected boolean not null,
  updated_at timestamptz not null default now()
);

-- O site acessa via service role key (no servidor), então RLS pode ficar
-- desligada nesta tabela simples. Se quiser ligar RLS depois, lembre de
-- criar políticas de leitura/escrita.
alter table public.sticker_overrides disable row level security;
