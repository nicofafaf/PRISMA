"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/features/assessment/store/useAssessmentStore";
import DNADashboard from "@/features/results/DNADashboard";
import ParticleBackground from "@/shared/components/ParticleBackground";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const { dna, phase, restart } = useAssessmentStore();
  const router = useRouter();

  // Guard: send back if assessment not complete
  useEffect(() => {
    if (phase !== "complete" || !dna) {
      router.replace("/");
    }
  }, [phase, dna, router]);

  const handleRestart = () => {
    restart();
    router.push("/");
  };

  if (!dna) return null;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Ambient layered radials */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(157,78,221,0.08) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(0,229,255,0.07) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255,195,0,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(157,78,221,0.5), rgba(0,229,255,0.5), transparent)",
        }}
      />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <DNADashboard dna={dna} onRestart={handleRestart} />
      </motion.div>
    </main>
  );
}
