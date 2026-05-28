# Álbum da Copa 2026 — Tracker

Site simples pra acompanhar quais figurinhas faltam pra completar o álbum
da Copa do Mundo 2026. Sem login: quem abre o link já vê tudo e pode marcar/
desmarcar figurinhas. As alterações são salvas no Supabase e ficam permanentes
e compartilhadas (você e sua noiva veem o mesmo).

A porcentagem no topo considera **todas** as figurinhas, incluindo as da
**Coca-Cola** e as do **Brasil**.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com os dados do Supabase
npm run dev
```

Abre em http://localhost:3000

## 1) Configurar o Supabase

1. Crie um projeto em https://supabase.com (plano grátis serve).
2. No painel do projeto, abra **SQL Editor** e rode o conteúdo de `supabase.sql`.
3. Vá em **Project Settings → API** e copie:
   - **Project URL** → variável `SUPABASE_URL`
   - **service_role** secret → variável `SUPABASE_SERVICE_ROLE_KEY`
4. Cole esses valores no `.env.local` (local) e nas variáveis de ambiente da Vercel (produção).

> A `service_role key` é secreta e só é usada no servidor (API routes). Nunca é
> enviada pro navegador.

## 2) Subir no GitHub

```bash
git init
git add .
git commit -m "Tracker do álbum da Copa 2026"
git branch -M main
git remote add origin git@github.com:SEU_USUARIO/world-cup-album-tracker.git
git push -u origin main
```

## 3) Deploy na Vercel

1. Em https://vercel.com → **Add New → Project** e importe o repositório do GitHub.
2. Em **Environment Variables**, adicione `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
3. **Deploy**. Pronto — o link é o site.

## Editar os dados

- Toque numa figurinha pra marcar (✓) ou desmarcar. Salva sozinho.
- A análise inicial (o que você já tinha) está em `lib/catalog.ts`, no campo
  `have` de cada seleção. Dá pra ajustar lá se algum número veio errado da foto.

## Estrutura

- `lib/catalog.ts` — catálogo de todas as figurinhas + seed da análise das fotos.
- `app/api/stickers/route.ts` — API que lê/grava no Supabase.
- `components/AlbumTracker.tsx` — a tela (barra de progresso, filtros, grade).
- `album_fotos/` — fotos do álbum em JPG (as originais .HEIC ficam fora do git).
