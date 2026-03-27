"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { SharedProfileRow } from "@/lib/supabase";
import ProfileCard from "@/features/gallery/components/ProfileCard";
import { GENDER_OPTIONS } from "@/features/results/components/ShareModal";

const ALL_FILTER = { value: "alle", label: "Alle", emoji: "✦", color: "#a0a0c0" };
const FILTERS    = [ALL_FILTER, ...GENDER_OPTIONS];

type SystemStatus = "loading" | "inactive" | "migration" | "error" | "ready";

// Shimmer skeleton card
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay }}
      className="shimmer h-[220px] rounded-2xl border border-white/[0.05]"
    />
  );
}

export default function GaleriePage() {
  const [profiles,     setProfiles]     = useState<SharedProfileRow[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(0);
  const [gender,       setGender]       = useState("alle");
  const [loading,      setLoading]      = useState(false);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [systemStatus,  setSystemStatus]  = useState<SystemStatus>("loading");
  const [systemMessage, setSystemMessage] = useState("");

  const load = useCallback(async (reset: boolean, g: string, p: number) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const res  = await fetch(`/api/profiles?gender=${g}&page=${p}`);
      const json = await res.json();

      if (!res.ok) {
        setProfiles((prev) => (reset ? [] : prev));
        if (reset) setTotal(0);
        setSystemStatus("error");
        setSystemMessage(typeof json.error === "string" ? json.error : "Daten konnten nicht geladen werden.");
        return;
      }

      if (!json.configured) {
        setSystemStatus("inactive");
        setSystemMessage(
          "Supabase nicht konfiguriert. Setze SUPABASE_URL und SUPABASE_ANON_KEY (lokal in .env.local, auf Netlify unter Environment variables)."
        );
        if (reset) {
          setProfiles([]);
          setTotal(0);
        }
        return;
      }

      if (json.dbReady === false) {
        setSystemStatus(json.dbHint === "migration" ? "migration" : "error");
        setSystemMessage(typeof json.error === "string" ? json.error : "Datenbankfehler.");
        if (reset) {
          setProfiles([]);
          setTotal(0);
        }
        return;
      }

      setProfiles((prev) => reset ? json.profiles : [...prev, ...json.profiles]);
      setTotal(json.total ?? 0);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/health");
        const j = await res.json();
        if (cancelled) return;
        if (!j.configured) {
          setSystemStatus("inactive");
          setSystemMessage(j.message ?? "");
          return;
        }
        if (j.database === "migration_pending") {
          setSystemStatus("migration");
          setSystemMessage(j.message ?? "");
          return;
        }
        if (!j.ok) {
          setSystemStatus("error");
          setSystemMessage(j.message ?? "");
          return;
        }
        setSystemStatus("ready");
        setSystemMessage("");
      } catch {
        if (!cancelled) {
          setSystemStatus("error");
          setSystemMessage("Health-Check fehlgeschlagen (Netzwerk).");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (systemStatus !== "ready") return;
    load(true, gender, 0);
  }, [gender, systemStatus, load]);

  const handleGender = (g: string) => { setGender(g); setPage(0); };
  const handleMore   = () => { const next = page + 1; setPage(next); load(false, gender, next); };

  const recheckHealth = () => {
    setSystemStatus("loading");
    setSystemMessage("");
    void (async () => {
      try {
        const res = await fetch("/api/health");
        const j = await res.json();
        if (!j.configured) {
          setSystemStatus("inactive");
          setSystemMessage(j.message ?? "");
          return;
        }
        if (j.database === "migration_pending") {
          setSystemStatus("migration");
          setSystemMessage(j.message ?? "");
          return;
        }
        if (!j.ok) {
          setSystemStatus("error");
          setSystemMessage(j.message ?? "");
          return;
        }
        setSystemStatus("ready");
        setSystemMessage("");
        load(true, gender, 0);
      } catch {
        setSystemStatus("error");
        setSystemMessage("Health-Check fehlgeschlagen (Netzwerk).");
      }
    })();
  };

  return (
    <main className="relative min-h-screen">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 100% at 50% -10%, rgba(157,78,221,0.1) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 pt-24 flex flex-col gap-8">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/22">Entdecken</p>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-none">
              Profil-{" "}
              <span style={{
                background: "linear-gradient(135deg, #9d4edd, #00e5ff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>Galerie</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <p className="text-sm text-white/35">
                {systemStatus === "loading" && "Prüfe Datenbank…"}
                {systemStatus === "ready" &&
                  `${total} ${total === 1 ? "Profil" : "Profile"} geteilt`}
                {systemStatus === "inactive" && "Datenbank nicht konfiguriert"}
                {systemStatus === "migration" && "Datenbank verbunden – Schema fehlt"}
                {systemStatus === "error" && "Datenbankproblem"}
              </p>
              {systemStatus !== "loading" && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit"
                  style={{
                    borderColor:
                      systemStatus === "ready"
                        ? "rgba(57,255,20,0.35)"
                        : systemStatus === "inactive" || systemStatus === "migration"
                          ? "rgba(255,195,0,0.35)"
                          : "rgba(255,45,120,0.35)",
                    color:
                      systemStatus === "ready"
                        ? "#39ff14"
                        : systemStatus === "inactive" || systemStatus === "migration"
                          ? "#ffc300"
                          : "#ff2d78",
                    background:
                      systemStatus === "ready"
                        ? "rgba(57,255,20,0.08)"
                        : systemStatus === "inactive" || systemStatus === "migration"
                          ? "rgba(255,195,0,0.08)"
                          : "rgba(255,45,120,0.08)",
                  }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background:
                        systemStatus === "ready"
                          ? "#39ff14"
                          : systemStatus === "inactive" || systemStatus === "migration"
                            ? "#ffc300"
                            : "#ff2d78",
                      boxShadow:
                        systemStatus === "ready"
                          ? "0 0 8px #39ff14"
                          : systemStatus === "inactive" || systemStatus === "migration"
                            ? "0 0 8px #ffc300"
                            : "0 0 8px #ff2d78",
                    }}
                  />
                  {systemStatus === "ready" && "Aktiv"}
                  {systemStatus === "inactive" && "Nicht verbunden"}
                  {systemStatus === "migration" && "Migration nötig"}
                  {systemStatus === "error" && "Fehler"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/assess"
              className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              style={{ borderColor: "rgba(0,229,255,0.28)", color: "#00e5ff", background: "rgba(0,229,255,0.06)" }}>
              Eigenes erstellen →
            </Link>
            <Link href="/"
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all">
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* ── Gender filter pills ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {FILTERS.map((f) => {
            const isActive = gender === f.value;
            return (
              <motion.button key={f.value}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleGender(f.value)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border"
                style={{
                  borderColor: isActive ? f.color : "rgba(255,255,255,0.07)",
                  background:  isActive ? `${f.color}14` : "rgba(255,255,255,0.025)",
                  color:       isActive ? f.color : "rgba(255,255,255,0.4)",
                  boxShadow:   isActive ? `0 0 16px ${f.color}22` : "none",
                }}>
                <span className="text-sm leading-none">{f.emoji}</span>
                <span>{f.label}</span>
                {isActive && total > 0 && (
                  <span className="text-[9px] opacity-60 font-normal">{total}</span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          {systemStatus === "loading" ? (
            <motion.div key="health-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} delay={i * 0.07} />)}
            </motion.div>
          ) : systemStatus === "inactive" ? (
            <motion.div key="no-db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-32 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "rgba(255,195,0,0.08)", border: "1px solid rgba(255,195,0,0.18)" }}>
                🔧
              </div>
              <div className="max-w-md">
                <p className="text-white font-black text-lg mb-2">Datenbank nicht konfiguriert</p>
                <p className="text-sm text-white/40 leading-relaxed mb-4">{systemMessage}</p>
                <p className="text-sm text-white/40 leading-relaxed">
                  Lokal:{" "}
                  <code className="text-[#00e5ff] text-xs bg-white/5 px-1.5 py-0.5 rounded">.env.local</code>
                  {" "}mit{" "}
                  <code className="text-[#00e5ff] text-xs bg-white/5 px-1.5 py-0.5 rounded">SUPABASE_URL</code>
                  {" + "}
                  <code className="text-[#00e5ff] text-xs bg-white/5 px-1.5 py-0.5 rounded">SUPABASE_ANON_KEY</code>
                  {" "}(oder <code className="text-[#00e5ff] text-xs bg-white/5 px-1.5 py-0.5 rounded">NEXT_PUBLIC_*</code>).
                  Live: dieselben Werte unter Netlify → Environment variables.
                </p>
              </div>
            </motion.div>
          ) : systemStatus === "migration" ? (
            <motion.div key="migration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-32 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "rgba(255,195,0,0.08)", border: "1px solid rgba(255,195,0,0.18)" }}>
                📋
              </div>
              <div className="max-w-md">
                <p className="text-white font-black text-lg mb-2">SQL-Migration ausstehend</p>
                <p className="text-sm text-white/40 leading-relaxed mb-6">{systemMessage}</p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={recheckHealth}
                  className="px-6 py-3 rounded-2xl border border-white/15 text-sm font-bold text-white/70 hover:text-white hover:border-white/30 transition-colors">
                  Erneut prüfen
                </motion.button>
              </div>
            </motion.div>
          ) : systemStatus === "error" ? (
            <motion.div key="db-err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-32 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "rgba(255,45,120,0.08)", border: "1px solid rgba(255,45,120,0.22)" }}>
                ⚠
              </div>
              <div className="max-w-md">
                <p className="text-white font-black text-lg mb-2">Datenbankfehler</p>
                <p className="text-sm text-white/40 leading-relaxed mb-6 break-words">{systemMessage}</p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={recheckHealth}
                  className="px-6 py-3 rounded-2xl border border-white/15 text-sm font-bold text-white/70 hover:text-white hover:border-white/30 transition-colors">
                  Erneut prüfen
                </motion.button>
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} delay={i * 0.07} />)}
            </motion.div>

          ) : profiles.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-32 text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl">🔭</motion.div>
              <div>
                <p className="text-white font-black text-lg mb-1">Noch keine Profile</p>
                <p className="text-sm text-white/40">Sei der Erste, der sein DNA-Profil teilt!</p>
              </div>
              <Link href="/assess"
                className="mt-2 px-8 py-3 rounded-2xl border border-white/12 text-sm font-bold text-white/55 hover:text-white hover:border-white/28 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                Jetzt starten →
              </Link>
            </motion.div>

          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Profile grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((p, i) => (
                  <ProfileCard key={p.id} profile={p} index={i} />
                ))}
              </div>

              {/* Load more */}
              {profiles.length < total && (
                <div className="flex justify-center pt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/12 text-sm font-bold text-white/45 hover:text-white hover:border-white/25 transition-all disabled:opacity-40">
                    {loadingMore ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-3.5 h-3.5 border border-t-transparent border-white/40 rounded-full" />
                        Lädt…
                      </>
                    ) : (
                      `Mehr laden · ${total - profiles.length} weitere`
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
