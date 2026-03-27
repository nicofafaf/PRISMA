import type { DNAProfile } from "@/features/assessment/types";

export interface Archetype {
  name: string;
  subtitle: string;
  traits: string[];
  color: string;
}

export function deriveArchetype(dna: DNAProfile): Archetype {
  const h = (dim: string, t = 58) => (dna[dim] ?? 50) >= t;
  const l = (dim: string, t = 42) => (dna[dim] ?? 50) <= t;

  if (h("dominance") && h("openness") && h("stimulation"))
    return { name: "Der Verführer",       subtitle: "Du schreibst die Regeln des Begehrens selbst.",            traits: ["Dominant", "Grenzsprengend", "Intensiv"],       color: "#ff2d78" };
  if (l("dominance") && h("openness") && h("intimacy"))
    return { name: "Das stille Feuer",    subtitle: "Unter der ruhigen Oberfläche brodelt grenzenlose Tiefe.",  traits: ["Submissiv", "Emotional tief", "Offen"],          color: "#9d4edd" };
  if (h("dominance") && h("openness") && l("intimacy"))
    return { name: "Der Spieler",         subtitle: "Das Spiel ist dein Territorium — Körper und Grenzreize.",  traits: ["Dominant", "Körperlich", "Tabubrechend"],        color: "#ffc300" };
  if (l("dominance") && l("openness") && h("intimacy"))
    return { name: "Die Seelenverwandtschaft", subtitle: "Echte Verbindung ist deine tiefste Erotik.",         traits: ["Emotional", "Treu", "Tief"],                     color: "#00e5ff" };
  if (h("risk") && h("stimulation") && h("expression"))
    return { name: "Der Katalysator",     subtitle: "Du entfachst, was andere nur erträumen.",                  traits: ["Mutig", "Ausdrucksstark", "Elektrisierend"],     color: "#ff8c00" };
  if (l("risk") && h("structure") && h("tradition"))
    return { name: "Der Hüter",           subtitle: "Du bist das Fundament, auf dem Imperien entstehen.",       traits: ["Standhaft", "Zuverlässig", "Tief verwurzelt"],   color: "#39ff14" };
  if (h("aesthetics") && h("focus") && l("social"))
    return { name: "Der Architekt",       subtitle: "Präzision und Schönheit, in der Stille geschmiedet.",      traits: ["Präzise", "Ästhetisch", "Visionär"],            color: "#00bcd4" };
  if (h("social") && h("expression") && l("structure"))
    return { name: "Der Weber",           subtitle: "Du webst Bedeutung in den Raum zwischen Menschen.",        traits: ["Verbindend", "Empathisch", "Charismatisch"],     color: "#ffc300" };
  if (l("stimulation") && h("focus") && h("tradition"))
    return { name: "Der Weise",           subtitle: "Tiefe Wurzeln, noch tiefere Vision.",                      traits: ["Fokussiert", "Geduldig", "Weise"],               color: "#e040fb" };
  if (h("risk") && l("tradition") && h("aesthetics") && h("rhythm"))
    return { name: "Der Nacht-Vorreiter", subtitle: "Du formst die Zukunft im Dunkel.",                         traits: ["Avantgarde", "Nachtaktiv", "Grenzwertig"],       color: "#9d4edd" };
  if (h("social") && h("stimulation") && h("expression"))
    return { name: "Das Leuchtfeuer",     subtitle: "Jeder Raum verwandelt sich in deiner Gegenwart.",          traits: ["Strahlend", "Magnetisch", "Lebendig"],           color: "#ffc300" };
  if (l("rhythm") && h("focus") && h("structure"))
    return { name: "Der Morgen-Stratege",  subtitle: "Klarheit ist deine Superkraft — du siehst, was andere übersehen.", traits: ["Klar", "Strategisch", "Diszipliniert"], color: "#00e5ff" };
  return   { name: "Der Suchende",        subtitle: "Ewig neugierig, wunderschön undefiniert.",                 traits: ["Neugierig", "Wandelbar", "Authentisch"],         color: "#00e5ff" };
}
