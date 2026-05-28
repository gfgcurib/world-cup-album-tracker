import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Álbum da Copa 2026 — Tracker",
  description: "Tracking das figurinhas que faltam pra completar o álbum da Copa do Mundo 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} font-display`}>{children}</body>
    </html>
  );
}
