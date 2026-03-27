"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "neon";
  glow?: "cyan" | "violet" | "gold" | "rose";
  disabled?: boolean;
}

const variantMap = {
  primary:
    "bg-white/10 border border-white/15 text-white hover:bg-white/20",
  ghost:
    "bg-transparent border border-white/15 text-white/70 hover:border-white/30 hover:text-white",
  neon: "bg-transparent border text-white",
};

const neonGlowMap = {
  cyan: "border-[rgba(0,229,255,0.5)] shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_32px_rgba(0,229,255,0.5)]",
  violet: "border-[rgba(157,78,221,0.5)] shadow-[0_0_20px_rgba(157,78,221,0.3)] hover:shadow-[0_0_32px_rgba(157,78,221,0.5)]",
  gold: "border-[rgba(255,195,0,0.5)] shadow-[0_0_20px_rgba(255,195,0,0.3)] hover:shadow-[0_0_32px_rgba(255,195,0,0.5)]",
  rose: "border-[rgba(255,45,120,0.5)] shadow-[0_0_20px_rgba(255,45,120,0.3)] hover:shadow-[0_0_32px_rgba(255,45,120,0.5)]",
};

export default function MagneticButton({
  children,
  className,
  onClick,
  variant = "primary",
  glow = "cyan",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    setPos({ x: dx, y: dy });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer select-none",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantMap[variant],
        variant === "neon" && neonGlowMap[glow],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
