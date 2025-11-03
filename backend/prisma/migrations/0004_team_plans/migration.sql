CREATE TABLE "TeamPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team" TEXT NOT NULL,
    "sessionDate" DATETIME,
    "sessionLength" INTEGER NOT NULL,
    "constraints" TEXT,
    "selectedTweaks" TEXT,
    "compiledPlan" TEXT,
    "audit" TEXT,
    "appliedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
