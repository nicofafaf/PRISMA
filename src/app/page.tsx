"use client";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import MagneticButton from "@/shared/components/MagneticButton";

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = duration / to;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= to) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Prism Sculpture (kept, improved) ─────────────────────────────────────────
const PrismSculpture = () => (
  <div className="relative w-56 h-56 sm:w-80 sm:h-80 flex items-center justify-center">
    {/* Pulse rings */}
    {[1.6, 1.3, 1].map((scale, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${100 * scale}%`,
          height: `${100 * scale}%`,
          border: `1px solid ${i === 0 ? "rgba(0,229,255,0.06)" : i === 1 ? "rgba(157,78,221,0.09)" : "rgba(255,195,0,0.08)"}`,
        }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
        transition={{
          rotate: { duration: 25 + i * 10, ease: "linear", repeat: Infinity },
          scale: { duration: 4 + i * 1.5, ease: "easeInOut", repeat: Infinity },
        }}
      />
    ))}

    {/* SVG prism */}
    <motion.svg
      viewBox="0 0 200 200"
      className="absolute w-44 h-44 sm:w-60 sm:h-60"
      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#9d4edd" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="pg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9d4edd" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffc300" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="pg3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffc300" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.55" />
        </linearGradient>
        <filter id="glow-prism">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="inner-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Faces */}
      <polygon points="100,18 172,152 28,152" fill="url(#pg1)" fillOpacity="0.18"
        stroke="url(#pg1)" strokeWidth="1.5" filter="url(#glow-prism)" />
      <polygon points="100,18 172,152 100,98" fill="url(#pg2)" fillOpacity="0.32"
        stroke="url(#pg2)" strokeWidth="1" filter="url(#inner-glow)" />
      <polygon points="100,18 28,152 100,98" fill="url(#pg3)" fillOpacity="0.28"
        stroke="url(#pg3)" strokeWidth="1" filter="url(#inner-glow)" />
      <polygon points="28,152 172,152 100,98" fill="rgba(0,229,255,0.06)"
        stroke="rgba(0,229,255,0.18)" strokeWidth="1" />

      {/* Inner lines */}
      <line x1="100" y1="18" x2="100" y2="98" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
      <line x1="100" y1="98" x2="28" y2="152" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="100" y1="98" x2="172" y2="152" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

      {/* Tendrils */}
      {[
        { x1: 100, y1: 18,  dx: -35, dy: -25, color: "#00e5ff" },
        { x1: 172, y1: 152, dx: 28,  dy: 15,  color: "#9d4edd" },
        { x1: 28,  y1: 152, dx: -28, dy: 18,  color: "#ffc300" },
        { x1: 100, y1: 18,  dx: 32,  dy: -18, color: "#ff2d78" },
      ].map((t, i) => (
        <motion.line key={i} x1={t.x1} y1={t.y1} x2={t.x1 + t.dx} y2={t.y1 + t.dy}
          stroke={t.color} strokeWidth="0.9" strokeOpacity="0.6" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0.5] }}
          transition={{ delay: 1.2 + i * 0.15, duration: 1 }} />
      ))}

      {/* Corner nodes */}
      {([[100, 18, "#00e5ff"], [172, 152, "#9d4edd"], [28, 152, "#ffc300"]] as [number, number, string][]).map(
        ([cx, cy, col], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={4}
            fill={col} style={{ filter: `drop-shadow(0 0 8px ${col})` }}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: [0, 1.3, 1] }}
            transition={{ delay: 0.9 + i * 0.18, type: "spring", stiffness: 400 }} />
        )
      )}

      {/* Center orb */}
      <motion.circle cx="100" cy="98" r="5" fill="#fff"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))" }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }} />
    </motion.svg>

    {/* Core pulse */}
    <motion.div className="absolute rounded-full"
      style={{ width: 16, height: 16,
        background: "radial-gradient(circle, rgba(0,229,255,1) 0%, transparent 70%)",
        boxShadow: "0 0 24px rgba(0,229,255,0.9), 0 0 60px rgba(0,229,255,0.4)" }}
      animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }} />
  </div>
);

// ─── Stat item ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: 22, suffix: "+", label: "Fragen",     color: "#00e5ff" },
  { value: 12, suffix: "",  label: "Dimensionen", color: "#9d4edd" },
  { value: 18, suffix: "+", label: "Archetypen",  color: "#ffc300" },
  { value: 6,  suffix: "",  label: "Kategorien",  color: "#ff2d78" },
];

// ─── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "⚡",
    title: "Visuelle A/B-Tests",
    desc: "Wähle zwischen zwei kontrastierenden Welten. Deine Instinkte verraten mehr als du denkst.",
    color: "#00e5ff",
  },
  {
    icon: "🎚️",
    title: "Adaptive Regler",
    desc: "Millimetergenaue Einstellungen auf 12 Skalen enthüllen deine wahren Nuancen.",
    color: "#9d4edd",
  },
  {
    icon: "🔥",
    title: "FSK-18 Intimität",
    desc: "Erforsche deine Sexualität, Beziehungsmuster und intimen Wünsche — vollkommen anonym.",
    color: "#ff2d78",
  },
  {
    icon: "✦",
    title: "Präferenz-DNA",
    desc: "Dein einzigartiges Ergebnisprofil: ein Kompass-Rad mit 12 Persönlichkeitsdimensionen.",
    color: "#ffc300",
  },
  {
    icon: "👥",
    title: "Anonym Teilen",
    desc: "Teile dein Profil in der Galerie und vergleiche dich mit anderen — kein Konto nötig.",
    color: "#39ff14",
  },
  {
    icon: "🧬",
    title: "18 Archetypen",
    desc: "Wer bist du wirklich? Der Visionär, der Rebel oder doch der stille Beobachter?",
    color: "#e040fb",
  },
];

// ─── Landing page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const featuresRef = useRef<HTMLDivElement>(null);
  const featsInView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <main className="relative flex flex-col items-center overflow-hidden pt-20">

      {/* ── Hero section ── */}
      <section className="relative w-full flex flex-col items-center justify-center min-h-screen px-6 gap-10 text-center">

        {/* Radial depth vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 20%, #050508 90%)" }} />

        {/* Prism */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <PrismSculpture />
        </motion.div>

        {/* Text block */}
        <div className="relative flex flex-col gap-4 max-w-2xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.45em] text-white/30">
            Selbstentdeckungs-Erlebnis · FSK 18
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 160 }}
            className="text-6xl sm:text-8xl font-black tracking-tight leading-none"
            style={{
              background: "linear-gradient(145deg, #ffffff 0%, #c0e8ff 25%, #00e5ff 55%, #9d4edd 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(0,229,255,0.3))",
            }}>
            PRISMA
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78 }}
            className="text-base sm:text-xl text-white/50 max-w-lg mx-auto leading-relaxed">
            22 Fragen. 12 Dimensionen. Eine kristallklare Wahrheit — über dich.
          </motion.p>
        </div>

        {/* Pills */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.92 }}
          className="flex flex-wrap justify-center gap-2 max-w-lg">
          {[
            { label: "Visuelle Tests",          color: "#00e5ff" },
            { label: "Beziehungen & Intimität", color: "#9d4edd" },
            { label: "Sexualität · FSK 18",     color: "#ff2d78" },
            { label: "Adaptive Regler",          color: "#ffc300" },
            { label: "Präferenz-DNA",            color: "#39ff14" },
          ].map((pill) => (
            <span key={pill.label}
              className="text-[11px] font-semibold px-3 py-1 rounded-full border"
              style={{ borderColor: `${pill.color}28`, color: pill.color, background: `${pill.color}0e` }}>
              {pill.label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-3">
          <MagneticButton variant="neon" glow="cyan"
            className="text-base sm:text-lg px-12 py-4 font-black tracking-wide"
            onClick={() => router.push("/assess")}>
            Reise beginnen →
          </MagneticButton>
          <div className="flex items-center gap-3 text-[11px] text-white/22">
            <span>~3 Minuten</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Kein Konto</span>
            <span className="w-px h-3 bg-white/15" />
            <span>100% anonym</span>
          </div>
          <motion.a href="/galerie"
            whileHover={{ scale: 1.04 }}
            className="text-xs font-semibold text-white/30 hover:text-white/60 transition-colors underline underline-offset-4 decoration-white/12 mt-1">
            Andere Profile ansehen →
          </motion.a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-8 flex flex-col items-center gap-2">
          <motion.div className="w-px h-10 bg-gradient-to-b from-white/0 via-white/25 to-white/0"
            animate={{ scaleY: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <section className="relative w-full max-w-4xl px-4 sm:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 150 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center gap-1 py-5 px-4 rounded-2xl border text-center"
              style={{
                background: `${s.color}07`,
                borderColor: `${s.color}18`,
                boxShadow: `0 0 24px ${s.color}08`,
              }}>
              <span className="text-3xl sm:text-4xl font-black leading-none" style={{ color: s.color }}>
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features grid ── */}
      <section ref={featuresRef} className="relative w-full max-w-5xl px-4 sm:px-6 pb-24 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25">
            Was dich erwartet
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 180 }}
            className="text-2xl sm:text-4xl font-black text-white leading-tight">
            Ein Erlebnis auf einem{" "}
            <span className="animated-gradient-text">anderen Niveau</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 24 }}
              animate={featsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 190, damping: 24 }}
              className="group flex flex-col gap-4 p-6 rounded-2xl border cursor-default insight-card glass-lift"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: `${f.color}18`,
                backdropFilter: "blur(16px)",
                ["--insight-color" as string]: f.color,
              }}>
              {/* Icon orb */}
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: `${f.color}14`, border: `1px solid ${f.color}25`,
                  boxShadow: `0 0 20px ${f.color}12` }}>
                {f.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-black text-white leading-tight">{f.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
              </div>
              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 50%, ${f.color}08, transparent 70%)` }} />
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4 pt-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <MagneticButton variant="neon" glow="violet"
            className="text-sm px-10 py-4 font-bold"
            onClick={() => router.push("/assess")}>
            ✦ Jetzt entdecken
          </MagneticButton>
        </motion.div>
      </section>

      {/* Bottom glow line */}
      <div className="fixed bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.2), rgba(157,78,221,0.2), transparent)" }} />
    </main>
  );
}
