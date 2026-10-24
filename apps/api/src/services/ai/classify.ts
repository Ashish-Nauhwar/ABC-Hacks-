import { prisma } from "../../lib/prisma";
import { callOpenRouter } from "./openRouterClient";
import { classifyByKeyword } from "./keywordFallback";
import { generateEmbedding } from "./embeddings";
import { recalculatePriorityScore } from "../priorityScore";
import { routeReportToUniversity } from "../routing";
import { ClassificationSchema, classificationJsonSchema, type ClassificationResult } from "./schema";

// Civic-complaint framing used for PS-23. Maps civic departments onto the existing
// ChallengeDomain enum: Roads & Highways → URBAN_DEVELOPMENT, Water Supply →
// WATER_RESOURCES, Electricity/Lighting → ENERGY, Sanitation/Garbage → ENVIRONMENT,
// Healthcare/Epidemic → HEALTHCARE, Schools/Education → EDUCATION, etc.
const PROMPT_PREFIX = `You are an AI triage officer for Nivaran, a civic complaint tracking \
platform for Indian municipal governments. Citizens submit complaints about public \
infrastructure and civic services. Your job is to read the complaint text and any attached \
photos and classify it into the correct civic department domain.

Domain mapping (use ONLY these exact JSON values):
• Roads, potholes, drainage, footpaths, bridges → URBAN_DEVELOPMENT
• Water supply, pipe leaks, no water, borewell, sewage overflow → WATER_RESOURCES
• Power cuts, streetlights not working, transformer faults, electricity → ENERGY
• Garbage, open defecation, waste dumping, air/noise pollution → ENVIRONMENT
• Hospitals, epidemic, stray animals, food adulteration → HEALTHCARE
• Schools, colleges, midday meal, teacher absence → EDUCATION
• Crop failure, agricultural inputs, irrigation canals → AGRICULTURE
• Discrimination, disability facilities, ramps → ACCESSIBILITY
• Government office delays, corruption, public record issues → PUBLIC_ADMINISTRATION
• Farmer income, rural employment, SHG → RURAL_LIVELIHOODS
• Anything else → OTHER

For the "summary" field write exactly ONE sentence explaining why this complaint was \
assigned to that domain, addressed to the admin, e.g.: \
"Assigned to URBAN_DEVELOPMENT because the report describes a damaged road surface \
with potholes causing safety hazards."

Respond only with the requested JSON — no extra commentary.

Complaint: `;

export interface ClassificationOutcome extends ClassificationResult {
  method: "llm" | "keyword-fallback";
}

// Tries the hosted LLM first; on ANY failure (missing key, network error,
// non-JSON response, or a response that fails the Zod schema check) it
// falls back to the keyword classifier instead of throwing, so a report
// always ends up with *some* classification.
export async function classifyReportWithAI(
  description: string,
  photoUrls: string[],
): Promise<ClassificationOutcome> {
  try {
    const raw = await callOpenRouter(PROMPT_PREFIX + description, photoUrls, classificationJsonSchema);
    const parsed = ClassificationSchema.parse(raw);
    return { ...parsed, method: "llm" };
  } catch (error) {
    console.error("[ai] OpenRouter classification failed, falling back to keyword classifier:", error);
    return { ...classifyByKeyword(description), method: "keyword-fallback" };
  }
}

// Classifies a report by id and writes the result straight back onto it.
// Also generates its description embedding here — this is the one place
// that "enriches" a report after creation, and duplicate detection (a
// later step) needs that embedding to exist before it can run.
// Shared by POST /api/ai/analyze-report and the fire-and-forget call from
// POST /api/issues.
export async function classifyAndUpdateReport(reportId: string) {
  const report = await prisma.report.findUniqueOrThrow({ where: { id: reportId } });
  const result = await classifyReportWithAI(report.description, report.photoUrls);

  await prisma.report.update({
    where: { id: reportId },
    data: {
      domain: result.domain,
      severity: result.severity,
      aiSummary: result.summary,
      aiConfidence: result.confidence,
    },
  });

  const embedding = await generateEmbedding(report.description);
  if (embedding) {
    // `embedding` is an Unsupported pgvector column — same reason `location`
    // is written via raw SQL rather than through the normal Prisma client.
    const vectorLiteral = `[${embedding.join(",")}]`;
    await prisma.$executeRaw`
      UPDATE "Report" SET embedding = ${vectorLiteral}::vector WHERE id = ${reportId}
    `;
  }

  // Now that the domain is known, try to auto-route this to a university —
  // the one piece the old schema promised but never implemented.
  await routeReportToUniversity(reportId);

  // Severity/confidence just changed, so priority needs recomputing too —
  // this is the final write, so its return value has every field current.
  return recalculatePriorityScore(reportId);
}
