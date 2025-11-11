CREATE TABLE "CaseEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "athleteId" TEXT NOT NULL,
  "team" TEXT,
  "eventType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "trustGrade" TEXT,
  "role" TEXT NOT NULL,
  "actorId" TEXT,
  "actorName" TEXT,
  "pinned" INTEGER NOT NULL DEFAULT 0,
  "nextAction" TEXT,
  "attachments" TEXT,
  "metadata" TEXT,
  "mentions" TEXT,
  "consentFlag" TEXT,
  "visibility" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CaseEvent_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "CaseEvent_athleteId_createdAt_idx" ON "CaseEvent" ("athleteId", "createdAt");
CREATE INDEX "CaseEvent_team_createdAt_idx" ON "CaseEvent" ("team", "createdAt");
