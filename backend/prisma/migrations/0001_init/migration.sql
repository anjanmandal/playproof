CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "athleteId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "jerseyNumber" TEXT,
    "sport" TEXT,
    "position" TEXT,
    "team" TEXT,
    "sex" TEXT,
    "dateOfBirth" DATETIME,
    "heightCm" REAL,
    "weightKg" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AthleteContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AthleteContact_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "MovementAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "drillType" TEXT NOT NULL,
    "riskRating" INTEGER NOT NULL,
    "cues" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "context" TEXT,
    "rawModelOutput" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MovementAssessment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "MovementFrame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "snapshotUrl" TEXT NOT NULL,
    "label" TEXT,
    "capturedAt" DATETIME NOT NULL,
    "frameIndex" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MovementFrame_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "MovementAssessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RiskSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "exposureMinutes" INTEGER NOT NULL,
    "surface" TEXT NOT NULL,
    "temperatureF" REAL NOT NULL,
    "humidityPct" REAL NOT NULL,
    "priorLowerExtremityInjury" BOOLEAN NOT NULL,
    "sorenessLevel" INTEGER NOT NULL,
    "fatigueLevel" INTEGER NOT NULL,
    "bodyWeightTrend" TEXT,
    "menstrualPhase" TEXT,
    "notes" TEXT,
    "riskLevel" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "changeToday" TEXT NOT NULL,
    "rawModelOutput" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recommendationAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "RiskSnapshot_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "RehabAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "surgicalSide" TEXT NOT NULL,
    "limbSymmetryScore" REAL NOT NULL,
    "cleared" BOOLEAN NOT NULL,
    "concerns" TEXT NOT NULL,
    "recommendedExercises" TEXT NOT NULL,
    "athleteSummary" TEXT NOT NULL,
    "parentSummary" TEXT NOT NULL,
    "clinicianNotes" TEXT NOT NULL,
    "rawModelOutput" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RehabAssessment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "RehabVideo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rehabAssessmentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "capturedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RehabVideo_rehabAssessmentId_fkey" FOREIGN KEY ("rehabAssessmentId") REFERENCES "RehabAssessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "focusArea" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Intervention_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "MovementAssessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AudienceRewrite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT,
    "sourceMessage" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "tone" TEXT,
    "rewritten" TEXT NOT NULL,
    "rawModelOutput" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
