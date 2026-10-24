import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authenticate";

import { mockCities } from "../lib/mockData";

export const cityRouter = Router();

cityRouter.use(authenticate);

cityRouter.get("/", async (_req, res) => {
  if (process.env.DEMO_MODE === "true") {
    return res.json({ cities: mockCities });
  }

  try {
    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
    res.json({ cities });
  } catch (error) {
    console.warn("Cities DB query failed, falling back to mock data:", error);
    res.json({ cities: mockCities });
  }
});

