import type { Question } from "../types";

export const questions: Question[] = [

  // ══════════════════════════════════════════════════════════
  // BLOCK 1 · PERSÖNLICHKEIT
  // ══════════════════════════════════════════════════════════
  {
    id: "q1",
    kind: "ab_visual",
    category: "Persönlichkeit",
    prompt: "Welche Welt ruft nach dir?",
    subPrompt: "Vertrau deinem Bauchgefühl — entscheide sofort.",
    options: [
      { id: "q1_a", label: "Organische Stille", colorKey: "cyan",
        tags: ["aesthetics:organic", "stimulation:calm", "tradition:classical"] },
      { id: "q1_b", label: "Urbaner Puls",      colorKey: "violet",
        tags: ["aesthetics:geometric", "stimulation:thrill", "tradition:modern"] },
    ],
  },
  {
    id: "q2",
    kind: "ab_visual",
    category: "Persönlichkeit",
    prompt: "Wie tankst du Energie auf?",
    subPrompt: "Kein Richtig oder Falsch — nur du.",
    options: [
      { id: "q2_a", label: "Allein in der Stille",   colorKey: "rose",
        tags: ["social:solitude", "focus:precise", "expression:reserved"] },
      { id: "q2_b", label: "Mit Menschen, die leuchten", colorKey: "gold",
        tags: ["social:connection", "expression:expressive", "stimulation:thrill"] },
    ],
  },
  {
    id: "q3",
    kind: "abc_visual",
    category: "Persönlichkeit",
    prompt: "Welche Energie spricht dich an?",
    subPrompt: "Das Erste, was dich anzieht, zählt.",
    options: [
      { id: "q3_a", label: "Ritual & Handwerk",   colorKey: "green",
        tags: ["tradition:classical", "structure:order", "focus:precise"] },
      { id: "q3_b", label: "Experiment & Chaos",  colorKey: "rose",
        tags: ["tradition:modern", "risk:adventurous", "expression:expressive"] },
      { id: "q3_c", label: "Stille & Tiefe",      colorKey: "violet",
        tags: ["stimulation:calm", "focus:precise", "expression:reserved"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 2 · SINNE & RHYTHMUS
  // ══════════════════════════════════════════════════════════
  {
    id: "q4",
    kind: "ab_visual",
    category: "Lifestyle",
    prompt: "Wann lebst du am intensivsten?",
    options: [
      { id: "q4_a", label: "Im Morgenrot — klar, frisch, fokussiert", colorKey: "gold",
        tags: ["rhythm:morning", "structure:order", "focus:precise"] },
      { id: "q4_b", label: "Im Nachtdunkel — wach, wild, frei",       colorKey: "violet",
        tags: ["rhythm:night", "risk:adventurous", "stimulation:thrill"] },
    ],
  },
  {
    id: "q5",
    kind: "abc_visual",
    category: "Lifestyle",
    prompt: "Wähle deinen Lebensraum.",
    subPrompt: "Das Zuhause, das deiner Seele entspricht.",
    options: [
      { id: "q5_a", label: "Leerer Raum, klare Linien",      colorKey: "cyan",
        tags: ["aesthetics:geometric", "structure:order", "focus:precise"] },
      { id: "q5_b", label: "Warm, voll, sinnlich",           colorKey: "gold",
        tags: ["aesthetics:organic", "stimulation:calm", "social:connection"] },
      { id: "q5_c", label: "Dunkel, intim, aufgeladen",      colorKey: "rose",
        tags: ["rhythm:night", "expression:reserved", "openness:taboo"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 3 · INNERER KOMPASS (Slider)
  // ══════════════════════════════════════════════════════════
  {
    id: "q6",
    kind: "slider",
    category: "Innere Welt",
    prompt: "Kalibriere deinen inneren Kompass.",
    subPrompt: "Ziehe jeden Regler dorthin, wo du wirklich stehst.",
    axes: [
      { id: "structure",   label: "Struktur",    leftLabel: "Totale Freiheit",    rightLabel: "Pure Ordnung"      },
      { id: "stimulation", label: "Stimulation", leftLabel: "Tiefe Ruhe",         rightLabel: "Maximaler Reiz"    },
      { id: "social",      label: "Soziales",    leftLabel: "Einsamkeit",          rightLabel: "Verbundenheit"     },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 4 · BEZIEHUNGEN & INTIMITÄT
  // ══════════════════════════════════════════════════════════
  {
    id: "q7",
    kind: "ab_visual",
    category: "Beziehungen",
    prompt: "Wie zeigst du Zuneigung am stärksten?",
    options: [
      { id: "q7_a", label: "Worte, Tiefe, Aufmerksamkeit", colorKey: "violet",
        tags: ["intimacy:emotional", "expression:expressive", "social:connection"] },
      { id: "q7_b", label: "Berührungen, Nähe, Körper",    colorKey: "rose",
        tags: ["intimacy:physical", "stimulation:thrill", "expression:expressive"] },
    ],
  },
  {
    id: "q8",
    kind: "abc_visual",
    category: "Beziehungen",
    prompt: "Was macht eine Beziehung für dich vollständig?",
    options: [
      { id: "q8_a", label: "Tiefe Sicherheit & Vertrauen",   colorKey: "green",
        tags: ["intimacy:emotional", "structure:order", "risk:cautious"] },
      { id: "q8_b", label: "Leidenschaft & elektrische Spannung", colorKey: "rose",
        tags: ["intimacy:physical", "stimulation:thrill", "risk:adventurous"] },
      { id: "q8_c", label: "Freiheit & gegenseitiges Wachsen", colorKey: "cyan",
        tags: ["openness:conventional", "social:connection", "tradition:modern"] },
    ],
  },
  {
    id: "q9",
    kind: "ab_visual",
    category: "Beziehungen",
    prompt: "Welche Rolle trägst du in einer Verbindung?",
    subPrompt: "Nicht immer — aber meistens.",
    options: [
      { id: "q9_a", label: "Ich führe, schütze, forme",         colorKey: "gold",
        tags: ["dominance:dominant", "structure:order", "expression:expressive"] },
      { id: "q9_b", label: "Ich vertraue, empfange, öffne mich", colorKey: "violet",
        tags: ["dominance:submissive", "intimacy:emotional", "expression:reserved"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 5 · SEXUALITÄT — FSK 18
  // ══════════════════════════════════════════════════════════
  {
    id: "q10",
    kind: "abc_visual",
    category: "FSK-18",
    prompt: "Wo liegt deine erotische Energie zuerst?",
    subPrompt: "Ehrlich. Niemand schaut zu.",
    options: [
      { id: "q10_a", label: "Im Körper — Berührung, Haut, Hitze",      colorKey: "rose",
        tags: ["intimacy:physical", "stimulation:thrill", "dominance:dominant"] },
      { id: "q10_b", label: "Im Kopf — Fantasie, Spannung, Vorstellung", colorKey: "violet",
        tags: ["openness:taboo", "focus:precise", "expression:reserved"] },
      { id: "q10_c", label: "Im Herz — Vertrauen, Tiefe, Verbindung",   colorKey: "cyan",
        tags: ["intimacy:emotional", "social:connection", "risk:cautious"] },
    ],
  },
  {
    id: "q11",
    kind: "ab_visual",
    category: "FSK-18",
    prompt: "Deine Dynamik im intimen Raum.",
    subPrompt: "Was dir mehr Energie gibt — nicht was du immer machst.",
    options: [
      { id: "q11_a", label: "Ich nehme das Steuer — führen, bestimmen, geben", colorKey: "gold",
        tags: ["dominance:dominant", "structure:order", "stimulation:thrill"] },
      { id: "q11_b", label: "Ich lasse los — vertrauen, spüren, empfangen",   colorKey: "rose",
        tags: ["dominance:submissive", "intimacy:emotional", "stimulation:thrill"] },
    ],
  },
  {
    id: "q12",
    kind: "abc_visual",
    category: "FSK-18",
    prompt: "Was zieht dich in der Erotik wirklich an?",
    options: [
      { id: "q12_a", label: "Das Vertraute — Sicherheit, Tiefe, Ritual",      colorKey: "green",
        tags: ["openness:conventional", "tradition:classical", "intimacy:emotional"] },
      { id: "q12_b", label: "Das Neue — Abenteuer, Entdecken, Überraschung",  colorKey: "cyan",
        tags: ["openness:conventional", "risk:adventurous", "tradition:modern"] },
      { id: "q12_c", label: "Das Verbotene — Grenzen, Tabu, das Ungesagte",   colorKey: "rose",
        tags: ["openness:taboo", "risk:adventurous", "stimulation:thrill"] },
    ],
  },
  {
    id: "q13",
    kind: "slider",
    category: "FSK-18",
    prompt: "Präzise Selbstreflexion — nur für dich.",
    subPrompt: "Schiebe bewusst. Diese Werte bleiben geheim.",
    axes: [
      { id: "dominance", label: "Dynamik",       leftLabel: "Submissiv",        rightLabel: "Dominant"          },
      { id: "openness",  label: "Offenheit",      leftLabel: "Konventionell",    rightLabel: "Tabubrechend"      },
      { id: "intimacy",  label: "Intimität",      leftLabel: "Körperlich",       rightLabel: "Emotional"         },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 6 · GLYPHEN
  // ══════════════════════════════════════════════════════════
  {
    id: "q14",
    kind: "glyph",
    category: "Symbole",
    prompt: "Wähle das Symbol deiner inneren Kraft.",
    subPrompt: "Tippe an oder ziehe in den Empfänger.",
    glyphs: [
      { id: "g_depth",  label: "Tiefe",   colorKey: "violet", tags: ["focus:precise",   "structure:order"]        },
      { id: "g_spark",  label: "Funken",  colorKey: "gold",   tags: ["stimulation:thrill","risk:adventurous"]      },
      { id: "g_anchor", label: "Anker",   colorKey: "green",  tags: ["structure:order", "tradition:classical"]    },
      { id: "g_flame",  label: "Flamme",  colorKey: "rose",   tags: ["expression:expressive","dominance:dominant"] },
    ],
  },
  {
    id: "q15",
    kind: "glyph",
    category: "Symbole",
    prompt: "Wähle das Symbol deiner erotischen Seele.",
    glyphs: [
      { id: "g_venus",  label: "Venus",      colorKey: "rose",   tags: ["intimacy:emotional","openness:conventional"] },
      { id: "g_mars",   label: "Mars",       colorKey: "gold",   tags: ["dominance:dominant","stimulation:thrill"]    },
      { id: "g_herz",   label: "Herz",       colorKey: "cyan",   tags: ["intimacy:emotional","social:connection"]     },
      { id: "g_key",    label: "Schlüssel",  colorKey: "violet", tags: ["openness:taboo",   "risk:adventurous"]       },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 7 · AMBITION & RISIKO
  // ══════════════════════════════════════════════════════════
  {
    id: "q16",
    kind: "ab_visual",
    category: "Ambition",
    prompt: "Dein Verhältnis zum Risiko.",
    options: [
      { id: "q16_a", label: "Ich kartiere das Gelände zuerst", colorKey: "green",
        tags: ["risk:cautious", "structure:order", "focus:precise"] },
      { id: "q16_b", label: "Ich springe und baue Flügel im Fallen", colorKey: "rose",
        tags: ["risk:adventurous", "stimulation:thrill", "expression:expressive"] },
    ],
  },
  {
    id: "q17",
    kind: "abc_visual",
    category: "Ambition",
    prompt: "Was treibt dich an?",
    options: [
      { id: "q17_a", label: "Meisterschaft — tiefer als alle anderen", colorKey: "violet",
        tags: ["focus:precise", "structure:order", "tradition:classical"] },
      { id: "q17_b", label: "Wirkung — so viele Menschen wie möglich",  colorKey: "gold",
        tags: ["focus:broad", "social:connection", "expression:expressive"] },
      { id: "q17_c", label: "Freiheit — nach eigenen Regeln leben",     colorKey: "cyan",
        tags: ["tradition:modern", "risk:adventurous", "social:solitude"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BLOCK 8 · ABSCHLUSS-KALIBRIERUNG (Slider)
  // ══════════════════════════════════════════════════════════
  {
    id: "q18",
    kind: "slider",
    category: "Feinschliff",
    prompt: "Letzter Feinschliff.",
    subPrompt: "Bevor deine Präferenz-DNA kristallisiert — noch einmal ehrlich.",
    axes: [
      { id: "expression", label: "Ausdruck",          leftLabel: "Zurückhaltend",  rightLabel: "Ausdrucksstark"    },
      { id: "focus",      label: "Fokus",              leftLabel: "Breiter Blick",  rightLabel: "Laser-Präzision"   },
      { id: "rhythm",     label: "Lebensrhythmus",     leftLabel: "Morgenmensch",   rightLabel: "Nachtmensch"       },
      { id: "tradition",  label: "Haltung",            leftLabel: "Klassisch",      rightLabel: "Modern"            },
    ],
  },
];
