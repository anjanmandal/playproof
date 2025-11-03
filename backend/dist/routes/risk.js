"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskRouter = void 0;
const express_1 = require("express");
const riskController_1 = require("../controllers/riskController");
const auth_1 = require("../middleware/auth");
exports.riskRouter = (0, express_1.Router)();
exports.riskRouter.use(auth_1.authenticate);
exports.riskRouter.post("/", riskController_1.postDailyRisk);
exports.riskRouter.get("/athlete/:athleteId", riskController_1.getRiskHistory);
exports.riskRouter.patch("/:snapshotId/acknowledge", riskController_1.acknowledgeRisk);
//# sourceMappingURL=risk.js.map