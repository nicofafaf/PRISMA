"use client";
import { create } from "zustand";
import type { AssessmentAnswer, AssessmentPhase, DNAProfile } from "../types";
import { questions } from "../data/questions";

// ─── Alle 12 Dimensionen ──────────────────────────────────────────────────────

const DIMENSIONS = [
  "structure",
  "stimulation",
  "aesthetics",
  "social",
  "expression",
  "risk",
  "tradition",
  "focus",
  "dominance",
  "openness",
  "intimacy",
  "rhythm",
] as const;

// Welcher Pol = hoher Wert (100)?
const HIGH_POLARITIES: Record<string, string[]> = {
  structure:   ["order"],
  stimulation: ["thrill"],
  aesthetics:  ["geometric"],
  social:      ["connection"],
  expression:  ["expressive"],
  risk:        ["adventurous"],
  tradition:   ["modern"],
  focus:       ["precise"],
  dominance:   ["dominant"],
  openness:    ["taboo"],
  intimacy:    ["emotional"],
  rhythm:      ["night"],
};

function polarityToScore(dim: string, polarity: string): number {
  const highs = HIGH_POLARITIES[dim] ?? [];
  return highs.includes(polarity) ? 85 : 15;
}

// ─── Scoring Engine ────────────────────────────────────────────────────────────

function buildDNA(answers: AssessmentAnswer[]): DNAProfile {
  const raw: Record<string, number[]> = Object.fromEntries(
    DIMENSIONS.map((d) => [d, []])
  );

  for (const answer of answers) {
    const q = questions.find((q) => q.id === answer.questionId);
    if (!q) continue;

    if (q.kind === "ab_visual" || q.kind === "abc_visual" || q.kind === "glyph") {
      const pool = q.options ?? q.glyphs ?? [];
      const ids = Array.isArray(answer.value) ? answer.value : [answer.value];
      for (const id of ids) {
        const opt = pool.find((o) => o.id === id);
        if (!opt) continue;
        for (const tag of opt.tags) {
          const [dim, polarity] = tag.split(":");
          if (!polarity) continue;
          if (DIMENSIONS.includes(dim as (typeof DIMENSIONS)[number])) {
            raw[dim].push(polarityToScore(dim, polarity));
          }
        }
      }
    }

    if (q.kind === "slider") {
      const values = answer.value as number[];
      q.axes?.forEach((axis, i) => {
        if (DIMENSIONS.includes(axis.id as (typeof DIMENSIONS)[number])) {
          raw[axis.id].push(values[i] ?? 50);
        }
      });
    }
  }

  // Mittelwert je Dimension → 0-100
  return Object.fromEntries(
    DIMENSIONS.map((d) => {
      const arr = raw[d];
      if (arr.length === 0) return [d, 50];
      return [d, Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)];
    })
  );
}

// ─── Zustand-Store ────────────────────────────────────────────────────────────

interface AssessmentState {
  phase: AssessmentPhase;
  currentIndex: number;
  answers: AssessmentAnswer[];
  dna: DNAProfile | null;

  setPhase: (phase: AssessmentPhase) => void;
  answer: (questionId: string, value: AssessmentAnswer["value"]) => void;
  next: () => void;
  prev: () => void;
  complete: () => void;
  restart: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  phase: "landing",
  currentIndex: 0,
  answers: [],
  dna: null,

  setPhase: (phase) => set({ phase }),

  answer: (questionId, value) => {
    const answers = get().answers.filter((a) => a.questionId !== questionId);
    set({ answers: [...answers, { questionId, value }] });
  },

  next: () => {
    const { currentIndex, answers } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      const dna = buildDNA(answers);
      set({ dna, phase: "complete" });
    } else {
      set({ currentIndex: nextIndex });
    }
  },

  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
  },

  complete: () => {
    const dna = buildDNA(get().answers);
    set({ dna, phase: "complete" });
  },

  restart: () => set({ phase: "landing", currentIndex: 0, answers: [], dna: null }),
}));
