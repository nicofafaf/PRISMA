"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { questions } from "../data/questions";
import VSCard from "./VSCard";
import SliderQuestion from "./SliderQuestion";
import GlyphPicker from "./GlyphPicker";
import GlassPanel from "@/shared/components/GlassPanel";
import MagneticButton from "@/shared/components/MagneticButton";
import ProgressBar from "@/shared/components/ProgressBar";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 64 : -64, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -64 : 64, opacity: 0, scale: 0.97 }),
};

const categoryColors: Record<string, { color: string; label: string }> = {
  "Persönlichkeit": { color: "#00e5ff",  label: "Persönlichkeit"  },
  "Lifestyle":      { color: "#ffc300",  label: "Lifestyle"       },
  "Innere Welt":    { color: "#9d4edd",  label: "Innere Welt"     },
  "Beziehungen":    { color: "#39ff14",  label: "Beziehungen"     },
  "FSK-18":         { color: "#ff2d78",  label: "FSK 18 · Intim"  },
  "Symbole":        { color: "#e040fb",  label: "Symbole"         },
  "Ambition":       { color: "#ff8c00",  label: "Ambition"        },
  "Feinschliff":    { color: "#00bcd4",  label: "Feinschliff"     },
};

export default function AssessmentFlow() {
  const { currentIndex, answers, answer, next, prev } = useAssessmentStore();
  const [direction, setDirection] = useState(1);

  const question = questions[currentIndex];
  const currentAnswer = answers.find((a) => a.questionId === question.id);

  // Slider: ohne Antwort ebenfalls erlaubt (default 50 wird beim Weiter gesetzt)
  const canAdvance =
    question.kind === "slider"
      ? true
      : !!currentAnswer;

  const handleNext = () => {
    // Slider ohne Interaktion → Default-Werte committen
    if (question.kind === "slider" && !currentAnswer && question.axes) {
      answer(question.id, question.axes.map(() => 50));
    }
    setDirection(1);
    next();
  };
  const handlePrev = () => { setDirection(-1); prev(); };

  const catMeta = question.category ? categoryColors[question.category] : null;
  const isFsk = question.category === "FSK-18";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 pt-24 gap-6">
      {/* Fortschrittsbalken */}
      <div className="w-full max-w-2xl px-1">
        <ProgressBar current={currentIndex} total={questions.length} />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="w-full max-w-2xl"
        >
          <GlassPanel
            className="p-5 sm:p-8 flex flex-col gap-6"
            glow={isFsk ? "rose" : "none"}
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                  Frage {currentIndex + 1} von {questions.length}
                </span>
                {catMeta && (
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full border"
                    style={{
                      color: catMeta.color,
                      borderColor: `${catMeta.color}35`,
                      background: `${catMeta.color}12`,
                    }}
                  >
                    {catMeta.label}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {question.prompt}
              </h2>
              {question.subPrompt && (
                <p className="text-sm text-white/45 leading-relaxed">{question.subPrompt}</p>
              )}
            </div>

            {/* Interaktionsschicht */}
            <div>
              {(question.kind === "ab_visual" || question.kind === "abc_visual") &&
                question.options && (
                  <VSCard
                    options={question.options}
                    selectedId={currentAnswer?.value as string | undefined}
                    onSelect={(id) => answer(question.id, id)}
                  />
                )}

              {question.kind === "slider" && question.axes && (
                <SliderQuestion
                  axes={question.axes}
                  initialValues={currentAnswer?.value as number[] | undefined}
                  onCommit={(vals) => answer(question.id, vals)}
                />
              )}

              {question.kind === "glyph" && question.glyphs && (
                <GlyphPicker
                  glyphs={question.glyphs}
                  selectedId={currentAnswer?.value as string | undefined}
                  onSelect={(id) => answer(question.id, id)}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
              <MagneticButton variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}>
                ← Zurück
              </MagneticButton>
              <MagneticButton
                variant="neon"
                glow={isFsk ? "rose" : "cyan"}
                onClick={handleNext}
                disabled={!canAdvance}
              >
                {currentIndex === questions.length - 1 ? "DNA enthüllen →" : "Weiter →"}
              </MagneticButton>
            </div>
          </GlassPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
