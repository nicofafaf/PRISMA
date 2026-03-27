"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/features/assessment/store/useAssessmentStore";
import AssessmentFlow from "@/features/assessment/components/AssessmentFlow";
import ParticleBackground from "@/shared/components/ParticleBackground";
import { motion } from "framer-motion";

export default function AssessPage() {
  const { phase, setPhase } = useAssessmentStore();
  const router = useRouter();

  // Redirect to results when complete
  useEffect(() => {
    if (phase === "complete") {
      router.push("/results");
    }
  }, [phase, router]);

  // On fresh visit, ensure we're in assessing mode
  useEffect(() => {
    if (phase === "landing") setPhase("assessing");
  }, [phase, setPhase]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      {/* Ambient color wash */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 60%, rgba(157,78,221,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 30%, rgba(0,229,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Top gradient bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,229,255,0.4), rgba(157,78,221,0.4), transparent)",
        }}
      />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AssessmentFlow />
      </motion.div>
    </main>
  );
}
