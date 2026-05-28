// Catálogo de figurinhas do álbum Panini FIFA World Cup 2026.
// Seed = estado inicial das fotos + correções manuais do dono.
// Em runtime a fonte da verdade é o Supabase (sticker_overrides): override ?? seed.

export type Sticker = {
  code: string;
  label: string;
  seed: boolean;
};

export type Section = {
  id: string;
  title: string;
  subtitle?: string;
  group?: string;
  accent: string;
  stickers: Sticker[];
};

type TeamDef = {
  code: string;
  name: string;
  group: string;
  accent: string;
  have: number[];
};

const TEAMS: TeamDef[] = [
  // Grupo A
  { code: "MEX", name: "México",            group: "A", accent: "#0E7C4A", have: [1,3,5,8,9,12,14,15,16,19,20] },
  { code: "RSA", name: "África do Sul",     group: "A", accent: "#127A3E", have: [1,2,3,5,6,7,9,11,13,14,16,18,19] },
  { code: "KOR", name: "Coreia do Sul",     group: "A", accent: "#C8102E", have: [2,3,5,6,7,8,9,10,11,12,16,19,20] },
  { code: "CZE", name: "República Tcheca",  group: "A", accent: "#11457E", have: [6,7,8,9,10,11,12,13,14,15,16,20] },
  // Grupo B
  { code: "CAN", name: "Canadá",            group: "B", accent: "#D52B1E", have: [5,8,9,14,15,16,20] },
  { code: "BIH", name: "Bósnia e Herz.",    group: "B", accent: "#0A3B8C", have: [1,5,7,8,11,12,16,17,18] },
  { code: "QAT", name: "Catar",             group: "B", accent: "#8A1538", have: [1,2,5,8,11,12,16,17] },
  { code: "SUI", name: "Suíça",             group: "B", accent: "#D52B1E", have: [3,7,8,9,10,11,12,14,15,16,17] },
  // Grupo C
  // BRA override: Bento(3), Militão(5), João Pedro(16), Estêvão(20) = coletadas (fora do álbum); Rodrygo(15) = faltando
  { code: "BRA", name: "Brasil",            group: "C", accent: "#FFCB05", have: [3,5,6,10,16,18,20] },
  { code: "MAR", name: "Marrocos",          group: "C", accent: "#C1272D", have: [1,8,9,15,16,19,20] },
  { code: "HAI", name: "Haiti",             group: "C", accent: "#00209F", have: [4,5,8,9,12,13,14,17,19] },
  { code: "SCO", name: "Escócia",           group: "C", accent: "#0065BF", have: [1,5,6,9,10,13,14,15,20] },
  // Grupo D
  { code: "USA", name: "Estados Unidos",    group: "D", accent: "#1A3A6B", have: [7,14,15,16,17] },
  { code: "PAR", name: "Paraguai",          group: "D", accent: "#D52B1E", have: [3,5,6,13,15,18,19] },
  { code: "AUS", name: "Austrália",         group: "D", accent: "#0B7A3B", have: [1,2,3,7,8,9,10,11,12,13,14,16,18,20] },
  { code: "TUR", name: "Turquia",           group: "D", accent: "#E30A17", have: [7,10,11,13,15,16,18,19] },
  // Grupo E
  { code: "GER", name: "Alemanha",          group: "E", accent: "#555555", have: [2,5,6,9,10,11,12,13,14,15,19,20] },
  { code: "CUW", name: "Curaçao",           group: "E", accent: "#00247D", have: [1,2,3,4,5,6,7,8,9,10,13,14,15,17,18] },
  { code: "CIV", name: "Costa do Marfim",   group: "E", accent: "#F77F00", have: [1,2,4,6,9,14,15,18,20] },
  { code: "ECU", name: "Equador",           group: "E", accent: "#B8A000", have: [1,2,3,4,6,9,10,11,13,15,19,20] },
  // Grupo F
  { code: "NED", name: "Países Baixos",     group: "F", accent: "#F36C21", have: [1,4,5,8,9,12,13,14,17,18,20] },
  { code: "JPN", name: "Japão",             group: "F", accent: "#BC002D", have: [1,2,3,4,5,9,14,17,18] },
  { code: "SWE", name: "Suécia",            group: "F", accent: "#1A4F9C", have: [4,5,7,11,14] },
  { code: "TUN", name: "Tunísia",           group: "F", accent: "#E70013", have: [1,2,5,6,8,10,11,14,15,16,18,19] },
  // Grupo G
  { code: "BEL", name: "Bélgica",           group: "G", accent: "#C8102E", have: [3,5,9,11,12,14,15,16,18,20] },
  { code: "EGY", name: "Egito",             group: "G", accent: "#B22222", have: [2,4,6,10,11,12,14,15,17,18,19] },
  { code: "IRN", name: "Irã",               group: "G", accent: "#239F40", have: [1,2,4,5,7,9,11,14,15,18,19,20] },
  { code: "NZL", name: "Nova Zelândia",     group: "G", accent: "#4A4A4A", have: [1,2,4,5,7,8,9,11,12,14,18,19] },
  // Grupo H
  { code: "ESP", name: "Espanha",           group: "H", accent: "#C60B1E", have: [1,3,4,5,8,9,14,16,17,18,20] },
  { code: "CPV", name: "Cabo Verde",        group: "H", accent: "#003893", have: [8,13,15,19] },
  { code: "KSA", name: "Arábia Saudita",    group: "H", accent: "#0B6623", have: [2,3,6,7,9,10,11,12,13,14,16,17,18,19,20] },
  { code: "URU", name: "Uruguai",           group: "H", accent: "#3A7DC9", have: [3,4,5,7,10,11,12,13,14,17,18] },
  // Grupo I
  { code: "FRA", name: "França",            group: "I", accent: "#0055A4", have: [1,2,7,9,10,11,12,13,16,17,18,20] },
  { code: "SEN", name: "Senegal",           group: "I", accent: "#00853F", have: [1,2,3,5,7,9,11,13,14,16,17,18] },
  { code: "IRQ", name: "Iraque",            group: "I", accent: "#007A3D", have: [5,13,16,19,20] },
  { code: "NOR", name: "Noruega",           group: "I", accent: "#BA0C2F", have: [1,5,6,9,11,13,14,15,18,20] },
  // Grupo J
  { code: "ARG", name: "Argentina",         group: "J", accent: "#6CACE4", have: [5,9,10,11,12,13,18] },
  { code: "ALG", name: "Argélia",           group: "J", accent: "#006233", have: [1,3,4,5,7,8,10,11,13,15,16,17] },
  { code: "AUT", name: "Áustria",           group: "J", accent: "#ED2939", have: [2,3,5,7,11,16,20] },
  { code: "JOR", name: "Jordânia",          group: "J", accent: "#007A3D", have: [4,5,7,8,9,11,14,17] },
  // Grupo K
  { code: "POR", name: "Portugal",          group: "K", accent: "#006600", have: [1,3,6,7,11,16,20] },
  { code: "COD", name: "Congo (RD)",         group: "K", accent: "#007FFF", have: [1,2,6,7,14,18] },
  { code: "UZB", name: "Uzbequistão",       group: "K", accent: "#1EB53A", have: [1,2,5,9,11,14,17,18] },
  { code: "COL", name: "Colômbia",          group: "K", accent: "#B89A00", have: [1,3,4,5,7,9,11,14,17,19] },
  // Grupo L
  { code: "ENG", name: "Inglaterra",        group: "L", accent: "#1A3A6B", have: [1,3,8,11,14,15,19,20] },
  { code: "CRO", name: "Croácia",           group: "L", accent: "#C8102E", have: [2,3,5,7,9,10,11,16,17,18,19] },
  { code: "GHA", name: "Gana",              group: "L", accent: "#006B3F", have: [1,3,4,5,6,7,8,9,10,12,14,15,18,19,20] },
  { code: "PAN", name: "Panamá",            group: "L", accent: "#DA121A", have: [3,7,9,13,14,18,19,20] },
];

