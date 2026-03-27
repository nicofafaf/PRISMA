"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SharedProfileRow } from "@/lib/supabase";
import { GENDER_OPTIONS } from "@/features/results/components/ShareModal";
import DNADashboard from "@/features/results/DNADashboard";

interface Props { profile: SharedProfileRow }

export default function ProfileDetailClient({ profile }: Props) {
  const genderMeta = GENDER_OPTIONS.find((g) => g.value === profile.gender) ?? GENDER_OPTIONS[5];
  const color      = profile.archetype_color ?? "#00e5ff";

  return (
    <main className="relative min-h-screen">
      {/* Archetype color accent */}
      <div className="fixed inset-x-0 top-0 h-80 pointer-events-none -z-10"
        style={{ background: `radial-gradient(ellipse 70% 100% at 50% -20%, ${color}12, transparent 65%)` }} />

      {/* Top bar */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220 }}
        className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-20 pb-2 max-w-5xl mx-auto gap-4 flex-wrap">

        <Link href="/galerie"
          className="flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-white transition-colors border border-white/09 hover:border-white/22 px-4 py-2 rounded-full">
          ← Galerie
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Name */}
          {profile.name ? (
            <span className="text-sm font-black text-white">{profile.name}</span>
          ) : (
            <span className="text-xs text-white/35 italic font-semibold">Anonym</span>
          )}
          {/* Gender pill */}
          <span className="flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full"
            style={{
              background: `${genderMeta.color}14`,
              color: genderMeta.color,
              border: `1px solid ${genderMeta.color}25`,
            }}>
            <span>{genderMeta.emoji}</span>
            <span>{genderMeta.label}</span>
          </span>
          {/* Archetype chip */}
          <span className="hidden sm:flex items-center text-[10px] font-black px-3 py-1 rounded-full"
            style={{ background: `${color}14`, color, border: `1px solid ${color}28` }}>
            {profile.archetype_name}
          </span>
        </div>
      </motion.div>

      {/* Share hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pb-0">
        <div className="flex items-center gap-2 text-[10px] text-white/25 font-medium">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
          Öffentlich geteilt · Schreibgeschützt
        </div>
      </motion.div>

      {/* DNA Dashboard in read-only mode */}
      <div className="relative z-10">
        <DNADashboard
          dna={profile.dna}
          onRestart={() => { window.location.href = "/assess"; }}
          restartLabel="Eigenes Profil erstellen →"
        />
      </div>
    </main>
  );
}
