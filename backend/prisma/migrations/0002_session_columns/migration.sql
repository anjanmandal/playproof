ALTER TABLE "MovementAssessment"
ADD COLUMN "sessionId" TEXT;

ALTER TABLE "RiskSnapshot"
ADD COLUMN "recordedFor" DATETIME;

ALTER TABLE "RehabAssessment"
ADD COLUMN "sessionDate" DATETIME;
