"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "prisma_age_confirmed";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    // Session check — Gate nur einmal pro Browser-Session zeigen
    const stored = sessionStorage.getItem(SESSION_KEY);
    setConfirmed(stored === "1");
  }, []);

  const accept = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setConfirmed(true);
  };
  const deny = () => setDeclined(true);

  // Noch nicht geprüft → nichts rendern (vermeidet Flash)
  if (confirmed === null) return null;

  return (
    <>
      <AnimatePresence>
        {!confirmed && !declined && (
          <motion.div
            key="agegate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
            style={{ background: "rgba(5,5,8,0.97)", backdropFilter: "blur(24px)" }}
          >
            {/* Ambient orbs */}
            <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, #9d4edd, transparent 70%)" }} />
            <div className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ff2d78, transparent 70%)" }} />

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
              className="relative max-w-sm w-full rounded-3xl border bg-white/[0.04] backdrop-blur-2xl p-8 flex flex-col items-center text-center gap-6"
              style={{
                borderColor: "rgba(255,45,120,0.25)",
                boxShadow: "0 0 60px rgba(255,45,120,0.12), 0 0 120px rgba(157,78,221,0.08)",
              }}
            >
              {/* Noise overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-[0.035] bg-[url('/noise.png')] pointer-events-none" />

              {/* Badge */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255,45,120,0.12)",
                  border: "1px solid rgba(255,45,120,0.3)",
                  boxShadow: "0 0 24px rgba(255,45,120,0.25)",
                }}>
                <span className="text-lg font-black text-[#ff2d78]">18+</span>
              </div>

              {/* Titel */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white leading-tight">
                  Nur für Erwachsene
                </h2>
                <p className="text-sm text-white/50 leading-relaxed">
                  Diese Erfahrung enthält explizite Fragen zur Sexualität und
                  zu persönlichen Wünschen. Sie ist ausschließlich für Personen
                  ab <strong className="text-white/80">18 Jahren</strong> geeignet.
                </p>
              </div>

              {/* Dünne Trennlinie */}
              <div className="w-full h-px bg-white/8" />

              {/* Buttons */}
              <div className="flex flex-col gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={accept}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,45,120,0.25), rgba(157,78,221,0.25))",
                    border: "1px solid rgba(255,45,120,0.35)",
                    color: "#f0f0ff",
                    boxShadow: "0 0 20px rgba(255,45,120,0.18)",
                  }}
                >
                  Ja, ich bin 18 Jahre oder älter →
                </motion.button>
                <button
                  onClick={deny}
                  className="w-full py-2.5 rounded-xl text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  Nein, ich bin unter 18
                </button>
              </div>

              <p className="text-[10px] text-white/20 leading-relaxed">
                Mit dem Fortfahren bestätigst du, volljährig zu sein und der
                Darstellung von Inhalten für Erwachsene zuzustimmen.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Unter 18 - Sperrbildschirm */}
        {declined && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
            style={{ background: "#050508" }}
          >
            <div className="text-center flex flex-col items-center gap-4">
              <div className="text-5xl">🔒</div>
              <h2 className="text-xl font-black text-white">Zugang verweigert</h2>
              <p className="text-sm text-white/40 max-w-xs">
                Diese Seite ist nur für Personen ab 18 Jahren zugänglich.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App-Inhalt — wird gerendert, aber durch das Gate überlagert */}
      <div style={{ visibility: confirmed ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
