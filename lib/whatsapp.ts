import { type Section } from "./catalog";

// ─── Mapeamentos por seção ──────────────────────────────────────────────────

const EMOJI: Record<string, string> = {
  // FWC sub-blocos
  FWC_INTRO: "⭐",
  FWC_SEDES: "⚽",
  FWC_HIST:  "🏆",
  // Seleções
  MEX: "🇲🇽", RSA: "🇿🇦", KOR: "🇰🇷", CZE: "🇨🇿",
  CAN: "🇨🇦", BIH: "🇧🇦", QAT: "🇶🇦", SUI: "🇨🇭",
  BRA: "🇧🇷", MAR: "🇲🇦", HAI: "🇭🇹", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  USA: "🇺🇸", PAR: "🇵🇾", AUS: "🇦🇺", TUR: "🇹🇷",
  GER: "🇩🇪", CUW: "🌊",  CIV: "🇨🇮", ECU: "🇪🇨",
  NED: "🇳🇱", JPN: "🇯🇵", SWE: "🇸🇪", TUN: "🇹🇳",
  BEL: "🇧🇪", EGY: "🇪🇬", IRN: "🇮🇷", NZL: "🇳🇿",
  ESP: "🇪🇸", CPV: "🇨🇻", KSA: "🇸🇦", URU: "🇺🇾",
  FRA: "🇫🇷", SEN: "🇸🇳", IRQ: "🇮🇶", NOR: "🇳🇴",
  ARG: "🇦🇷", ALG: "🇩🇿", AUT: "🇦🇹", JOR: "🇯🇴",
  POR: "🇵🇹", COD: "🇨🇩", UZB: "🇺🇿", COL: "🇨🇴",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO: "🇭🇷", GHA: "🇬🇭", PAN: "🇵🇦",
  COCA: "🥤",
};

const PAGES: Record<string, string> = {
  FWC_INTRO: "2-3",
  FWC_SEDES: "4-5",
  FWC_HIST:  "106-109",
  // Grupo A
  MEX: "8-9",   RSA: "10-11",  KOR: "12-13",  CZE: "14-15",
  // Grupo B
  CAN: "16-17", BIH: "18-19",  QAT: "20-21",  SUI: "22-23",
  // Grupo C
  BRA: "24-25", MAR: "26-27",  HAI: "28-29",  SCO: "30-31",
  // Grupo D
  USA: "32-33", PAR: "34-35",  AUS: "36-37",  TUR: "38-39",
  // Grupo E
  GER: "40-41", CUW: "42-43",  CIV: "44-45",  ECU: "46-47",
  // Grupo F
  NED: "48-49", JPN: "50-51",  SWE: "52-53",  TUN: "54-55",
  // Grupo G
  BEL: "58-59", EGY: "60-61",  IRN: "62-63",  NZL: "64-65",
  // Grupo H
  ESP: "66-67", CPV: "68-69",  KSA: "70-71",  URU: "72-73",
  // Grupo I
  FRA: "74-75", SEN: "76-77",  IRQ: "78-79",  NOR: "80-81",
  // Grupo J
  ARG: "82-83", ALG: "84-85",  AUT: "86-87",  JOR: "88-89",
  // Grupo K
  POR: "90-91", COD: "92-93",  UZB: "94-95",  COL: "96-97",
  // Grupo L
  ENG: "98-99", CRO: "100-101", GHA: "102-103", PAN: "104-105",
  // Coca-Cola
  COCA: "110",
};

// FWC 00–4 = intro, 5–8 = sedes, 9+ = história
function fwcBucket(code: string): "FWC_INTRO" | "FWC_SEDES" | "FWC_HIST" {
  const n = parseInt(code.replace("FWC ", "").trim(), 10);
  if (n <= 4) return "FWC_INTRO";
  if (n <= 8) return "FWC_SEDES";
  return "FWC_HIST";
}

const FWC_LABELS: Record<string, string> = {
  FWC_INTRO: "Especiais FIFA",
  FWC_SEDES: "Bola & Países-Sede",
  FWC_HIST:  "Copa — Momentos Históricos",
};

// Remove o espaço: "BRA 5" → "BRA5"
function fmt(code: string) {
  return code.replace(" ", "");
}

// ─── Função principal ────────────────────────────────────────────────────────

export function buildShareMessage(
  sections: Section[],
  overrides: Record<string, boolean>
): string {
  function isCollected(code: string, seed: boolean) {
    return code in overrides ? overrides[code] : seed;
  }

  let total = 0;
  const blocks: string[] = [];

  for (const sec of sections) {
    if (sec.id === "FWC") {
      // Agrupa por sub-bloco
      const buckets: Record<string, string[]> = {
        FWC_INTRO: [], FWC_SEDES: [], FWC_HIST: [],
      };
      for (const st of sec.stickers) {
        if (!isCollected(st.code, st.seed)) {
          buckets[fwcBucket(st.code)].push(fmt(st.code));
          total++;
        }
      }
      for (const key of ["FWC_INTRO", "FWC_SEDES", "FWC_HIST"] as const) {
        if (!buckets[key].length) continue;
        blocks.push(
          `${EMOJI[key]} *${FWC_LABELS[key]}* · pg. ${PAGES[key]}\n` +
          buckets[key].join(" · ")
        );
      }
    } else {
      const missing = sec.stickers
        .filter((st) => !isCollected(st.code, st.seed))
        .map((st) => fmt(st.code));
      if (!missing.length) continue;
      total += missing.length;

      const key    = sec.id;
      const emoji  = EMOJI[key]  ?? "🌍";
      // Times: usa o código (MEX, BRA…); seções especiais: rótulo descritivo
      const label  = key === "COCA" ? "Coca-Cola" : (sec.subtitle ?? key);
      const pages  = PAGES[key]  ?? "?";
      blocks.push(
        `${emoji} *${label}* · pg. ${pages}\n` +
        missing.join(" · ")
      );
    }
  }

  if (total === 0) {
    return "🏆 Álbum completo! Todas as figurinhas coletadas! Parabéns! 🎉";
  }

  return [
    "🏆 *COPA 2026 — FIGURINHAS FALTANDO* 🏆",
    "━━━━━━━━━━━━━━━",
    `📦 Total faltando: *${total} figurinhas*`,
    "━━━━━━━━━━━━━━━",
    "",
    ...blocks.flatMap((b) => [b, ""]),
    "━━━━━━━━━━━━━━━",
    "🤝 *Topa trocar? Me chama!*",
  ].join("\n");
}
