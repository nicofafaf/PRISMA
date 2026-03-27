// ─── Domain Types ─────────────────────────────────────────────────────────────

export type QuestionKind =
  | "ab_visual"
  | "abc_visual"
  | "glyph"
  | "slider";

export interface VisualOption {
  id: string;
  label: string;
  colorKey: "cyan" | "violet" | "gold" | "rose" | "green";
  tags: string[];
}

export interface SliderAxis {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
}

export interface Question {
  id: string;
  kind: QuestionKind;
  prompt: string;
  subPrompt?: string;
  category?: string;     // z.B. "Persönlichkeit", "FSK-18", "Lifestyle"
  options?: VisualOption[];
  axes?: SliderAxis[];
  glyphs?: VisualOption[];
}

// ─── DNA-Dimensionen ──────────────────────────────────────────────────────────

export type DNADimension =
  | "structure"    // Freiheit → Ordnung
  | "stimulation"  // Ruhe → Reiz
  | "aesthetics"   // Organisch → Geometrisch
  | "social"       // Einsamkeit → Verbundenheit
  | "expression"   // Zurückhaltend → Ausdrucksstark
  | "risk"         // Vorsichtig → Abenteuerlustig
  | "tradition"    // Klassisch → Modern
  | "focus"        // Breiter Blick → Präzision
  // FSK-18 & Lifestyle-Dimensionen
  | "dominance"    // Submissiv → Dominant
  | "openness"     // Konventionell → Offen/Tabubrechend
  | "intimacy"     // Körperlich → Emotional
  | "rhythm";      // Morgen → Nacht

export interface DNAProfile {
  [dim: string]: number; // 0–100
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface AssessmentAnswer {
  questionId: string;
  value: string | number[] | string[];
}

export type AssessmentPhase = "landing" | "assessing" | "complete";
