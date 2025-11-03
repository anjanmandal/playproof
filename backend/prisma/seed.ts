import bcrypt from "bcryptjs";
import { Prisma, PrismaClient, Role } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const teams = [
  { id: "varsity_football", name: "Varsity Football", coachEmail: "coach.football@example.com" },
  { id: "varsity_soccer", name: "Varsity Girls Soccer", coachEmail: "coach.soccer@example.com" },
];

const athletes = [
  {
    id: "rb-12",
    displayName: "RB #12",
    sport: "Football",
    position: "Running Back",
    team: teams[0].id,
    sex: "female",
    riskPreset: "high",
  },
  {
    id: "qb-5",
    displayName: "QB #5",
    sport: "Football",
    position: "Quarterback",
    team: teams[0].id,
    sex: "male",
    riskPreset: "moderate",
  },
  {
    id: "mf-10",
    displayName: "MF #10",
    sport: "Soccer",
    position: "Midfielder",
    team: teams[1].id,
    sex: "female",
    riskPreset: "moderate",
  },
  {
    id: "df-3",
    displayName: "DF #3",
    sport: "Soccer",
    position: "Defender",
    team: teams[1].id,
    sex: "female",
    riskPreset: "low",
  },
];

const users = [
  ...teams.map((team) => ({
    email: team.coachEmail,
    password: "coach123",
    role: Role.COACH,
    teams: [team.id],
  })),
  {
    email: "athletic.trainer@example.com",
    password: "trainer123",
    role: Role.AT_PT,
  },
  ...athletes.map((athlete) => ({
    email: `${athlete.id.replace(/[^a-z0-9]/gi, "")}@example.com`.toLowerCase(),
    password: "player123",
    role: Role.ATHLETE,
    athleteId: athlete.id,
  })),
];

const riskPreset = {
  high: {
    riskLevel: "red",
    riskTrend: "up",
    uncertainty0to1: 0.44,
    driverScores: { heat_index: 0.78, fatigue_load: 0.66, video_valgus: 0.72 },
    drivers: ["Heat stress conditions", "Fatigue load", "Video: valgus collapse detected"],
    changeToday:
      "Move warmup indoors; cut cutting volume −15%; add 2×8 drop-jump stick sequence before team install.",
    microPlan: {
      phase: "frontal_plane_control",
      expectedMinutes: 6,
      progression: "build",
      drills: [
        { name: "Drop-jump stick", sets: 2, reps: 8, rest_s: 45 },
        { name: "Lateral bound hold", sets: 2, reps: 6, rest_s: 40 },
      ],
    },
    counterfactual: {
      tweak: "Reduce cutting 15%",
      predicted_risk_drop: 0.21,
      next_rep_verify: true,
      summary: "Skill-group tempo routes lower valgus load while keeping timing sharp.",
    },
    policyFlags: ["cooling_breaks_15m", "indoor_priority"],
    cohortPercentile0to100: 88,
    viewConfidence: 0.58,
  },
  moderate: {
    riskLevel: "yellow",
    riskTrend: "flat",
    uncertainty0to1: 0.28,
    driverScores: { fatigue_load: 0.48, prior_injury: 0.55 },
    drivers: ["Fatigue load", "Prior lower-extremity injury history"],
    changeToday: "Add neuromuscular prep and cap high-speed reps at 10; monitor landing cues first drill.",
    microPlan: {
      phase: "landing_control",
      expectedMinutes: 5,
      progression: "maintain",
      drills: [{ name: "Single-leg tempo step-down", sets: 2, reps: 6, rest_s: 35 }],
    },
    counterfactual: {
      tweak: "Add neuromuscular warmup",
      predicted_risk_drop: 0.12,
      next_rep_verify: false,
      summary: "Priming mechanics before position work smooths landing quality.",
    },
    policyFlags: ["turf_load_monitor"],
    cohortPercentile0to100: 54,
    viewConfidence: 0.66,
  },
  low: {
    riskLevel: "green",
    riskTrend: "down",
    uncertainty0to1: 0.18,
    driverScores: { load: 0.22 },
    drivers: ["Standard workload profile"],
    changeToday: "Maintain plan but spot-check first-sided drill for adherence to cues.",
    microPlan: {
      phase: "landing_control",
      expectedMinutes: 4,
      progression: "maintain",
      drills: [{ name: "Glute bridge holds", sets: 2, reps: 8, rest_s: 30 }],
    },
    counterfactual: {
      tweak: "Maintain plan",
      predicted_risk_drop: 0.04,
      next_rep_verify: false,
      summary: "Low-risk athlete; keep reinforcing positive mechanics.",
    },
    policyFlags: [],
    cohortPercentile0to100: 22,
    viewConfidence: 0.81,
  },
} as const;

