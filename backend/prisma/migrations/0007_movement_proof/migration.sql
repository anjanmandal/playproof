-- Movement Coach verification support
PRAGMA foreign_keys=OFF;

ALTER TABLE "MovementAssessment" ADD COLUMN "verdict" TEXT;
ALTER TABLE "MovementAssessment" ADD COLUMN "verdictReason" TEXT;
ALTER TABLE "MovementAssessment" ADD COLUMN "viewQuality" TEXT;
ALTER TABLE "MovementAssessment" ADD COLUMN "baselineBand" TEXT;
ALTER TABLE "MovementAssessment" ADD COLUMN "bandUncertainty0to1" REAL;
ALTER TABLE "MovementAssessment" ADD COLUMN "microPlan" TEXT;

CREATE TABLE "_MovementAssessment_new" (
  "id" TEXT PRIMARY KEY,
  "athleteId" TEXT NOT NULL,
  "sessionId" TEXT,
  "drillType" TEXT NOT NULL,
  "riskRating" INTEGER NOT NULL,
  "cues" TEXT NOT NULL,
  "metrics" TEXT NOT NULL,
  "context" TEXT,
  "rawModelOutput" TEXT,
  "verdict" TEXT,
  "verdictReason" TEXT,
  "viewQuality" TEXT,
  "baselineBand" TEXT,
  "bandUncertainty0to1" REAL,
  "microPlan" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MovementAssessment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "_MovementAssessment_new" ("id", "athleteId", "sessionId", "drillType", "riskRating", "cues", "metrics", "context", "rawModelOutput", "verdict", "verdictReason", "viewQuality", "baselineBand", "bandUncertainty0to1", "microPlan", "createdAt", "updatedAt")
SELECT "id", "athleteId", "sessionId", "drillType", "riskRating", "cues", "metrics", "context", "rawModelOutput", "verdict", "verdictReason", "viewQuality", "baselineBand", "bandUncertainty0to1", "microPlan", "createdAt", "updatedAt"
FROM "MovementAssessment";

DROP TABLE "MovementAssessment";
ALTER TABLE "_MovementAssessment_new" RENAME TO "MovementAssessment";

CREATE TABLE "MovementProof" (
  "id" TEXT PRIMARY KEY,
  "assessmentId" TEXT NOT NULL,
  "athleteId" TEXT NOT NULL,
  "drillType" TEXT NOT NULL,
  "verdict" TEXT NOT NULL,
  "verdictReason" TEXT,
  "withinBand" BOOLEAN,
  "bandDelta" TEXT,
  "viewQualityScore" REAL,
  "viewQualityLabel" TEXT,
  "cue" TEXT,
  "metrics" TEXT,
  "baselineBand" TEXT,
  "uncertainty0to1" REAL,
  "proofAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "microPlan" TEXT,
  "fixAssigned" BOOLEAN NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MovementProof_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "MovementAssessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "MovementProof_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "MovementProof_assessmentId_key" UNIQUE ("assessmentId")
);

CREATE INDEX "MovementProof_athleteId_proofAt_idx" ON "MovementProof" ("athleteId", "proofAt");
CREATE INDEX "MovementProof_drillType_idx" ON "MovementProof" ("drillType");

PRAGMA foreign_keys=ON;
