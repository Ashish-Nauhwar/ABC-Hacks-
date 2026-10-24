import { Router } from "express";
import { ChallengeDomain } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authenticate";

import { mockIndustryPartners } from "../lib/mockData";

export const industryPartnerRouter = Router();

industryPartnerRouter.use(authenticate);

industryPartnerRouter.get("/", async (req, res) => {
  const { domain } = req.query;

  const domainFilter =
    typeof domain === "string" && Object.values(ChallengeDomain).includes(domain as ChallengeDomain)
      ? (domain as ChallengeDomain)
      : undefined;

  if (process.env.DEMO_MODE === "true") {
    let list = [...mockIndustryPartners];
    if (domainFilter) {
      list = list.filter((p) => p.domains.includes(domainFilter));
    }
    return res.json({ partners: list });
  }

  try {
    const partners = await prisma.industryPartner.findMany({
      where: domainFilter ? { domains: { has: domainFilter } } : {},
      orderBy: { name: "asc" },
    });
    res.json({ partners });
  } catch (error) {
    console.warn("Industry partners DB query failed, falling back to mock data:", error);
    let list = [...mockIndustryPartners];
    if (domainFilter) {
      list = list.filter((p) => p.domains.includes(domainFilter));
    }
    res.json({ partners: list });
  }
});

