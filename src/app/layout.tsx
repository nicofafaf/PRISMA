import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AgeGate from "@/shared/components/AgeGate";
import FloatingNav from "@/shared/components/FloatingNav";
import AuroraBackground from "@/shared/components/AuroraBackground";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRISMA — Entdecke deine Präferenz-DNA",
  description:
    "Ein interaktives Selbstentdeckungs-Erlebnis auf höchstem Niveau. Enthülle deine verborgenen Wünsche und Vorlieben durch immersive, spielerische Bildtests. 22 Fragen. 12 Dimensionen. Eine kristallklare Wahrheit.",
  openGraph: {
    title: "PRISMA — Entdecke deine Präferenz-DNA",
    description: "Selbstentdeckungs-Erlebnis der Superlative. Finde heraus, wer du wirklich bist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${plusJakarta.variable} h-full`}>
      <body className="min-h-full bg-[#050508] text-[#f0f0ff] antialiased bg-noise">
        <AuroraBackground />
        <FloatingNav />
        <AgeGate>{children}</AgeGate>
      </body>
    </html>
  );
}
