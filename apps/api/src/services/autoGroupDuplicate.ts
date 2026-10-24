import { ReportStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { findDuplicateCandidates } from "./duplicateDetection";
import { recalculatePriorityScore } from "./priorityScore";

// Similarity threshold — complaints above this are auto-grouped as duplicates
// without requiring human review. Tune via env (e.g. DUPLICATE_THRESHOLD=0.85).
function getDuplicateThreshold(): number {
  const raw = Number(process.env.DUPLICATE_THRESHOLD);
  return Number.isFinite(raw) && raw > 0 && raw <= 1 ? raw : 0.8;
}

// How far (metres) to search for potential duplicate parent reports.
// ~500 m covers the same block/neighbourhood for most civic complaints.
const SEARCH_RADIUS_METERS = 500;

// Called fire-and-forget from `classification.ts` after classification and
// embedding generation have both completed. If the new complaint is very
// similar (likelihoodScore > threshold) to an existing open report nearby,
// it is automatically grouped under that parent report:
//   • status → DUPLICATE
//   • isDuplicate → true
//   • duplicateOfId → parent.id
// The parent's priorityScore is then recalculated so the stack weight
// propagates immediately to the admin dashboard queue.
//
// This never throws — a duplicate-detection failure should never affect
// the already-created complaint.
export async function enqueueAutoGroup(reportId: string): Promise<void> {
  try {
    await autoGroupIfDuplicate(reportId);
  } catch (err) {
    console.error(`[autoGroup] Failed for report ${reportId}:`, err);
  }
}

async function autoGroupIfDuplicate(reportId: string): Promise<void> {
  const threshold = getDuplicateThreshold();

  // Only run on reports that are still open (not already grouped or resolved).
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, isDuplicate: true, duplicateOfId: true },
  });

  if (!report || report.isDuplicate || report.duplicateOfId) {
    // Already linked — nothing to do.
    return;
  }

  const candidates = await findDuplicateCandidates(reportId, {
    radiusMeters: SEARCH_RADIUS_METERS,
    limit: 3,
  });

  if (candidates.length === 0) return;

  const best = candidates[0];
  if (best.likelihoodScore < threshold) {
    // Not similar enough — leave for human review via GET /:id/duplicates.
    console.log(
      `[autoGroup] Best candidate score ${best.likelihoodScore.toFixed(3)} < ` +
        `threshold ${threshold} for report ${reportId} — skipping auto-group`,
    );
    return;
  }

  console.log(
    `[autoGroup] Auto-grouping report ${reportId} under parent ${best.id} ` +
      `(score ${best.likelihoodScore.toFixed(3)} ≥ threshold ${threshold})`,
  );

  // Mark as duplicate and link under the parent.
  await prisma.report.update({
    where: { id: reportId },
    data: {
      isDuplicate: true,
      duplicateOfId: best.id,
      status: ReportStatus.DUPLICATE,
    },
  });

  // The parent just gained a supporting duplicate — its priority score
  // should reflect the increased number of affected citizens.
  await recalculatePriorityScore(best.id);
}
