"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Radial backdrop */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(157,78,221,0.07) 0%, transparent 70%)" }} />

      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className="text-[160px] sm:text-[220px] font-black leading-none select-none"
        style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(157,78,221,0.12) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 60px rgba(157,78,221,0.3))",
          letterSpacing: "-0.05em",
        }}>
        404
      </motion.div>

      {/* Prism icon */}
      <motion.svg
        viewBox="0 0 80 80" className="w-16 h-16 -mt-12 mb-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
        <polygon points="40,8 72,60 8,60" fill="none" stroke="url(#nf-grad)" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="40" y1="8" x2="40" y2="38" stroke="rgba(0,229,255,0.3)" strokeWidth="0.8" />
        <line x1="40" y1="38" x2="8" y2="60" stroke="rgba(255,195,0,0.3)" strokeWidth="0.8" />
        <line x1="40" y1="38" x2="72" y2="60" stroke="rgba(157,78,221,0.3)" strokeWidth="0.8" />
        <circle cx="40" cy="8" r="2.5" fill="#00e5ff" style={{ filter: "drop-shadow(0 0 4px #00e5ff)" }} />
        <circle cx="72" cy="60" r="2.5" fill="#9d4edd" style={{ filter: "drop-shadow(0 0 4px #9d4edd)" }} />
        <circle cx="8"  cy="60" r="2.5" fill="#ffc300" style={{ filter: "drop-shadow(0 0 4px #ffc300)" }} />
        <defs>
          <linearGradient id="nf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#9d4edd" />
          </linearGradient>
        </defs>
      </motion.svg>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
        className="flex flex-col gap-3 items-center max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          Seite nicht gefunden
        </h1>
        <p className="text-sm text-white/40 leading-relaxed">
          Dieses Prisma hat sich in einem anderen Universum aufgelöst.
          Finde deinen Weg zurück.
        </p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="flex items-center gap-3 mt-4">
          <Link href="/"
            className="px-6 py-3 rounded-full text-sm font-bold border transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            style={{ borderColor: "rgba(0,229,255,0.3)", color: "#00e5ff", background: "rgba(0,229,255,0.07)" }}>
            ← Startseite
          </Link>
          <Link href="/galerie"
            className="px-6 py-3 rounded-full text-sm font-bold border border-white/10 text-white/45 hover:text-white hover:border-white/25 transition-all">
            Galerie →
          </Link>
        </motion.div>
      </motion.div>

      {/* Scanline accent */}
      <div className="fixed bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.2), rgba(157,78,221,0.2), transparent)" }} />
    </main>
  );
}
