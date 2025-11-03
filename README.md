
# Playproof

AI-powered field tool that helps athletes and coaches **spot risks, personalize micro-plans, and verify improvements** in seconds—on the sideline or at home.

---
## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Stack](#stack)
- [Setup](#setup)
- [Configuration](#configuration)
- [Database](#database)
- [Run](#run)
- [API](#api)
- [Data Contracts](#data-contracts)
- [Front-End Pages](#front-end-pages)
- [Testing Guide](#testing-guide)
- [Security & Privacy](#security--privacy)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### 1) Daily Risk 2.0
- Log context (surface, heat, fatigue, menstrual phase, etc.).
- AI snapshot: **risk level**, **trend**, **uncertainty**, **driver scores**, **one change for today**.
- Inline **acknowledge/adherence** + history with color-coded chips.
- Team roster view with filters (risk/trend/confidence).

### 2) Movement Coach (verification loop)
- Record 3–5s; auto-pick key frames; instant **cue + verdict** (Pass / Fix / Retake / Needs-review).
- **Twin band** summary (inside/outside your personal range).
- **Quick Assign** a 5–8 min micro-plan; log **RPE** & **pain** completion.

### 3) Counterfactual Coach (team planner)
- Batch “what-ifs” (e.g., reduce cutting by 15%, move indoors, change work:rest).
- Returns **ranked session plan** and drill substitutions.

### 4) N-of-1 Movement Twin
- Per-athlete biomechanical baseline that updates from every clip/log.
- Exposes **baseline + drift** to personalize cues and risk priors.

---

## Architecture

> Repo layout (kept **inside this README** for quick reference):

```

playproof/
├─ backend/
│  ├─ prisma/                 # Schema & migrations
│  └─ src/
│     ├─ controllers/         # HTTP controllers (risk, assessments, planner)
│     ├─ routes/              # Express routers
│     ├─ services/            # riskService, assessmentService, plannerService
│     └─ types/               # Shared TS interfaces
└─ web/
└─ src/
├─ api/                 # Typed API clients (fetch wrappers)
├─ pages/
│  └─ dashboard/
│     ├─ RiskPage.tsx   # Daily Risk 2.0 UI
│     └─ MovementPage.tsx# Movement Coach UI
└─ types/               # UI-side types

````

**Data flow**
1. Coach enters context or captures clip.
2. Backend `riskService`/`assessmentService` calls AI (JSON-schema) with heuristics fallback.
3. Persist enriched snapshot (rationale, drivers, micro-plan, raw model payload) for audit.
4. Frontend renders status chips, explanations, micro-plan controls, and verification loop.

---

## Stack
- **Backend:** Node.js, Express, TypeScript, Prisma, SQLite/Postgres
- **Frontend:** React (Vite), TypeScript, Material UI
- **AI:** JSON-schema enforced responses (prod `gpt-4.1`, dev `gpt-4.1-mini`) with heuristic fallback
- **Extras:** Geolocation + Open-Meteo for env context; audit-friendly model I/O persistence

---

## Setup

```bash
# Clone & install
git clone https://github.com/your-org/playproof.git
cd playproof

# Install workspace deps
npm install --workspace backend
npm install --workspace web
````

---

## Configuration

Create **backend/.env**:

```bash
PORT=4000
DATABASE_URL="file:./dev.db"      # Or postgres://user:pass@host:5432/db
JWT_SECRET="dev-secret"

AI_PROVIDER_BASE_URL="https://api.openai.com/v1"
AI_API_KEY="sk-..."
AI_MODEL_MAIN="gpt-4.1"
AI_MODEL_LIGHT="gpt-4.1-mini"

MEDIA_PUBLIC_BASE_URL="http://localhost:4000/media"
```

Create **web/.env**:

```bash
VITE_API_BASE_URL="http://localhost:4000"
```

---

## Database

```bash
cd backend
npx prisma migrate dev
npx prisma generate
# optional
npm run seed
```

---

## Run

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd web
npm run dev

# Open the app
# http://localhost:5173
```

---

## API

> All endpoints expect JWT auth (Bearer token) unless noted.

### Risk

* **POST** `/risk`
  Generate a daily risk snapshot from coach context + AI/heuristics.
* **GET** `/risk/athlete/:id`
  Historical snapshots for an athlete.
* **PATCH** `/risk/:snapshotId/acknowledge`
  Mark snapshot as seen / update adherence.
* **GET** `/risk/team/:teamId`
  Latest enriched snapshot per athlete (roster grid).
* **POST** `/risk/simulate-batch`
  Run “what-if” tweaks across a roster → ranked session plan + drill subs.

### Movement / Assessments

* **POST** `/assessments`
  Score frames/clip; return cues, verdict, micro-plan, uncertainty, bands.
* **PATCH** `/assessments/:assessmentId/proof`
  Toggle **Quick Assign**, mark **completed**, log **RPE**/**pain**.
* **POST** `/risk/features/video`
  Sync video-derived features into the risk prior.

### Movement Twin

* **GET** `/athlete/:id/movement-twin`
  Baseline bands + drift deltas for N-of-1 personalization.

---

## Data Contracts

### Risk Snapshot (response excerpt)

```json
{
  "id": "snap_123",
  "athleteId": "ath_1",
  "createdAt": "2025-11-03T16:00:10Z",
  "riskLevel": 2,
  "trend": "up",
  "uncertainty0to1": 0.24,
  "drivers": [
    {"key": "heat_index", "score": 0.7},
    {"key": "fatigue", "score": 0.6}
  ],
  "policyFlags": ["heat_alert"],
  "changeToday": "Cut volume 15%, extend rest to 1:5",
  "rationale": "High humidity and elevated RPE; prior valgus trend.",
  "adherence": false
}
```

### Movement Assessment (response excerpt)

```json
{
  "id": "mv_456",
  "athleteId": "ath_1",
  "drillType": "drop_jump",
  "createdAt": "2025-11-03T16:05:00Z",
  "cues": ["Soft knee at contact", "Push knee out over mid-foot"],
  "verdict": "fix",
  "bandSummary": [
    {"metric": "knee_valgus_score", "status": "outside"}
  ],
  "uncertainty0to1": 0.18,
  "viewQuality": {"score0to1": 0.82, "retryRecommended": false},
  "microPlan": {
    "title": "5–8m Landing Control",
    "drills": [
      {"key": "snap_down", "reps": "3x5"},
      {"key": "lateral_bound_stick", "reps": "2x6/side"}
    ],
    "quickAssignAvailable": true,
    "completion": {"completed": false}
  },
  "proof": {
    "fixAssigned": true,
    "completed": false,
    "proofAt": "2025-11-03T16:05:05Z"
  }
}
```

### Simulate Batch (request/response)

**POST** `/risk/simulate-batch` (request)

```json
{
  "teamId": "team_99",
  "athletes": ["ath_1", "ath_2", "ath_3"],
  "tweaks": {
    "moveIndoors": true,
    "reduceCuttingPct": 15,
    "workRest": "1:5"
  }
}
```

**Response**

```json
{
  "originalTeamRisk": 1.92,
  "predictedTeamRisk": 1.41,
  "delta": -0.51,
  "rankedPlan": [
    {
      "athleteId": "ath_2",
      "predictedDrop": 0.33,
      "subs": ["replace_unplanned_cut_with_shadow_cutting"],
      "notes": "Heat + fatigue; reduce COD intensity today."
    }
  ]
}
```

---

## Front-End Pages

### `RiskPage.tsx`

* Roster filters: **risk**, **trend**, **confidence**.
* Chips: **trend**, **uncertainty**, **drivers**, **policy flags**, **change today**.
* **Adherence** toggle inline, history drawer per athlete.

### `MovementPage.tsx`

* Capture/upload → auto key frames.
* Verdict chips, view confidence, band status.
* **Quick Assign** → PATCH proof; **RPE/Pain** completion dialog.
* History list with cues and micro-plan badges.

---

## Testing Guide

### Smoke (local)

1. **Risk snapshot**

   * POST `/risk` with context; expect `riskLevel`, `changeToday`, `drivers`, `uncertainty0to1`.
2. **Athlete history**

   * GET `/risk/athlete/:id`; verify list & ordering.
3. **Acknowledge**

   * PATCH `/risk/:id/acknowledge` → `adherence: true`.
4. **Team roster**

   * GET `/risk/team/:teamId`; verify one latest per athlete.
5. **Simulate**

   * POST `/risk/simulate-batch`; inspect `delta` and `rankedPlan`.
6. **Movement assessment**

   * POST `/assessments` with frames; check `verdict`, `cues`, `microPlan`.
7. **Quick assign + completion**

   * PATCH `/assessments/:id/proof` with `{ "fixAssigned": true }`, then `{ "completed": true, "rpe": 4, "pain": 1 }`.

### UI checks

* Risk roster: filters work, chips render correctly, adherence toggles persist.
* Movement history: verdict/banner, view-confidence chip, quick-assign and completion dialog behave.

---

## Security & Privacy

* Store **raw model payloads** for audit; redact PII in logs.
* Role-based access (coach vs athlete); JWT short-lived tokens; HTTPS in prod.
* Media URLs signed/expiring where possible; allow deletion on request.

---

## Roadmap

* Team Planner optimizer v2 (multi-objective, facility constraints).
* Movement Twin calibration UI (baseline session wizard).
* Offline at-home mode (low-bandwidth media + SMS share).
* Cohort benchmarks & percentile trends.
* Coach notes → retrieval in future sessions.

---

## License

Copyright © 2025. All rights reserved.

```
```
