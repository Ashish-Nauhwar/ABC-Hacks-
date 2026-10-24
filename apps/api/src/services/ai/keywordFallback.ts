import { ChallengeDomain, Severity } from "@prisma/client";
import type { ClassificationResult } from "./schema";

// Civic-complaint domains mapped to plain-language keywords.
// These only fire when the LLM call itself has already failed — the bar is
// "produce something non-blank," not "be accurate."
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  [ChallengeDomain.URBAN_DEVELOPMENT]: [
    "road", "pothole", "footpath", "pavement", "bridge", "drainage", "drain",
    "street", "housing", "urban", "infrastructure", "gutter", "crack", "broken road",
  ],
  [ChallengeDomain.WATER_RESOURCES]: [
    "water supply", "no water", "pipeline", "borewell", "drinking water",
    "groundwater", "pipe leak", "sewage", "sewage overflow", "tap water", "water tank",
  ],
  [ChallengeDomain.ENERGY]: [
    "power cut", "electricity", "transformer", "solar", "energy", "grid",
    "streetlight", "street light", "no power", "power failure", "blackout",
  ],
  [ChallengeDomain.ENVIRONMENT]: [
    "garbage", "waste", "pollution", "dumping", "open defecation", "stench",
    "deforestation", "burning", "smoke", "noise pollution", "litter", "sanitation",
  ],
  [ChallengeDomain.HEALTHCARE]: [
    "hospital", "clinic", "health", "disease", "medicine", "doctor",
    "epidemic", "stray animal", "mosquito", "food adulteration", "malaria", "dengue",
  ],
  [ChallengeDomain.EDUCATION]: [
    "school", "college", "student", "teacher", "literacy", "education", "classroom",
    "midday meal", "mid day meal", "dropout", "syllabus",
  ],
  [ChallengeDomain.AGRICULTURE]: [
    "crop", "farmer", "farming", "irrigation", "soil", "agriculture", "pesticide",
    "canal", "crop failure", "mandi", "fertilizer",
  ],
  [ChallengeDomain.ACCESSIBILITY]: [
    "disability", "wheelchair", "accessible", "barrier-free", "ramp", "disabled",
    "visual impairment", "hearing impairment",
  ],
  [ChallengeDomain.PUBLIC_ADMINISTRATION]: [
    "government office", "public service", "corruption", "delay", "administration",
    "bribe", "certificate", "panchayat", "municipality",
  ],
  [ChallengeDomain.RURAL_LIVELIHOODS]: [
    "livelihood", "employment", "artisan", "self-help group", "rural", "income",
    "MNREGA", "scheme", "subsidy",
  ],
};

export function classifyByKeyword(description: string): ClassificationResult {
  const text = description.toLowerCase();

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return {
        domain: domain as ChallengeDomain,
        severity: Severity.MEDIUM,
        summary: description.slice(0, 200),
        confidence: 0.3,
      };
    }
  }

  return {
    domain: ChallengeDomain.OTHER,
    severity: Severity.MEDIUM,
    summary: description.slice(0, 200),
    confidence: 0.2,
  };
}
