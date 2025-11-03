import { Request, Response } from "express";
import { z } from "zod";
import {
  applyTeamPlan,
  getLatestTeamPlan,
  simulateTeamPlan,
} from "../services/plannerService";
import { TeamPlannerSimulationInput } from "../types/planner";

const blockConstraintSchema = z.object({
  name: z.string(),
  minMinutes: z.number().min(1),
  maxMinutes: z.number().min(1),
});

const simulationSchema = z.object({
  team: z.string().min(1),
  sessionLengthMinutes: z.number().min(15),
  sessionDate: z.string().optional(),
  blocks: z.array(blockConstraintSchema).min(1),
  facility: z.object({
    indoorAvailable: z.boolean(),
    surfacePreference: z.enum(["indoor", "turf", "grass"]).optional(),
  }),
  policy: z.object({
    hydrationIntervalMinutes: z.number().optional(),
    maxCuttingDensity: z.number().optional(),
    temperatureF: z.number().optional(),
    humidityPct: z.number().optional(),
  }),
  tweaks: z.array(z.string()).min(1),
  customTweak: z.string().optional(),
});

const applySchema = z.object({
  simulation: z.any(),
  selectedTweaks: z.array(z.string()).optional(),
});

export const postPlannerSimulation = async (req: Request, res: Response) => {
  const parsed = simulationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const simulation = await simulateTeamPlan(parsed.data as TeamPlannerSimulationInput);
  return res.json({ simulation });
};

export const postPlannerApply = async (req: Request, res: Response) => {
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const plan = await applyTeamPlan(
    {
      simulation: parsed.data.simulation,
      selectedTweaks: parsed.data.selectedTweaks ?? [],
    },
    req.user?.id,
  );

  return res.status(201).json({ plan });
};

export const getPlannerLatest = async (req: Request, res: Response) => {
  const team = req.query.team;
  if (typeof team !== "string" || !team.trim()) {
    return res.status(400).json({ error: "team query parameter is required" });
  }

  const plan = await getLatestTeamPlan(team.trim());
  if (!plan) {
    return res.status(404).json({ error: "No plan found for team" });
  }
  return res.json({ plan });
};
