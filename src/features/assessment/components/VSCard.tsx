"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VisualOption } from "../types";
import { cn } from "@/lib/utils";

const colorConfig: Record<string, { gradient: string; glow: string; border: string }> = {
  cyan:   { gradient: "from-[#002030] via-[#004455] to-[#002030]", glow: "rgba(0,229,255,0.45)",   border: "rgba(0,229,255,0.3)"   },
  violet: { gradient: "from-[#150025] via-[#280050] to-[#150025]", glow: "rgba(157,78,221,0.45)",  border: "rgba(157,78,221,0.3)"  },
  gold:   { gradient: "from-[#251800] via-[#503000] to-[#251800]", glow: "rgba(255,195,0,0.45)",   border: "rgba(255,195,0,0.3)"   },
  rose:   { gradient: "from-[#280010] via-[#550025] to-[#280010]", glow: "rgba(255,45,120,0.45)",  border: "rgba(255,45,120,0.3)"  },
  green:  { gradient: "from-[#002800] via-[#005500] to-[#002800]", glow: "rgba(57,255,20,0.4)",    border: "rgba(57,255,20,0.28)"  },
};

const ShapePattern = ({ colorKey }: { colorKey: string }) => {
  const col = colorKey === "cyan" ? "#00e5ff" : colorKey === "violet" ? "#9d4edd"
    : colorKey === "gold" ? "#ffc300" : colorKey === "rose" ? "#ff2d78" : "#39ff14";
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
      viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      {(colorKey === "cyan" || colorKey === "green") ? (
        <>
          <circle cx="200" cy="200" r="120" fill="none" stroke={col} strokeWidth="1" />
          <circle cx="200" cy="200" r="75"  fill="none" stroke={col} strokeWidth="0.5" />
          <ellipse cx="140" cy="150" rx="60" ry="90" fill="none" stroke={col} strokeWidth="0.5" />
          <path d="M80,200 Q200,80 320,200 Q200,320 80,200Z" fill="none" stroke={col} strokeWidth="0.8" />
        </>
      ) : (
        <>
          <line x1="0" y1="0" x2="400" y2="400" stroke={col} strokeWidth="0.5" />
          <line x1="400" y1="0" x2="0" y2="400" stroke={col} strokeWidth="0.5" />
          <rect x="100" y="100" width="200" height="200" fill="none" stroke={col} strokeWidth="1" />
          <rect x="150" y="150" width="100" height="100" fill="none" stroke={col} strokeWidth="0.5" />
          <polygon points="200,50 350,300 50,300" fill="none" stroke={col} strokeWidth="0.8" />
        </>
      )}
    </svg>
  );
};

interface VSCardProps {
  options: VisualOption[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

export default function VSCard({ options, onSelect, selectedId }: VSCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isABC = options.length === 3;

  return (
    <div className="relative w-full">
      {/* VS-Badge nur bei A/B */}
      {!isABC && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="w-11 h-11 rounded-full bg-[#0d0d14] border border-white/20 flex items-center justify-center"
            style={{ boxShadow: "0 0 20px rgba(0,229,255,0.25)" }}
          >
            <span className="text-[9px] font-black tracking-widest text-white/70">VS</span>
          </motion.div>
        </div>
      )}

      <div className={cn(
        "grid gap-3 w-full",
        isABC
          ? "grid-cols-1 sm:grid-cols-3"   // Auf Mobile stacken, ab sm nebeneinander
          : "grid-cols-2"
      )}>
        {options.map((opt, i) => {
          const cfg = colorConfig[opt.colorKey];
          const isSelected = selectedId === opt.id;
          const isHovered = hoveredId === opt.id;
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 24 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoveredId(opt.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => onSelect(opt.id)}
              className={cn(
                // Mobile: kleiner, Desktop: größer
                "relative min-h-[140px] sm:min-h-[220px] rounded-2xl overflow-hidden cursor-pointer",
                `bg-gradient-to-br ${cfg.gradient}`,
                isABC && "min-h-[110px] sm:min-h-[200px]"
              )}
              style={{
                border: `1px solid ${isSelected ? cfg.border : "rgba(255,255,255,0.07)"}`,
                boxShadow: isSelected
                  ? `0 0 36px ${cfg.glow}, inset 0 0 50px ${cfg.glow.replace("0.45", "0.07")}`
                  : isHovered ? `0 0 20px ${cfg.glow}` : "0 4px 20px rgba(0,0,0,0.5)",
                transition: "box-shadow 0.3s, border-color 0.3s",
              }}
            >
              <ShapePattern colorKey={opt.colorKey} />
              <div className="absolute inset-0 opacity-[0.035] bg-[url('/noise.png')]" />

              {/* Ausgewählt-Haken */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: cfg.border, boxShadow: `0 0 10px ${cfg.glow}` }}
                  >
                    <svg viewBox="0 0 12 12" className="w-3.5 h-3.5">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/75 to-transparent">
                <p className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide leading-tight">
                  {opt.label}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
