"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DNAProfile } from "@/features/assessment/types";
import type { Archetype } from "@/lib/archetypes";

// ─── Geschlechts-Optionen ─────────────────────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: "maennlich",    label: "Männlich",     emoji: "♂",  color: "#00e5ff"  },
  { value: "weiblich",     label: "Weiblich",     emoji: "♀",  color: "#ff2d78"  },
  { value: "divers",       label: "Divers",       emoji: "⚥",  color: "#ffc300"  },
  { value: "non_binaer",   label: "Non-Binär",    emoji: "⚧",  color: "#9d4edd"  },
  { value: "genderfluid",  label: "Genderfluid",  emoji: "🌈", color: "#39ff14"  },
  { value: "keine_angabe", label: "Keine Angabe", emoji: "○",  color: "#ffffff55" },
] as const;

type GenderValue = (typeof GENDER_OPTIONS)[number]["value"];

// ─── Phasen ───────────────────────────────────────────────────────────────────
type Phase = "form" | "loading" | "success" | "error";

interface ShareModalProps {
  dna: DNAProfile;
  archetype: Archetype;
  onClose: () => void;
}

export default function ShareModal({ dna, archetype, onClose }: ShareModalProps) {
  const [name, setName]       = useState("");
  const [gender, setGender]   = useState<GenderValue | null>(null);
  const [phase, setPhase]     = useState<Phase>("form");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied]   = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = gender !== null;

  const handleShare = async () => {
    if (!gender) return;
    setPhase("loading");
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || null, gender, dna }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Unbekannter Fehler");
      }
      const { profile } = await res.json();
      setShareUrl(`${window.location.origin}/profil/${profile.id}`);
      setPhase("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Fehler beim Teilen");
      setPhase("error");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(16px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative w-full max-w-md rounded-3xl border bg-[#0d0d14]/95 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6"
        style={{
          borderColor: `${archetype.color}30`,
          boxShadow: `0 0 60px ${archetype.color}18, 0 24px 80px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Schließen-Button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
          ✕
        </button>

        <AnimatePresence mode="wait">
          {/* ── Formular ── */}
          {phase === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-1">Profil teilen</p>
                <h3 className="text-xl font-black text-white">Anonym veröffentlichen</h3>
                <p className="text-sm text-white/40 mt-1 leading-relaxed">
                  Dein Archetyp <span className="font-bold" style={{ color: archetype.color }}>„{archetype.name}"</span> wird in der Galerie sichtbar.
                  Dein Name ist optional.
                </p>
              </div>

              {/* Geschlecht */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/35">
                  Wie identifizierst du dich?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDER_OPTIONS.map((g) => {
                    const isSelected = gender === g.value;
                    return (
                      <motion.button
                        key={g.value}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setGender(g.value)}
                        className="flex flex-col items-center gap-1 py-3 rounded-xl border text-center transition-all duration-200"
                        style={{
                          borderColor: isSelected ? g.color : "rgba(255,255,255,0.08)",
                          background: isSelected ? `${g.color}14` : "rgba(255,255,255,0.02)",
                          boxShadow: isSelected ? `0 0 16px ${g.color}30` : "none",
                        }}
                      >
                        <span className="text-lg leading-none">{g.emoji}</span>
                        <span className="text-[10px] font-bold leading-tight"
                          style={{ color: isSelected ? g.color : "rgba(255,255,255,0.4)" }}>
                          {g.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Optionaler Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/35">
                  Name <span className="normal-case tracking-normal font-normal text-white/20">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonym"
                  maxLength={40}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                onClick={handleShare}
                disabled={!canSubmit}
                className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: canSubmit
                    ? `linear-gradient(135deg, ${archetype.color}35, ${archetype.color}20)`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${archetype.color}${canSubmit ? "45" : "15"}`,
                  color: canSubmit ? archetype.color : "rgba(255,255,255,0.3)",
                  boxShadow: canSubmit ? `0 0 20px ${archetype.color}20` : "none",
                }}
              >
                Jetzt anonym teilen →
              </motion.button>
            </motion.div>
          )}

          {/* ── Laden ── */}
          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                className="w-10 h-10 rounded-full border-2 border-t-transparent"
                style={{ borderColor: `${archetype.color} transparent transparent transparent` }}
              />
              <p className="text-sm text-white/50">Profil wird gespeichert…</p>
            </motion.div>
          )}

          {/* ── Erfolg ── */}
          {phase === "success" && (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-3 text-center py-2">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${archetype.color}18`, border: `1px solid ${archetype.color}35` }}
                >
                  ✨
                </motion.div>
                <h3 className="text-xl font-black text-white">Geteilt!</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  Dein Profil ist jetzt in der Galerie sichtbar. Teile den Link mit wem du möchtest.
                </p>
              </div>

              {/* Link-Box */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5">
                <span className="flex-1 text-[11px] text-white/50 truncate font-mono">{shareUrl}</span>
                <button onClick={copyLink}
                  className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: copied ? `${archetype.color}25` : "rgba(255,255,255,0.06)",
                    color: copied ? archetype.color : "rgba(255,255,255,0.5)",
                    border: `1px solid ${copied ? archetype.color + "35" : "rgba(255,255,255,0.1)"}`,
                  }}>
                  {copied ? "✓ Kopiert" : "Kopieren"}
                </button>
              </div>

              <div className="flex gap-3">
                <a href="/galerie"
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-center transition-all border border-white/10 text-white/60 hover:border-white/20 hover:text-white">
                  Zur Galerie →
                </a>
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: `${archetype.color}18`,
                    border: `1px solid ${archetype.color}35`,
                    color: archetype.color,
                  }}>
                  Schließen
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Fehler ── */}
          {phase === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col gap-4 items-center text-center py-4">
              <span className="text-3xl">⚠️</span>
              <p className="text-white font-bold">Teilen fehlgeschlagen</p>
              <p className="text-sm text-white/40">{errorMsg}</p>
              <button onClick={() => setPhase("form")}
                className="px-6 py-2.5 rounded-xl border border-white/15 text-sm text-white/60 hover:text-white transition-colors">
                Erneut versuchen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
