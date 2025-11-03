-- CreateTable
CREATE TABLE "MovementOverlay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "overlayType" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "severity" TEXT,
    "bandStatus" TEXT,
    "metrics" TEXT,
    "visualization" TEXT,
    "beforeImageUrl" TEXT,
    "afterImageUrl" TEXT,
    "comparisonLabel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MovementOverlay_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "MovementAssessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "MovementOverlay_assessmentId_idx" ON "MovementOverlay"("assessmentId");

-- CreateIndex
CREATE INDEX "MovementOverlay_overlayType_idx" ON "MovementOverlay"("overlayType");
