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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // TODO: add structured logging + error taxonomy
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export { app };
