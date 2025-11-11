/* eslint-disable no-console */
import { argv, exit } from "process";
import { env } from "../config/env";

interface SimArgs {
  athlete: string;
  drill: string;
  minutes: number;
  side: "left" | "right";
  landingLoad: "low" | "med" | "high";
  medLatNoise: number;
  fatigueDrift: number;
  apiBase: string;
}

const parseArgs = (): SimArgs => {
  const defaults: SimArgs = {
    athlete: "athlete-sim",
    drill: "drop_jump",
    minutes: 3,
    side: "left",
    landingLoad: "med",
    medLatNoise: 0.2,
    fatigueDrift: 0.85,
    apiBase: process.env.SIM_API_BASE_URL ?? "http://localhost:4000",
  };

  const handlers: Record<string, (value: string, state: SimArgs) => void> = {
    "--athlete": (value, state) => {
      state.athlete = value;
    },
    "--drill": (value, state) => {
      state.drill = value;
    },
    "--minutes": (value, state) => {
      const minutes = Number(value);
      if (Number.isFinite(minutes)) {
        state.minutes = Math.max(1, minutes);
      }
    },
    "--side": (value, state) => {
      state.side = value === "right" ? "right" : "left";
    },
    "--load": (value, state) => {
      state.landingLoad = value === "low" || value === "high" ? value : "med";
    },
    "--noise": (value, state) => {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        state.medLatNoise = numeric;
      }
    },
    "--fatigue": (value, state) => {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        state.fatigueDrift = numeric;
      }
    },
    "--api": (value, state) => {
      state.apiBase = value;
    },
  };

  const next = { ...defaults };
  for (let i = 2; i < argv.length; i += 2) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (!flag || !value) continue;
    const handler = handlers[flag];
    if (!handler) continue;
    handler(value, next);
  }

  return next;
};

interface WearableSample {
  ts: number;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  side?: "left" | "right";
}

const generateWindow = (
  baseTs: number,
  options: { landingLoad: "low" | "med" | "high"; medLatNoise: number; fatigue: number; side: "left" | "right" },
): { windowTs: string; side: "left" | "right"; samples: WearableSample[] } => {
  const samples: WearableSample[] = [];
  const intervalMs = 16;
  const magnitudeBase = options.landingLoad === "high" ? 22 : options.landingLoad === "low" ? 15 : 18;
  const lateralBase = options.medLatNoise;
  const fatigueFactor = options.fatigue;

  for (let i = 0; i < 128; i += 1) {
    const ts = baseTs + i * intervalMs;
    const phase = i / 12;
    const landingImpulse = magnitudeBase + Math.sin(phase) * 3;
    const decay = Math.exp(-i / (45 + fatigueFactor * 30));
    const ax = 9.8 + landingImpulse * decay;
    const ay = (Math.sin(phase * 1.5) + Math.cos(phase / 2)) * lateralBase * 5;
    const az = 1.2 * Math.cos(phase * 0.8) * decay;
    const gx = 15 * Math.sin(phase * 1.2) * decay;
    const gy = 12 * Math.cos(phase * 0.9) * decay;
    const gz = 18 * Math.sin(phase * 0.6) * (1 + lateralBase * 0.5);

    samples.push({
      ts,
      ax,
      ay: options.side === "left" ? ay : ay * 0.85,
      az,
      gx,
      gy,
      gz,
      side: options.side,
    });
  }

  return {
    windowTs: new Date(baseTs).toISOString(),
    side: options.side,
    samples,
  };
};

const postJson = async (url: string, body: unknown) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request to ${url} failed (${response.status}): ${text}`);
  }
  return response.json().catch(() => ({}));
};

const main = async () => {
  const args = parseArgs();
  if (!env.WEARABLES_ENABLED || env.WEARABLES_MODE === "off") {
    console.error("Wearables feature flag is disabled; enable WEARABLES_ENABLED to run simulator.");
    exit(1);
  }

  console.log(`Starting wearable simulator for athlete ${args.athlete} (${args.side})`);

  const sessionResponse = await postJson(`${args.apiBase}/wearables/session`, {
    athleteId: args.athlete,
    drillType: args.drill,
    deviceIds: [`sim-${args.side}`],
    surface: "turf",
    tempF: 78,
    humidityPct: 55,
    devices: [
      { id: `sim-${args.side}`, type: "imu", side: args.side, nickname: `${args.side}-imu` },
    ],
  });

  const sessionId = sessionResponse.sessionId as string;
  if (!sessionId) {
    throw new Error("Failed to create wearable session.");
  }
  console.log(`Session created: ${sessionId}`);

  const totalWindows = Math.max(3, Math.round((args.minutes * 60) / 2));
  let currentTs = Date.now();

  for (let i = 0; i < totalWindows; i += 1) {
    const fatigueFactor = 0.85 + (i / totalWindows) * args.fatigueDrift;
    const window = generateWindow(currentTs, {
      landingLoad: args.landingLoad,
      medLatNoise: args.medLatNoise,
      fatigue: fatigueFactor,
      side: args.side,
    });

    await postJson(`${args.apiBase}/wearables/${sessionId}/samples`, {
      windows: [window],
    });

    currentTs += 128 * 16;
  }

  await postJson(`${args.apiBase}/wearables/${sessionId}/flush`, {});
  console.log(`Wearable session ${sessionId} flushed.`);

  const featureResponse = await fetch(`${args.apiBase}/wearables/${sessionId}/features`);
  if (featureResponse.ok) {
    const payload = await featureResponse.json();
    const features = payload.features ?? [];
    console.log(`Collected ${features.length} feature windows.`);
  } else {
    console.warn("Unable to fetch computed features.");
  }
};

main().catch((error) => {
  console.error(error);
  exit(1);
});
