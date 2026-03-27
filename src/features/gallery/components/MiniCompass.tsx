"use client";
import type { DNAProfile } from "@/features/assessment/types";

const DIMS = ["structure","stimulation","aesthetics","social","expression","risk","tradition","focus","dominance","openness","intimacy","rhythm"];
const COLORS = ["#9d4edd","#ff2d78","#00e5ff","#ffc300","#39ff14","#ff8c00","#e040fb","#00bcd4","#ff2d78","#ffc300","#9d4edd","#00e5ff"];

export default function MiniCompass({ dna, size = 80 }: { dna: DNAProfile; size?: number }) {
  const cx = size / 2, cy = size / 2, maxR = size / 2 - 6;
  const angle = (i: number) => (i / DIMS.length) * 2 * Math.PI - Math.PI / 2;
  const points = DIMS.map((d, i) => {
    const r = ((dna[d] ?? 50) / 100) * maxR;
    return `${cx + r * Math.cos(angle(i))},${cy + r * Math.sin(angle(i))}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      {/* Background rings */}
      {[0.33, 0.66, 1].map((r) => (
        <polygon key={r}
          points={DIMS.map((_, i) => {
            const rad = r * maxR;
            return `${cx + rad * Math.cos(angle(i))},${cy + rad * Math.sin(angle(i))}`;
          }).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      ))}
      {/* DNA polygon */}
      <defs>
        <linearGradient id={`mg_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff"/>
          <stop offset="50%" stopColor="#9d4edd"/>
          <stop offset="100%" stopColor="#ff2d78"/>
        </linearGradient>
      </defs>
      <polygon points={points} fill={`url(#mg_${size})`} fillOpacity="0.2"
        stroke={`url(#mg_${size})`} strokeWidth="1" />
      {/* Dots */}
      {DIMS.map((d, i) => {
        const r = ((dna[d] ?? 50) / 100) * maxR;
        const x = cx + r * Math.cos(angle(i));
        const y = cy + r * Math.sin(angle(i));
        return <circle key={d} cx={x} cy={y} r={1.5} fill={COLORS[i]}
          style={{ filter: `drop-shadow(0 0 2px ${COLORS[i]})` }} />;
      })}
    </svg>
  );
}
