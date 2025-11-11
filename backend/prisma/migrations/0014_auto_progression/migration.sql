CREATE TABLE "AthletePlanProgress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "athleteId" TEXT NOT NULL UNIQUE,
  "capacityIndex" INTEGER NOT NULL DEFAULT 60,
  "consecutiveAGrades" INTEGER NOT NULL DEFAULT 0,
  "lastProgressionAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE
);
CREATE INDEX "AthletePlanProgress_athleteId_idx" ON "AthletePlanProgress" ("athleteId");