function teamSection(t: TeamDef): Section {
  const haveSet = new Set(t.have);
  return {
    id: t.code,
    title: t.name,
    subtitle: t.code,
    group: t.group,
    accent: t.accent,
    stickers: Array.from({ length: 20 }, (_, i) => ({
      code: `${t.code} ${i + 1}`,
      label: `${t.code} ${i + 1}`,
      seed: haveSet.has(i + 1),
    })),
  };
}

// FWC specials — seed: true = tem a figurinha colada.
const FWC_STICKERS: Sticker[] = [
  { code: "FWC 00", label: "FWC 00 — We Are Panini", seed: false },
  { code: "FWC 1",  label: "FWC 1 — Abertura",       seed: false },
  { code: "FWC 2",  label: "FWC 2 — Abertura",       seed: false },
  { code: "FWC 3",  label: "FWC 3 — Abertura",       seed: true  },
  { code: "FWC 4",  label: "FWC 4 — Mascotes",       seed: false },
  { code: "FWC 5",  label: "FWC 5 — Bola Oficial",   seed: false },
  { code: "FWC 6",  label: "FWC 6 — Sede (Canadá)",  seed: false },
  { code: "FWC 7",  label: "FWC 7 — Sede (México)",  seed: false },
  { code: "FWC 8",  label: "FWC 8 — Sede (EUA)",     seed: false },
  { code: "FWC 10", label: "FWC 10 — Brasil 1950",   seed: false },
  { code: "FWC 11", label: "FWC 11 — Suíça 1954",    seed: false },
  { code: "FWC 13", label: "FWC 13 — Alemanha 1974", seed: false },
  { code: "FWC 14", label: "FWC 14 — México 1986",   seed: false },
  { code: "FWC 17", label: "FWC 17 — Alemanha 2006", seed: false },
  { code: "FWC 18", label: "FWC 18 — Brasil 2014",   seed: false },
  { code: "FWC 19", label: "FWC 19 — Catar 2022",    seed: false },
];

