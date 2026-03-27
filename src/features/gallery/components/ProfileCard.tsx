"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SharedProfileRow } from "@/lib/supabase";
import { GENDER_OPTIONS } from "@/features/results/components/ShareModal";
import MiniCompass from "./MiniCompass";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m    = Math.floor(diff / 60000);
  if (m < 1)  return "gerade eben";
  if (m < 60) return `vor ${m} Min.`;
  const h    = Math.floor(m / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d    = Math.floor(h / 24);
  if (d < 7)  return `vor ${d} Tag${d > 1 ? "en" : ""}`;
  const w    = Math.floor(d / 7);
  return `vor ${w} Woche${w > 1 ? "n" : ""}`;
}

interface ProfileCardProps {
  profile: SharedProfileRow;
  index?: number;
}

export default function ProfileCard({ profile, index = 0 }: ProfileCardProps) {
  const color      = profile.archetype_color ?? "#00e5ff";
  const genderMeta = GENDER_OPTIONS.find((g) => g.value === profile.gender) ?? GENDER_OPTIONS[5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 26 }}
    >
      <Link href={`/profil/${profile.id}`} className="block group">
        <motion.div
          whileHover={{ y: -5, scale: 1.012 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="relative flex flex-col gap-4 p-5 rounded-2xl border cursor-pointer overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderColor: `${color}1e`,
            boxShadow: `0 4px 32px rgba(0,0,0,0.45)`,
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Radial bg glow */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none rounded-2xl transition-opacity duration-500 group-hover:opacity-[0.13]"
            style={{ background: `radial-gradient(circle at 25% 35%, ${color}, transparent 65%)` }} />

          {/* Top shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />

          {/* Header: compass + identity */}
          <div className="flex items-start gap-3 relative">
            <div className="shrink-0 rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${color}18`,
                padding: 6,
                boxShadow: `0 0 16px ${color}10`,
              }}>
              <MiniCompass dna={profile.dna} size={68} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-0.5">
              <p className="text-sm font-black text-white truncate leading-tight">
                {profile.name ?? <span className="text-white/35 font-semibold italic">Anonym</span>}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full self-start border"
                style={{
                  background: `${genderMeta.color}14`,
                  color: genderMeta.color,
                  borderColor: `${genderMeta.color}25`,
                }}>
                <span>{genderMeta.emoji}</span>
                <span>{genderMeta.label}</span>
              </span>
            </div>
          </div>

          {/* Archetype */}
          <div className="relative flex flex-col gap-1.5">
            <p className="text-base font-black leading-tight transition-colors"
              style={{ color }}>
              {profile.archetype_name}
            </p>
            <div className="flex flex-wrap gap-1">
              {(profile.archetype_traits ?? []).map((t) => (
                <span key={t}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${color}12`,
                    color: `${color}cc`,
                    border: `1px solid ${color}1e`,
                  }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between relative">
            <p className="text-[10px] text-white/18 font-medium">{timeAgo(profile.created_at)}</p>
            <span className="text-[9px] font-bold text-white/25 group-hover:text-white/50 transition-colors">
              Profil ansehen →
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${color}06, transparent 60%)` }} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
