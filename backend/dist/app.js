"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const health_1 = require("./routes/health");
const assessments_1 = require("./routes/assessments");
const risk_1 = require("./routes/risk");
const rehab_1 = require("./routes/rehab");
const audience_1 = require("./routes/audience");
const auth_1 = require("./routes/auth");
const media_1 = require("./routes/media");
const athletes_1 = require("./routes/athletes");
const storage_1 = require("./config/storage");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? ["*"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use("/uploads", express_1.default.static(storage_1.mediaRoot));
app.use("/auth", auth_1.authRouter);
app.use("/media", media_1.mediaRouter);
app.use("/health", health_1.healthRouter);
app.use("/assessments", assessments_1.assessmentRouter);
app.use("/risk", risk_1.riskRouter);
app.use("/rehab", rehab_1.rehabRouter);
app.use("/audience", audience_1.audienceRouter);
app.use("/athletes", athletes_1.athleteRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    // TODO: add structured logging + error taxonomy
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});
//# sourceMappingURL=app.js.map