"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VisualOption } from "../types";

const glyphColorMap: Record<string, { color: string; glow: string }> = {
  cyan:   { color: "#00e5ff", glow: "rgba(0,229,255,0.5)"   },
  violet: { color: "#9d4edd", glow: "rgba(157,78,221,0.5)"  },
  gold:   { color: "#ffc300", glow: "rgba(255,195,0,0.5)"   },
  rose:   { color: "#ff2d78", glow: "rgba(255,45,120,0.5)"  },
  green:  { color: "#39ff14", glow: "rgba(57,255,20,0.45)"  },
};

const GlyphShape = ({ label, color, size = 40 }: { label: string; color: string; size?: number }) => {
  const s = size;
  const h = s / 2;
  const shapes: Record<string, React.ReactNode> = {
    Tiefe:    (<g stroke={color} fill="none" strokeWidth="1.5"><circle cx={h} cy={h} r={h*0.7}/><circle cx={h} cy={h} r={h*0.35} fill={color} fillOpacity="0.3"/><line x1={h} y1={h*0.1} x2={h} y2={h*0.3}/><line x1={h} y1={h*1.7} x2={h} y2={h*1.9}/></g>),
    Breite:   (<g stroke={color} fill="none" strokeWidth="1.5"><line x1={h*0.1} y1={h} x2={h*1.9} y2={h}/><path d={`M${h*0.3},${h*0.4} Q${h},${h*0.1} ${h*1.7},${h*0.4}`}/><path d={`M${h*0.3},${h*1.6} Q${h},${h*1.9} ${h*1.7},${h*1.6}`}/></g>),
    Funken:   (<g stroke={color} fill="none" strokeWidth="1.5"><polygon points={`${h},${h*0.1} ${h*1.2},${h*0.8} ${h*1.9},${h*0.8} ${h*1.35},${h*1.3} ${h*1.6},${h*1.9} ${h},${h*1.5} ${h*0.4},${h*1.9} ${h*0.65},${h*1.3} ${h*0.1},${h*0.8} ${h*0.8},${h*0.8}`}/></g>),
    Anker:    (<g stroke={color} fill="none" strokeWidth="1.5"><line x1={h} y1={h*0.2} x2={h} y2={h*1.8}/><circle cx={h} cy={h*0.45} r={h*0.22}/><path d={`M${h*0.15},${h*1.4} Q${h*0.15},${h*1.85} ${h*0.5},${h*1.85}`}/><path d={`M${h*1.85},${h*1.4} Q${h*1.85},${h*1.85} ${h*1.5},${h*1.85}`}/><line x1={h*0.2} y1={h*0.9} x2={h*1.8} y2={h*0.9}/></g>),
    Flamme:   (<g stroke={color} fill={color} fillOpacity="0.2" strokeWidth="1.5"><path d={`M${h},${h*1.9} C${h*0.3},${h*1.5} ${h*0.2},${h} ${h*0.5},${h*0.6} C${h*0.6},${h*0.8} ${h*0.7},${h*0.6} ${h*0.65},${h*0.3} C${h},${h*0.1} ${h*1.4},${h*0.5} ${h*1.3},${h*0.9} C${h*1.8},${h*0.6} ${h*1.9},${h*1.3} ${h},${h*1.9}Z`}/></g>),
    Welle:    (<g stroke={color} fill="none" strokeWidth="1.5"><path d={`M${h*0.1},${h} C${h*0.4},${h*0.4} ${h*0.6},${h*1.6} ${h},${h} C${h*1.4},${h*0.4} ${h*1.6},${h*1.6} ${h*1.9},${h}`}/><path d={`M${h*0.1},${h*1.3} C${h*0.4},${h*0.7} ${h*0.6},${h*1.9} ${h},${h*1.3} C${h*1.4},${h*0.7} ${h*1.6},${h*1.9} ${h*1.9},${h*1.3}`} opacity="0.5"/></g>),
    Prisma:   (<g stroke={color} fill="none" strokeWidth="1.5"><polygon points={`${h},${h*0.15} ${h*1.8},${h*1.75} ${h*0.2},${h*1.75}`}/><line x1={h} y1={h*0.15} x2={h} y2={h*1.75}/><line x1={h} y1={h} x2={h*1.8} y2={h*1.75}/></g>),
    Wurzel:   (<g stroke={color} fill="none" strokeWidth="1.5"><line x1={h} y1={h*0.2} x2={h} y2={h}/><path d={`M${h},${h} Q${h*0.4},${h*1.3} ${h*0.2},${h*1.8}`}/><path d={`M${h},${h} Q${h*1.6},${h*1.3} ${h*1.8},${h*1.8}`}/><path d={`M${h},${h*0.7} Q${h*0.6},${h} ${h*0.4},${h*1.4}`}/><circle cx={h} cy={h*0.3} r={h*0.1} fill={color}/></g>),
    // FSK-18 Glyphen
    Venus:    (<g stroke={color} fill="none" strokeWidth="1.5"><circle cx={h} cy={h*0.75} r={h*0.5}/><line x1={h} y1={h*1.25} x2={h} y2={h*1.8}/><line x1={h*0.6} y1={h*1.55} x2={h*1.4} y2={h*1.55}/></g>),
    Mars:     (<g stroke={color} fill="none" strokeWidth="1.5"><circle cx={h*0.8} cy={h*1.1} r={h*0.55}/><line x1={h*1.2} y1={h*0.65} x2={h*1.85} y2={h*0.15}/><line x1={h*1.85} y1={h*0.15} x2={h*1.5} y2={h*0.15}/><line x1={h*1.85} y1={h*0.15} x2={h*1.85} y2={h*0.5}/></g>),
    Herz:     (<g stroke={color} fill={color} fillOpacity="0.25" strokeWidth="1.5"><path d={`M${h},${h*1.7} C${h*0.1},${h*1.2} ${h*0.1},${h*0.5} ${h*0.5},${h*0.4} C${h*0.7},${h*0.35} ${h*0.9},${h*0.5} ${h},${h*0.7} C${h*1.1},${h*0.5} ${h*1.3},${h*0.35} ${h*1.5},${h*0.4} C${h*1.9},${h*0.5} ${h*1.9},${h*1.2} ${h},${h*1.7}Z`}/></g>),
    Schlüssel:(<g stroke={color} fill="none" strokeWidth="1.5"><circle cx={h*0.7} cy={h*0.8} r={h*0.4}/><line x1={h*1.0} y1={h*1.05} x2={h*1.9} y2={h*1.75}/><line x1={h*1.55} y1={h*1.4} x2={h*1.55} y2={h*1.65}/><line x1={h*1.7} y1={h*1.55} x2={h*1.7} y2={h*1.75}/></g>),
  };
  return (
    <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} aria-hidden>
      {shapes[label] ?? <circle cx={h} cy={h} r={h*0.6} stroke={color} fill="none" strokeWidth="1.5"/>}
    </svg>
  );
};

