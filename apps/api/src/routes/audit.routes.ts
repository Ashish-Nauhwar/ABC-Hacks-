import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authenticate";
import { requireRole, requireScope } from "../middleware/rbac";

import { mockReports } from "../lib/mockData";

export const auditRouter = Router();

const STAFF_ROLES: UserRole[] = [
  UserRole.UNIVERSITY_ADMIN,
  UserRole.GOVERNMENT_ADMIN,
  UserRole.SUPER_ADMIN,
];

auditRouter.use(authenticate);

function getMockAuditEvents() {
  const events = [];
  for (const r of mockReports) {
    if (r.statusEvents) {
      for (const ev of r.statusEvents) {
        events.push({
          ...ev,
          report: {
            id: r.id,
            description: r.description,
            domain: r.domain,
            status: r.status,
          },
        });
      }
    }
  }
  return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

auditRouter.get("/", requireRole(...STAFF_ROLES), requireScope(), async (req, res) => {
  const limitParam = req.query.limit;
  const limit = Math.min(
    200,
    Math.max(1, typeof limitParam === "string" ? Number(limitParam) || 100 : 100),
  );

  if (process.env.DEMO_MODE === "true") {
    return res.json({ events: getMockAuditEvents().slice(0, limit) });
  }

  try {
    const events = await prisma.reportStatusEvent.findMany({
      where: { report: req.scope },
      include: {
        changedBy: { select: { id: true, name: true, role: true } },
        report: { select: { id: true, description: true, domain: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.json({ events });
  } catch (error) {
    console.warn("Audit events DB query failed, falling back to mock data:", error);
    res.json({ events: getMockAuditEvents().slice(0, limit) });
  }
});

