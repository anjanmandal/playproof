CREATE TABLE "HomeSessionProof" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "athleteId" TEXT NOT NULL,
  "blockKey" TEXT NOT NULL,
  "clipUrl" TEXT NOT NULL,
  "sessionDate" DATETIME NOT NULL,
  "minutes" INTEGER,
  "metadata" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HomeSessionProof_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "HomeSessionProof_athleteId_sessionDate_idx" ON "HomeSessionProof" ("athleteId", "sessionDate");
CREATE UNIQUE INDEX "HomeSessionProof_athleteId_blockKey_sessionDate_key" ON "HomeSessionProof" ("athleteId", "blockKey", "sessionDate");
