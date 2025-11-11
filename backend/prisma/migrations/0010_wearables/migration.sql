-- CreateTable
CREATE TABLE "WearableDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT,
    "type" TEXT NOT NULL,
    "side" TEXT,
    "fwVersion" TEXT,
    "lastSeenAt" DATETIME,
    "nickname" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WearableSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "deviceIds" TEXT,
    "drillType" TEXT NOT NULL,
    "surface" TEXT,
    "tempF" INTEGER,
    "humidityPct" INTEGER,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WearableFeature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "windowTs" DATETIME NOT NULL,
    "contactMs" INTEGER,
    "stabilityMs" INTEGER,
    "valgusIdx0to3" INTEGER,
    "asymmetryPct" REAL,
    "yawSpike" REAL,
    "confidence0to1" REAL,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WearableFeature_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WearableSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WearableDevice_athleteId_idx" ON "WearableDevice"("athleteId");

-- CreateIndex
CREATE INDEX "WearableSession_athleteId_idx" ON "WearableSession"("athleteId");

-- CreateIndex
CREATE INDEX "WearableSession_startedAt_idx" ON "WearableSession"("startedAt");

-- CreateIndex
CREATE INDEX "WearableFeature_sessionId_idx" ON "WearableFeature"("sessionId");
