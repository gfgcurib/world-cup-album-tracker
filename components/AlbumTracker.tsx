"use client";

import { useEffect, useMemo, useState } from "react";
import { SECTIONS, TOTAL, type Section, type Sticker } from "@/lib/catalog";

type Filter = "todas" | "faltando" | "coletadas";

type Pending = {
  code: string;
  seed: boolean;
  next: boolean; // true = marcar como coletada, false = marcar como faltando
  label: string;
};

export default function AlbumTracker() {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState<Filter>("todas");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  useEffect(() => {
    fetch("/api/stickers")
      .then((r) => r.json())
      .then((d) => {
        if (d?.overrides) setOverrides(d.overrides);
        else setOffline(true);
      })
      .catch(() => setOffline(true))
      .finally(() => setLoaded(true));
  }, []);

  function isCollected(code: string, seed: boolean): boolean {
    return code in overrides ? overrides[code] : seed;
  }

  function requestToggle(st: Sticker) {
    if (pending?.code === st.code) {
      setPending(null);
      return;
    }
    const next = !isCollected(st.code, st.seed);
    setPending({ code: st.code, seed: st.seed, next, label: st.label });
  }

  async function confirmToggle() {
    if (!pending) return;
    const { code, seed, next } = pending;
    setPending(null);
    setOverrides((prev) => ({ ...prev, [code]: next }));
    setSaving(true);
    try {
      const res = await fetch("/api/stickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, collected: next }),
      });
      if (!res.ok) throw new Error();
      setOffline(false);
    } catch {
      setOverrides((prev) => ({ ...prev, [code]: !next }));
      setOffline(true);
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    let have = 0, coca = 0, cocaTotal = 0, bra = 0, braTotal = 0;
    for (const sec of SECTIONS) {
      for (const st of sec.stickers) {
        const c = isCollected(st.code, st.seed);
        if (c) have++;
        if (sec.id === "COCA") { cocaTotal++; if (c) coca++; }
        if (sec.id === "BRA")  { braTotal++;  if (c) bra++;  }
      }
    }
    return { have, coca, cocaTotal, bra, braTotal };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides]);

  const pct = TOTAL ? Math.round((stats.have / TOTAL) * 1000) / 10 : 0;
  const missing = TOTAL - stats.have;

  const sections = useMemo(
    () => filterSections(filter, query, isCollected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, query, overrides]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6">
      {/* Header */}
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          FIFA World Cup 2026
        </p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-5xl">
          Álbum da Copa · Tracker
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Marque as figurinhas conforme conseguir. Salva automaticamente e aparece
          pra você e pra sua noiva.
        </p>
      </header>

      {/* Progress */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              {pct.toFixed(1)}<span className="text-xl text-white/40">%</span>
            </div>
            <p className="mt-1 text-xs text-white/40">
              incluindo Coca-Cola e figurinhas do Brasil
            </p>
          </div>
          <div className="text-right text-sm text-white/60">
            <div>
              <span className="text-lg font-bold text-white">{stats.have}</span>{" "}
              de {TOTAL}
            </div>
            <div className="text-rose-400 font-medium">faltam {missing}</div>
          </div>
        </div>

        {/* Barra simples */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <Chip label="Brasil"     value={`${stats.bra}/${stats.braTotal}`}   color="#FFCB05" />
          <Chip label="Coca-Cola"  value={`${stats.coca}/${stats.cocaTotal}`} color="#E61A27" />
          {!loaded && <span className="text-white/35">carregando…</span>}
          {saving  && <span className="text-white/35">salvando…</span>}
          {offline && (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 font-semibold text-amber-300">
              ⚠ Sem conexão
            </span>
          )}
        </div>
      </section>

      {/* Controles */}
      <section className="sticky top-2 z-10 mb-5 flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0b1c38]/90 p-3 backdrop-blur sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-full bg-white/5 p-1">
          {(["todas", "faltando", "coletadas"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
                filter === f
                  ? "bg-emerald-600 text-white"
                  : "text-white/55 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar (Brasil, Argentina, FWC…)"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/30 focus:border-emerald-500"
        />
      </section>

      {/* Seções */}
      <div className="space-y-4">
        {sections.map((sec) => (
          <TeamCard
            key={sec.id}
            section={sec}
            isCollected={isCollected}
            onClickSticker={requestToggle}
            pendingCode={pending?.code ?? null}
            pendingNext={pending?.next ?? null}
          />
        ))}
        {sections.length === 0 && (
          <p className="py-12 text-center text-white/35">
            Nada com esse filtro.
          </p>
        )}
      </div>

      <footer className="mt-10 text-center text-xs text-white/25">
        Feito com carinho pra completar o álbum 🏆 · clique numa figurinha e confirme
      </footer>

      {/* Barra de confirmação */}
      {pending && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#07192e]/95 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                Confirmar alteração
              </p>
              <p className="truncate font-semibold text-white">
                {pending.label}
              </p>
              <p className={`text-sm font-medium ${pending.next ? "text-emerald-400" : "text-rose-400"}`}>
                {pending.next ? "→ marcar como coletada ✓" : "→ marcar como faltando ✗"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPending(null)}
                className="flex-1 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5 sm:flex-none"
              >
                Cancelar
              </button>
              <button
                onClick={confirmToggle}
                className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold text-white sm:flex-none ${
                  pending.next
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-rose-700 hover:bg-rose-600"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function filterSections(
  filter: Filter,
  query: string,
  isCollected: (code: string, seed: boolean) => boolean
): Section[] {
  const q = query.trim().toLowerCase();
  return SECTIONS.flatMap((sec) => {
    const matchesQuery =
      !q ||
      sec.title.toLowerCase().includes(q) ||
      (sec.subtitle ?? "").toLowerCase().includes(q) ||
      sec.id.toLowerCase().includes(q);
    if (!matchesQuery) return [];
    const stickers = sec.stickers.filter((st) => {
      const c = isCollected(st.code, st.seed);
      if (filter === "faltando")  return !c;
      if (filter === "coletadas") return c;
      return true;
    });
    if (stickers.length === 0) return [];
    return [{ ...sec, stickers }];
  });
}

function Chip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1 font-semibold">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label} <span className="text-white/45">{value}</span>
    </span>
  );
}

// ─── TeamCard ────────────────────────────────────────────────────────────────

function TeamCard({
  section,
  isCollected,
  onClickSticker,
  pendingCode,
  pendingNext,
}: {
  section: Section;
  isCollected: (code: string, seed: boolean) => boolean;
  onClickSticker: (st: Sticker) => void;
  pendingCode: string | null;
  pendingNext: boolean | null;
}) {
  const have  = section.stickers.filter((s) => isCollected(s.code, s.seed)).length;
  const total = section.stickers.length;
  const done  = have === total;

  const badgeLabel =
    section.id === "COCA" ? "CC"
    : section.id === "FWC" ? "★"
    : section.group ?? section.id.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1f3c]">
      {/* Cabeçalho uniforme — só o badge usa cor do time */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white shadow-sm"
          style={{ background: section.accent }}
        >
          {badgeLabel}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold leading-tight">{section.title}</h2>
          {section.subtitle && (
            <p className="text-[11px] text-white/40">{section.subtitle}</p>
          )}
        </div>
        <span className={`text-sm font-bold ${done ? "text-emerald-400" : "text-white/50"}`}>
          {done ? "✓ Completo" : `${have}/${total}`}
        </span>
      </div>

      {/* Grid de figurinhas */}
      <div className="grid grid-cols-5 gap-1.5 p-3 sm:grid-cols-8 md:grid-cols-10">
        {section.stickers.map((st) => {
          const collected = isCollected(st.code, st.seed);
          const isPending = pendingCode === st.code;
          // Mostra estado futuro enquanto está pendente
          const showCollected = isPending ? (pendingNext ?? collected) : collected;

          const shortLabel =
            section.id === "COCA" || section.id === "FWC"
              ? st.code
              : st.code.replace(`${section.subtitle} `, "").trim();

          return (
            <button
              key={st.code}
              onClick={() => onClickSticker(st)}
              title={st.label}
              className={[
                "relative aspect-[3/4] rounded-lg border text-center text-sm font-bold transition-all active:scale-95",
                showCollected
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-dashed border-white/20 bg-white/[0.04] text-white/35",
                isPending
                  ? "ring-2 ring-white/30 ring-offset-1 ring-offset-[#0d1f3c] brightness-110"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="flex h-full w-full flex-col items-center justify-center gap-0.5 px-0.5 leading-none">
                {showCollected ? (
                  <>
                    <span className="text-base font-black">✓</span>
                    <span className="text-[9px] opacity-60">{shortLabel}</span>
                  </>
                ) : (
                  <span>{shortLabel}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
