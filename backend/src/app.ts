import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { healthRouter } from "./routes/health";
import { assessmentRouter } from "./routes/assessments";
import { riskRouter } from "./routes/risk";
import { rehabRouter } from "./routes/rehab";
import { audienceRouter } from "./routes/audience";
import { authRouter } from "./routes/auth";
import { mediaRouter } from "./routes/media";
import { athleteRouter } from "./routes/athletes";
import { mediaRoot } from "./config/storage";
import { plannerRouter } from "./routes/planner";
import { wearableRouter } from "./routes/wearables";
import { env } from "./config/env";
import { notificationRouter } from "./routes/notifications";
import { homeSessionRouter } from "./routes/homeSession";
import { edgeCoachRouter } from "./routes/edgeCoach";
import { caseChannelRouter } from "./routes/caseChannel";
import { evidenceRouter } from "./routes/evidence";
import { researchRouter } from "./routes/research";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? ["*"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(mediaRoot));

app.use("/auth", authRouter);
app.use("/media", mediaRouter);
app.use("/health", healthRouter);
app.use("/assessments", assessmentRouter);
app.use("/risk", riskRouter);
app.use("/rehab", rehabRouter);
app.use("/audience", audienceRouter);
app.use("/athletes", athleteRouter);
app.use("/planner", plannerRouter);
app.use("/notifications", notificationRouter);
app.use("/home", homeSessionRouter);
app.use("/edge-coach", edgeCoachRouter);
app.use("/case-channel", caseChannelRouter);
app.use("/evidence", evidenceRouter);
app.use("/research", researchRouter);
if (env.WEARABLES_ENABLED && env.WEARABLES_MODE !== "off") {
  app.use("/wearables", wearableRouter);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // TODO: add structured logging + error taxonomy
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export { app };