async function main() {
  const athleteIds = athletes.map((athlete) => athlete.id);

  await prisma.riskSnapshot.deleteMany({ where: { athleteId: { in: athleteIds } } });
  await prisma.riskFeatureCache.deleteMany({ where: { athleteId: { in: athleteIds } } });

  for (const athlete of athletes) {
    const { riskPreset: presetKey, ...athleteData } = athlete as {
      riskPreset: keyof typeof riskPreset;
      id: string;
      displayName: string;
      sport: string;
      position?: string;
      team?: string;
      sex?: string;
    };
    const {
      riskLevel,
      riskTrend,
      uncertainty0to1,
      driverScores,
      drivers,
      changeToday,
      microPlan,
      counterfactual,
      policyFlags,
      cohortPercentile0to100,
      viewConfidence,
    } = riskPreset[presetKey];

    await prisma.athlete.upsert({
      where: { id: athleteData.id },
      update: athleteData,
      create: athleteData,
    });

    const snapshotId = `risk-${athleteData.id}`;
    await prisma.riskSnapshot.upsert({
      where: { id: snapshotId },
      update: {
        exposureMinutes: riskLevel === "red" ? 75 : 55,
        surface: "turf",
        temperatureF: 94,
        humidityPct: 68,
        priorLowerExtremityInjury: driverScores.prior_injury ? true : false,
        sorenessLevel: riskLevel === "red" ? 2 : 1,
        fatigueLevel: riskLevel === "red" ? 2 : 1,
        bodyWeightTrend: "stable",
        menstrualPhase: athleteData.sex === "female" ? "luteal" : null,
        notes: riskLevel === "red" ? "Back-to-back intense sessions." : null,
        recordedFor: new Date(),
        riskLevel,
        riskTrend,
        uncertainty0to1,
        rationale: drivers.join(" • "),
        changeToday,
        driverScores,
        drivers,
        microPlan,
        environmentPolicyFlags: policyFlags,
        cohortPercentile0to100,
        adherence0to1: 0,
        nextRepCheck: {
          required: riskLevel !== "green",
          received: false,
          result: null,
        },
        rawModelOutput: JSON.stringify({
          seed: true,
          drivers,
          driver_scores: driverScores,
        }),
        recommendationAcknowledged: false,
      },
      create: {
        id: snapshotId,
        athleteId: athleteData.id,
        exposureMinutes: riskLevel === "red" ? 75 : 55,
        surface: "turf",
        temperatureF: 94,
        humidityPct: 68,
        priorLowerExtremityInjury: driverScores.prior_injury ? true : false,
        sorenessLevel: riskLevel === "red" ? 2 : 1,
        fatigueLevel: riskLevel === "red" ? 2 : 1,
        bodyWeightTrend: "stable",
        menstrualPhase: athleteData.sex === "female" ? "luteal" : null,
        notes: riskLevel === "red" ? "Back-to-back intense sessions." : null,
        recordedFor: new Date(),
        riskLevel,
        riskTrend,
        uncertainty0to1,
        rationale: drivers.join(" • "),
        changeToday,
        driverScores,
        drivers,
        microPlan,
        environmentPolicyFlags: policyFlags,
        cohortPercentile0to100,
        adherence0to1: 0,
        nextRepCheck: {
          required: riskLevel !== "green",
          received: false,
          result: null,
        },
        rawModelOutput: JSON.stringify({
          seed: true,
          drivers,
          driver_scores: driverScores,
        }),
        recommendationAcknowledged: false,
      },
    });

    await prisma.riskFeatureCache.upsert({
      where: { athleteId: athleteData.id },
      update: {
        features: {
          last_video_valgus_score_0_3: driverScores.video_valgus ? Math.round(driverScores.video_valgus * 3) : 1,
          trunk_lean_flag: driverScores.video_trunk ? true : false,
          risk_rating_0_3: riskLevel === "red" ? 3 : riskLevel === "yellow" ? 2 : 1,
          view_confidence_0_1: viewConfidence,
          counterfactual_tweak: counterfactual.tweak,
          predicted_risk_drop: counterfactual.predicted_risk_drop,
        } as Prisma.InputJsonValue,
      },
      create: {
        athleteId: athleteData.id,
        features: {
          last_video_valgus_score_0_3: driverScores.video_valgus ? Math.round(driverScores.video_valgus * 3) : 1,
          trunk_lean_flag: driverScores.video_trunk ? true : false,
          risk_rating_0_3: riskLevel === "red" ? 3 : riskLevel === "yellow" ? 2 : 1,
          view_confidence_0_1: viewConfidence,
          counterfactual_tweak: counterfactual.tweak,
          predicted_risk_drop: counterfactual.predicted_risk_drop,
        } as Prisma.InputJsonValue,
      },
    });
  }

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash, role: user.role, athleteId: user.athleteId },
      create: {
        email: user.email,
        passwordHash,
        role: user.role,
        athleteId: user.athleteId,
      },
    });

    if (user.role === Role.COACH) {
      await prisma.coachTeam.deleteMany({ where: { coachId: record.id } });
      const teamIds = user.teams ?? [];
      if (teamIds.length) {
        await prisma.coachTeam.createMany({
          data: teamIds.map((teamId) => ({ coachId: record.id, teamId })),
        });
      }
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
