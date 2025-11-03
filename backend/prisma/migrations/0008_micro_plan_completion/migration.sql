-- Add completion tracking for movement micro plans
ALTER TABLE "MovementProof" ADD COLUMN "microPlanCompleted" BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE "MovementProof" ADD COLUMN "microPlanCompletedAt" DATETIME;
ALTER TABLE "MovementProof" ADD COLUMN "microPlanRpe" INTEGER;
ALTER TABLE "MovementProof" ADD COLUMN "microPlanPain" INTEGER;
