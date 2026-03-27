"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import type { SliderAxis } from "../types";

interface SliderQuestionProps {
  axes: SliderAxis[];
  onCommit: (values: number[]) => void;
  initialValues?: number[];
}

const axisColors = ["#00e5ff", "#9d4edd", "#ffc300", "#ff2d78", "#39ff14", "#ff8c00"];

export default function SliderQuestion({ axes, onCommit, initialValues }: SliderQuestionProps) {
  const [values, setValues] = useState<number[]>(() =>
    initialValues ?? axes.map(() => 50)
  );
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIdx = useRef<number | null>(null);

  // Sync wenn neue axes ankommen
  useEffect(() => {
    setValues(initialValues ?? axes.map(() => 50));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axes.length]);

  const calcValue = useCallback((clientX: number, idx: number): number => {
    const track = trackRefs.current[idx];
    if (!track) return 50;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.round((x / rect.width) * 100);
  }, []);

  const applyValue = useCallback(
    (clientX: number, idx: number) => {
      const val = calcValue(clientX, idx);
      setValues((prev) => {
        const next = [...prev];
        next[idx] = val;
        onCommit(next);
        return next;
      });
    },
    [calcValue, onCommit]
  );

  // ── Pointer events (funktioniert auf Mouse + Touch + Stylus) ──────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    activeIdx.current = idx;
    applyValue(e.clientX, idx);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeIdx.current === null) return;
    applyValue(e.clientX, activeIdx.current);
  };

  const onPointerUp = () => {
    activeIdx.current = null;
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      {axes.map((axis, idx) => {
        const color = axisColors[idx % axisColors.length];
        const pct = values[idx] ?? 50;
        return (
          <motion.div
            key={axis.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
            className="flex flex-col gap-4"
          >
            {/* Achsen-Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                {axis.label}
              </span>
              <span className="text-sm font-black tabular-nums" style={{ color }}>
                {pct}
              </span>
            </div>

            {/* Pol-Labels */}
            <div className="flex justify-between text-[11px] text-white/35 font-medium px-1">
              <span>{axis.leftLabel}</span>
              <span>{axis.rightLabel}</span>
            </div>

            {/* Interaktiver Track */}
            <div
              ref={(el) => { trackRefs.current[idx] = el; }}
              onPointerDown={(e) => onPointerDown(e, idx)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative h-12 flex items-center cursor-pointer select-none touch-none"
              role="slider"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={axis.label}
            >
              {/* Track background */}
              <div className="absolute inset-x-0 h-[4px] rounded-full bg-white/10" />

              {/* Track fill */}
              <div
                className="absolute left-0 h-[4px] rounded-full pointer-events-none"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}55, ${color})`,
                  boxShadow: `0 0 10px ${color}99`,
                }}
              />

              {/* Thumb */}
              <motion.div
                className="absolute pointer-events-none -translate-x-1/2"
                style={{ left: `${pct}%` }}
                animate={{ scale: activeIdx.current === idx ? 1.3 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {/* Outer glow ring */}
                <div
                  className="absolute inset-0 rounded-full scale-150 blur-sm opacity-40"
                  style={{ background: color }}
                />
                {/* Thumb core */}
                <div
                  className="relative w-6 h-6 rounded-full border-2"
                  style={{
                    background: "#0d0d14",
                    borderColor: color,
                    boxShadow: `0 0 14px ${color}, 0 0 28px ${color}55`,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
