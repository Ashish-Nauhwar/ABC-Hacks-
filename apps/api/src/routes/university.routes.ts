import { Router } from "express";
import { ChallengeDomain } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authenticate";

import { mockUniversities, mockCities } from "../lib/mockData";

export const universityRouter = Router();

universityRouter.use(authenticate);

universityRouter.get("/", async (req, res) => {
  const { domain, cityId } = req.query;

  const domainFilter =
    typeof domain === "string" && Object.values(ChallengeDomain).includes(domain as ChallengeDomain)
      ? (domain as ChallengeDomain)
      : undefined;
  const cityFilter = typeof cityId === "string" ? cityId : undefined;

  if (process.env.DEMO_MODE === "true") {
    let list = mockUniversities.map((u) => ({
      ...u,
      city: mockCities.find((c) => c.id === u.cityId),
    }));
    if (domainFilter) {
      list = list.filter((u) => u.specializations.includes(domainFilter));
    }
    if (cityFilter) {
      list = list.filter((u) => u.cityId === cityFilter);
    }
    return res.json({ universities: list });
  }

  try {
    const universities = await prisma.university.findMany({
      where: {
        ...(domainFilter ? { specializations: { has: domainFilter } } : {}),
        ...(cityFilter ? { cityId: cityFilter } : {}),
      },
      include: { city: true },
      orderBy: { name: "asc" },
    });

    res.json({ universities });
  } catch (error) {
    console.warn("Universities DB query failed, falling back to mock data:", error);
    let list = mockUniversities.map((u) => ({
      ...u,
      city: mockCities.find((c) => c.id === u.cityId),
    }));
    if (domainFilter) {
      list = list.filter((u) => u.specializations.includes(domainFilter));
    }
    if (cityFilter) {
      list = list.filter((u) => u.cityId === cityFilter);
    }
    return res.json({ universities: list });
  }
});


universityRouter.get("/:id", async (req, res) => {
  const university = await prisma.university.findUnique({
    where: { id: String(req.params.id) },
    include: { city: true },
  });

  if (!university) {
    return res.status(404).json({ error: "University not found" });
  }

  res.json({ university });
});
