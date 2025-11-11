-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'push',
    "payload" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "lastError" TEXT,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Notification_athleteId_idx" ON "Notification"("athleteId");

-- AlterTable
ALTER TABLE "RiskSnapshot" ADD COLUMN "sourcePlanId" TEXT;
ALTER TABLE "RiskSnapshot" ADD COLUMN "sourceSimulationId" TEXT;

-- CreateIndex
CREATE INDEX "RiskSnapshot_sourcePlanId_idx" ON "RiskSnapshot"("sourcePlanId");
CREATE INDEX "RiskSnapshot_sourceSimulationId_idx" ON "RiskSnapshot"("sourceSimulationId");
