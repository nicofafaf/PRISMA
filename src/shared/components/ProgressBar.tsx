"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current) / total) * 100;
  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#9d4edd]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{
            boxShadow: "0 0 8px rgba(0,229,255,0.6)",
          }}
        />
      </div>
      <span className="text-xs font-medium text-white/40 tabular-nums whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
}
