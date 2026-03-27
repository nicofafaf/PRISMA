"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  glow?: "cyan" | "violet" | "gold" | "rose" | "green" | "none";
  className?: string;
  children: React.ReactNode;
}

const glowMap: Record<string, string> = {
  cyan: "shadow-[0_0_32px_rgba(0,229,255,0.18)] border-[rgba(0,229,255,0.18)]",
  violet: "shadow-[0_0_32px_rgba(157,78,221,0.22)] border-[rgba(157,78,221,0.2)]",
  gold: "shadow-[0_0_32px_rgba(255,195,0,0.18)] border-[rgba(255,195,0,0.18)]",
  rose: "shadow-[0_0_32px_rgba(255,45,120,0.18)] border-[rgba(255,45,120,0.18)]",
  green: "shadow-[0_0_32px_rgba(57,255,20,0.16)] border-[rgba(57,255,20,0.14)]",
  none: "border-white/8",
};

export default function GlassPanel({
  glow = "none",
  className,
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border bg-white/[0.04] backdrop-blur-xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-[url('/noise.png')] before:opacity-[0.03] before:pointer-events-none",
        glowMap[glow],
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
