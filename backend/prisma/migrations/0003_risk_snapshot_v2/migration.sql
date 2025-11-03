-- Add new optional analytics fields to RiskSnapshot
ALTER TABLE "RiskSnapshot" ADD COLUMN "riskTrend" TEXT;
ALTER TABLE "RiskSnapshot" ADD COLUMN "uncertainty0to1" REAL;
ALTER TABLE "RiskSnapshot" ADD COLUMN "drivers" TEXT;
ALTER TABLE "RiskSnapshot" ADD COLUMN "driverScores" TEXT;
ALTER TABLE "RiskSnapshot" ADD COLUMN "microPlan" TEXT;
ALTER TABLE "RiskSnapshot" ADD COLUMN "adherence0to1" REAL;
ALTER TABLE "RiskSnapshot" ADD COLUMN "nextRepCheck" TEXT;
ALTER TABLE "RiskSnapshot" ADD COLUMN "cohortPercentile0to100" REAL;
ALTER TABLE "RiskSnapshot" ADD COLUMN "environmentPolicyFlags" TEXT;
