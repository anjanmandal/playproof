-- CreateTable
CREATE TABLE "CyclePrivacySetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "shareScope" TEXT NOT NULL DEFAULT 'OFF',
    "lastSharedPhase" TEXT,
    "lastSharedConfidence" TEXT,
    "lastSharedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CyclePrivacySetting_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CyclePrivacySetting_athleteId_key" ON "CyclePrivacySetting"("athleteId");

-- CreateTable
CREATE TABLE "CycleShareLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "confidenceBucket" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CycleShareLog_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CycleShareLog_athleteId_createdAt_idx" ON "CycleShareLog"("athleteId", "createdAt");