interface GlyphPickerProps {
  glyphs: VisualOption[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

export default function GlyphPicker({ glyphs, onSelect, selectedId }: GlyphPickerProps) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Empfänger */}
      <motion.div
        animate={{
          scale: dragOver ? 1.05 : 1,
          boxShadow: dragOver ? "0 0 32px rgba(0,229,255,0.4)" : "0 0 0px transparent",
        }}
        transition={{ type: "spring", stiffness: 300 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const id = e.dataTransfer.getData("glyphId"); if (id) onSelect(id); }}
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 border-dashed bg-white/[0.03] flex flex-col items-center justify-center gap-2"
        style={{ borderColor: dragOver ? "rgba(0,229,255,0.5)" : "rgba(255,255,255,0.12)" }}
      >
        <AnimatePresence mode="wait">
          {selectedId ? (() => {
            const g = glyphs.find((g) => g.id === selectedId)!;
            const cfg = glyphColorMap[g.colorKey];
            return (
              <motion.div key={selectedId} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 300 }} className="flex flex-col items-center gap-1.5">
                <GlyphShape label={g.label} color={cfg.color} size={52} />
                <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{g.label}</span>
              </motion.div>
            );
          })() : (
            <motion.div key="empty" className="flex flex-col items-center gap-1 text-white/25">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span className="text-[10px]">Hier ablegen</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Token-Grid – responsiv: 2 Cols auf Mobile, 4 auf Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
        {glyphs.map((g, i) => {
          const cfg = glyphColorMap[g.colorKey];
          const isSelected = selectedId === g.id;
          return (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 220 }}
              whileHover={{ scale: 1.07, y: -3 }}
              whileTap={{ scale: 0.94 }}
              draggable
              onDragStart={(e) => { (e as unknown as DragEvent).dataTransfer?.setData("glyphId", g.id); }}
              onClick={() => onSelect(g.id)}
              className="flex flex-col items-center gap-2 p-3 sm:p-3 rounded-xl border cursor-pointer min-h-[80px] sm:min-h-[88px] justify-center transition-all duration-300"
              style={{
                background: isSelected ? `${cfg.glow.replace("0.5","0.12")}` : "rgba(255,255,255,0.03)",
                borderColor: isSelected ? cfg.color : "rgba(255,255,255,0.09)",
                boxShadow: isSelected ? `0 0 18px ${cfg.glow}, inset 0 0 10px ${cfg.glow.replace("0.5","0.07")}` : "none",
              }}
            >
              <GlyphShape label={g.label} color={cfg.color} size={36} />
              <span className="text-[10px] font-bold leading-tight text-center" style={{ color: isSelected ? cfg.color : "rgba(255,255,255,0.38)" }}>
                {g.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-[11px] text-white/20 text-center">Tippe eine Glyphe an oder ziehe sie in den Empfänger</p>
    </div>
  );
}
