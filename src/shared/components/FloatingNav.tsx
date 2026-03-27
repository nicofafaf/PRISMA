"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/assess",  label: "Assessment" },
  { href: "/galerie", label: "Galerie"    },
];

export default function FloatingNav() {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible,  setVisible]  = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="fixed top-4 inset-x-0 z-40 flex justify-center pointer-events-none"
    >
      <div
        className="pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-2xl transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(10,10,18,0.88)"
            : "rgba(10,10,18,0.55)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: scrolled
            ? "1px solid rgba(255,255,255,0.09)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(157,78,221,0.06) inset"
            : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-xl group">
          {/* Prisma icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polygon
              points="8,1 15,13 1,13"
              fill="none"
              stroke="url(#nav-grad)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <line x1="8" y1="1" x2="8" y2="8" stroke="rgba(0,229,255,0.35)" strokeWidth="0.8" />
            <line x1="8" y1="8" x2="1" y2="13" stroke="rgba(157,78,221,0.35)" strokeWidth="0.8" />
            <line x1="8" y1="8" x2="15" y2="13" stroke="rgba(255,195,0,0.35)" strokeWidth="0.8" />
            <circle cx="8" cy="1" r="1.2" fill="#00e5ff" style={{ filter: "drop-shadow(0 0 3px #00e5ff)" }} />
            <circle cx="15" cy="13" r="1.2" fill="#9d4edd" style={{ filter: "drop-shadow(0 0 3px #9d4edd)" }} />
            <circle cx="1" cy="13" r="1.2" fill="#ffc300" style={{ filter: "drop-shadow(0 0 3px #ffc300)" }} />
            <defs>
              <linearGradient id="nav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#9d4edd" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="text-sm font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #f0f0ff 0%, #00e5ff 55%, #9d4edd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PRISMA
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Links */}
        {NAV_LINKS.map((l) => {
          const isActive = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors duration-200 hover:text-white"
              style={{ color: isActive ? "#f0f0ff" : "rgba(255,255,255,0.45)" }}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{l.label}</span>
            </Link>
          );
        })}

        {/* CTA */}
        <div className="ml-2 pl-1 border-l border-white/[0.07]">
          <Link
            href="/assess"
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            style={{
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.28)",
              color: "#00e5ff",
            }}
          >
            Starten
            <span className="text-[10px] opacity-70">→</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
