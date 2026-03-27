"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DNAProfile } from "@/features/assessment/types";
import GlassPanel from "@/shared/components/GlassPanel";
import MagneticButton from "@/shared/components/MagneticButton";
import ShareModal from "@/features/results/components/ShareModal";
import { deriveArchetype } from "@/lib/archetypes";

// ─── Dimension metadata ───────────────────────────────────────────────────────

const dimensionMeta: Record<
  string,
  { label: string; leftPole: string; rightPole: string; color: string; glow: string; group: string; insight: (v: number) => string }
> = {
  structure:   { label: "Struktur",           leftPole: "Freiheit",      rightPole: "Ordnung",         color: "#9d4edd", glow: "rgba(157,78,221,0.5)",  group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Du liebst klare Strukturen und Routinen – sie geben dir Kraft." : v <= 35 ? "Freiheit ist dein Lebensprinzip – Regeln empfindest du als Einschränkung." : "Du balancierst Struktur und Spontanität elegant." },
  stimulation: { label: "Stimulation",        leftPole: "Ruhe",          rightPole: "Reiz",            color: "#ff2d78", glow: "rgba(255,45,120,0.5)",  group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Du suchst Intensität – Langeweile ist dein Feind." : v <= 35 ? "Stille und Ruhe nähren deine Seele tiefer als jeder Trubel." : "Du weißt, wann du Reiz suchst und wann du Ruhe brauchst." },
  aesthetics:  { label: "Ästhetik",           leftPole: "Organisch",     rightPole: "Geometrisch",     color: "#00e5ff", glow: "rgba(0,229,255,0.5)",   group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Geometrische Präzision und klare Linien sprechen deine Seele an." : v <= 35 ? "Natürliche, organische Formen berühren dich tiefer als Perfektion." : "Dein ästhetisches Gespür vereint das Beste beider Welten." },
  social:      { label: "Soziales",           leftPole: "Einsamkeit",    rightPole: "Verbundenheit",   color: "#ffc300", glow: "rgba(255,195,0,0.5)",   group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Menschliche Verbindung ist deine Energie – du blühst im Miteinander auf." : v <= 35 ? "Zeit allein ist heilig für dich – du tankst in der Stille auf." : "Du liebst Verbindung, brauchst aber auch Raum für dich." },
  expression:  { label: "Ausdruck",           leftPole: "Zurückhaltend", rightPole: "Ausdrucksstark",  color: "#39ff14", glow: "rgba(57,255,20,0.45)",  group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Du lebst laut und farbenfroh – deine Energie ist ansteckend." : v <= 35 ? "Deine Stärke liegt in bewusster Zurückhaltung und Tiefe." : "Du wählst gezielt, wann du dich zeigst und wann du beobachtest." },
  risk:        { label: "Risikobereitschaft", leftPole: "Vorsichtig",    rightPole: "Abenteuerlustig", color: "#ff8c00", glow: "rgba(255,140,0,0.45)",  group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Du springst ins Unbekannte, wo andere zögern – Abenteuer ist dein Element." : v <= 35 ? "Bedachtheit ist deine Stärke – du planst, bevor du handelst." : "Du bist mutig, wenn es darauf ankommt, und klug genug zu warten." },
  tradition:   { label: "Tradition",          leftPole: "Klassisch",     rightPole: "Modern",          color: "#e040fb", glow: "rgba(224,64,251,0.45)", group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Innovation und Modernität sind dein natürlicher Lebensraum." : v <= 35 ? "Klassische Werte und Bewährtes geben dir Halt und Identität." : "Du verbindest das Beste aus Tradition und Moderne." },
  focus:       { label: "Fokus",              leftPole: "Breiter Blick", rightPole: "Präzision",       color: "#00bcd4", glow: "rgba(0,188,212,0.45)",  group: "Persönlichkeit",
    insight: (v) => v >= 65 ? "Deine Stärke ist die Tiefe – du bohrst bis zum Kern jeder Sache." : v <= 35 ? "Du siehst das große Bild, das andere übersehen." : "Du wechselst mühelos zwischen Detail und Überblick." },
  dominance:   { label: "Dynamik",            leftPole: "Submissiv",     rightPole: "Dominant",        color: "#ff2d78", glow: "rgba(255,45,120,0.5)",  group: "Intimität",
    insight: (v) => v >= 65 ? "Im intimen Raum übernimmst du die Führung – Kontrolle erregt dich." : v <= 35 ? "Du gibst die Kontrolle gern ab – Vertrauen und Hingabe sind deine Stärke." : "Je nach Situation wechselst du fließend zwischen Führen und Folgen." },
  openness:    { label: "Erot. Offenheit",    leftPole: "Konventionell", rightPole: "Tabubrechend",    color: "#ffc300", glow: "rgba(255,195,0,0.5)",   group: "Intimität",
    insight: (v) => v >= 65 ? "Du brichst Tabus mit Vergnügen – Konventionen sind nicht für dich gemacht." : v <= 35 ? "Vertraute Wege geben dir Sicherheit und tiefe Verbindung." : "Du bist offen für Neues, solange Vertrauen die Basis bildet." },
  intimacy:    { label: "Intimität",          leftPole: "Körperlich",    rightPole: "Emotional",       color: "#9d4edd", glow: "rgba(157,78,221,0.5)",  group: "Intimität",
    insight: (v) => v >= 65 ? "Seelische Nähe und emotionale Tiefe sind deine stärkste Erotik." : v <= 35 ? "Körperliche Intensität ist der direkteste Weg zu deiner Freude." : "Du verbindest Körper und Seele zu einem vollständigen Erlebnis." },
  rhythm:      { label: "Lebensrhythmus",     leftPole: "Morgenmensch",  rightPole: "Nachtmensch",     color: "#00e5ff", glow: "rgba(0,229,255,0.45)",  group: "Lifestyle",
    insight: (v) => v >= 65 ? "Du lebst auf, wenn andere schlafen – die Nacht gehört dir." : v <= 35 ? "Der Morgen gehört dir – Klarheit und Energie im ersten Licht." : "Du passt deinen Rhythmus flexibel an die Situation an." },
};

// ─── Compass wheel ────────────────────────────────────────────────────────────

const CompassWheel = ({ dna }: { dna: DNAProfile }) => {
  const dims = Object.keys(dimensionMeta);
  const cx = 140, cy = 140, maxR = 95;
  const angle = (i: number) => (i / dims.length) * 2 * Math.PI - Math.PI / 2;
  const pt = (i: number) => {
    const r = ((dna[dims[i]] ?? 50) / 100) * maxR;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as [number, number];
  };
  const points = dims.map((_, i) => pt(i));
  const polyPts = points.map((p) => `${p[0]},${p[1]}`).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 280 280" className="w-full max-w-[320px] mx-auto drop-shadow-2xl">
      <defs>
        <linearGradient id="dnaG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="40%" stopColor="#9d4edd" />
          <stop offset="100%" stopColor="#ff2d78" />
        </linearGradient>
        <filter id="compass-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background rings */}
      {rings.map((r) => (
        <polygon key={r}
          points={dims.map((_, i) => {
            const rad = r * maxR;
            return `${cx + rad * Math.cos(angle(i))},${cy + rad * Math.sin(angle(i))}`;
          }).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Spokes */}
      {dims.map((_, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx + maxR * Math.cos(angle(i))}
          y2={cy + maxR * Math.sin(angle(i))}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* DNA polygon fill (glow layer) */}
      <motion.polygon points={polyPts} fill="url(#dnaG)" fillOpacity="0.06"
        filter="url(#compass-glow)"
        initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }} />

      {/* DNA polygon */}
      <motion.polygon points={polyPts} fill="url(#dnaG)" fillOpacity="0.16"
        stroke="url(#dnaG)" strokeWidth="1.8"
        initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }} />

      {/* Data points */}
      {points.map((p, i) => {
        const d = dims[i];
        return (
          <motion.circle key={d} cx={p[0]} cy={p[1]} r={4}
            fill={dimensionMeta[d].color}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.06, type: "spring", stiffness: 300 }}
            style={{ filter: `drop-shadow(0 0 6px ${dimensionMeta[d].color})` }} />
        );
      })}

      {/* Labels */}
      {dims.map((d, i) => {
        const r = maxR + 20;
        const x = cx + r * Math.cos(angle(i));
        const y = cy + r * Math.sin(angle(i));
        return (
          <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fill={dimensionMeta[d].color} fontSize="5.8" fontWeight="800"
            fontFamily="'Plus Jakarta Sans', sans-serif">
            {dimensionMeta[d].label}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={4} fill="white" opacity="0.15" />
    </svg>
  );
};

// ─── Dimension bar ────────────────────────────────────────────────────────────

const DimBar = ({ dim, value, index }: { dim: string; value: number; index: number }) => {
  const meta = dimensionMeta[dim];
  if (!meta) return null;
  const isRight = value >= 50;
  const pole = isRight ? meta.rightPole : meta.leftPole;
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12 + index * 0.045, type: "spring", stiffness: 220 }}
      className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/35">{meta.label}</span>
        <span className="text-[10px] sm:text-xs font-black" style={{ color: meta.color }}>{pole} · {value}</span>
      </div>
      <div className="relative h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div className="h-full rounded-full" initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.3 + index * 0.04, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${meta.color}44, ${meta.color})`,
            boxShadow: `0 0 8px ${meta.glow}` }} />
      </div>
    </motion.div>
  );
};

// ─── Insight card ─────────────────────────────────────────────────────────────

const InsightCard = ({ dim, value, rank }: { dim: string; value: number; rank: number }) => {
  const meta = dimensionMeta[dim];
  if (!meta) return null;
  const deviation = Math.abs(value - 50);
  const text = meta.insight(value);
  const rankLabels = ["Stärkstes Merkmal", "2. Stärkstes Merkmal", "3. Stärkstes Merkmal"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, type: "spring", stiffness: 200 }}
      className="relative flex flex-col gap-3 p-5 rounded-2xl border overflow-hidden insight-card"
      style={{
        background: `${meta.color}06`,
        borderColor: `${meta.color}20`,
        boxShadow: `0 0 32px ${meta.color}08`,
        ["--insight-color" as string]: meta.color,
      }}>
      {/* Rank badge */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">{rankLabels[rank]}</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${meta.color}14`, color: meta.color, border: `1px solid ${meta.color}25` }}>
          Stärke {deviation.toFixed(0)}%
        </span>
      </div>
      {/* Dimension name + value */}
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black leading-none" style={{ color: meta.color }}>{value}</span>
        <span className="text-sm font-black text-white mb-0.5">{meta.label}</span>
      </div>
      {/* Insight text */}
      <p className="text-xs text-white/55 leading-relaxed italic">{text}</p>
      {/* Mini bar */}
      <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${meta.color}44, ${meta.color})` }} />
      </div>
    </motion.div>
  );
};

// ─── Group section ────────────────────────────────────────────────────────────

const GroupSection = ({ title, dims, dna }: { title: string; dims: string[]; dna: DNAProfile }) => (
  <GlassPanel className="p-5 sm:p-7 flex flex-col gap-4"
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 150 }}>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/22">{title}</p>
    {dims.map((d, i) => <DimBar key={d} dim={d} value={dna[d] ?? 50} index={i} />)}
  </GlassPanel>
);

// ─── Main dashboard ───────────────────────────────────────────────────────────

interface DNADashboardProps {
  dna: DNAProfile;
  onRestart: () => void;
  restartLabel?: string;
}

export default function DNADashboard({ dna, onRestart, restartLabel = "Neu entdecken ↺" }: DNADashboardProps) {
  const archetype = deriveArchetype(dna);
  const [showShare, setShowShare] = useState(false);

  const persGroup  = Object.keys(dimensionMeta).filter((d) => dimensionMeta[d].group === "Persönlichkeit");
  const intimGroup = Object.keys(dimensionMeta).filter((d) => dimensionMeta[d].group === "Intimität");
  const lifeGroup  = Object.keys(dimensionMeta).filter((d) => dimensionMeta[d].group === "Lifestyle");

  // Top 3 by deviation from center
  const top3 = [...Object.keys(dimensionMeta)]
    .sort((a, b) => Math.abs((dna[b] ?? 50) - 50) - Math.abs((dna[a] ?? 50) - 50))
    .slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex flex-col items-center px-4 sm:px-6 py-12 gap-10 pt-24">

      {/* ── Archetype hero ── */}
      <div className="text-center max-w-2xl px-2 flex flex-col gap-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-white/25">
          Deine Präferenz-DNA
        </motion.p>

        {/* Archetype name with glow */}
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 160 }}>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight relative inline-block"
            style={{ textShadow: `0 0 60px ${archetype.color}55, 0 0 120px ${archetype.color}20` }}>
            {archetype.name}
            {/* Underline glow */}
            <motion.div className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: `linear-gradient(90deg, transparent, ${archetype.color}, transparent)` }} />
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="text-base sm:text-lg text-white/50 italic leading-relaxed">
          {archetype.subtitle}
        </motion.p>

        {/* Trait pills */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="flex flex-wrap justify-center gap-2">
          {archetype.traits.map((t) => (
            <span key={t} className="text-xs font-bold px-4 py-1.5 rounded-full border"
              style={{
                borderColor: `${archetype.color}40`, color: archetype.color,
                background: `${archetype.color}12`,
                boxShadow: `0 0 14px ${archetype.color}18`,
              }}>
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Compass + Personality ── */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassPanel glow="violet" className="p-6 sm:p-8 flex flex-col items-center gap-5"
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 150 }}>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/22">Persönlicher Kompass</p>
          <CompassWheel dna={dna} />
        </GlassPanel>
        <GroupSection title="Persönlichkeit" dims={persGroup} dna={dna} />
      </div>

      {/* ── Top 3 Insights ── */}
      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/22">Deine stärksten Züge</p>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3.map((d, i) => (
            <InsightCard key={d} dim={d} value={dna[d] ?? 50} rank={i} />
          ))}
        </div>
      </div>

      {/* ── Intimacy FSK-18 ── */}
      <div className="w-full max-w-5xl">
        <GlassPanel glow="rose" className="p-5 sm:p-7 flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}>
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/22">Intimität & Sexualität</p>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#ff2d78]/15 text-[#ff2d78] border border-[#ff2d78]/28">
              FSK 18
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {intimGroup.map((d, i) => <DimBar key={d} dim={d} value={dna[d] ?? 50} index={i} />)}
          </div>
        </GlassPanel>
      </div>

      {/* ── Score highlight tiles ── */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Object.keys(dimensionMeta)]
          .sort((a, b) => Math.abs((dna[b] ?? 50) - 50) - Math.abs((dna[a] ?? 50) - 50))
          .slice(0, 4)
          .map((d, i) => {
            const meta = dimensionMeta[d];
            const val = dna[d] ?? 50;
            const pole = val >= 50 ? meta.rightPole : meta.leftPole;
            return (
              <motion.div key={d}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 200 }}
                className="relative rounded-2xl border p-5 flex flex-col gap-2 overflow-hidden"
                style={{
                  background: `${meta.color}05`,
                  borderColor: `${meta.color}22`,
                  boxShadow: `0 0 24px ${meta.color}08`,
                  backdropFilter: "blur(12px)",
                }}>
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
                  style={{ background: `radial-gradient(circle, ${meta.color}, transparent)`,
                    filter: "blur(20px)", transform: "translate(30%,-30%)" }} />
                <p className="text-[9px] text-white/28 font-black uppercase tracking-widest">{meta.label}</p>
                <p className="text-4xl font-black leading-none" style={{ color: meta.color,
                  textShadow: `0 0 20px ${meta.color}60` }}>{val}</p>
                <p className="text-[11px] font-bold text-white/45">{pole}</p>
              </motion.div>
            );
          })}
      </div>

      {/* ── Lifestyle ── */}
      <div className="w-full max-w-5xl">
        <GroupSection title="Lifestyle" dims={lifeGroup} dna={dna} />
      </div>

      {/* ── CTA row ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="flex flex-col sm:flex-row items-center gap-4 pb-4">
        <MagneticButton variant="neon" glow="cyan" onClick={onRestart} className="text-base px-8 py-4 font-bold">
          {restartLabel}
        </MagneticButton>
        <MagneticButton variant="neon" glow="rose" onClick={() => setShowShare(true)} className="text-base px-8 py-4 font-bold">
          ✦ Profil anonym teilen
        </MagneticButton>
        <a href="/galerie"
          className="text-sm font-bold text-white/40 hover:text-white/80 transition-colors border border-white/10 hover:border-white/25 px-6 py-3 rounded-full">
          Galerie ansehen →
        </a>
      </motion.div>

      {/* ── Share modal ── */}
      <AnimatePresence>
        {showShare && (
          <ShareModal dna={dna} archetype={archetype} onClose={() => setShowShare(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