const COCA_STICKERS: Sticker[] = [
  { code: "CC1",  label: "CC1 — Lamine Yamal",      seed: false },
  { code: "CC2",  label: "CC2 — Joshua Kimmich",    seed: false },
  { code: "CC3",  label: "CC3 — Harry Kane",        seed: false },
  { code: "CC4",  label: "CC4 — Santiago Giménez",  seed: false },
  { code: "CC5",  label: "CC5 — Joško Gvardiol",    seed: false },
  { code: "CC6",  label: "CC6 — Federico Valverde", seed: false },
  { code: "CC7",  label: "CC7 — Jefferson Lerma",   seed: false },
  { code: "CC8",  label: "CC8 — Enner Valencia",    seed: false },
  { code: "CC9",  label: "CC9 — Gabriel Magalhães", seed: false },
  { code: "CC10", label: "CC10 — Virgil van Dijk",  seed: false },
  { code: "CC11", label: "CC11 — Alphonso Davies",  seed: false },
  { code: "CC12", label: "CC12 — Emiliano Martínez",seed: false },
  { code: "CC13", label: "CC13 — Raúl Jiménez",     seed: false },
  { code: "CC14", label: "CC14 — Lautaro Martínez", seed: false },
];

// FWC vem primeiro (ordem do álbum), depois seleções, depois Coca-Cola.
export const SECTIONS: Section[] = [
  {
    id: "FWC",
    title: "Especiais FIFA",
    subtitle: "FWC",
    accent: "#7A4DD6",
    stickers: FWC_STICKERS,
  },
  ...TEAMS.map(teamSection),
  {
    id: "COCA",
    title: "Coca-Cola",
    subtitle: "Edição especial",
    accent: "#E61A27",
    stickers: COCA_STICKERS,
  },
];

export const ALL_STICKERS: Sticker[] = SECTIONS.flatMap((s) => s.stickers);
export const TOTAL = ALL_STICKERS.length;

export function seedCollectedCount(): number {
  return ALL_STICKERS.filter((s) => s.seed).length;
}
