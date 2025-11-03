"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentRouter = void 0;
const express_1 = require("express");
const assessmentController_1 = require("../controllers/assessmentController");
const auth_1 = require("../middleware/auth");
exports.assessmentRouter = (0, express_1.Router)();
exports.assessmentRouter.use(auth_1.authenticate);
exports.assessmentRouter.post("/", assessmentController_1.postMovementAssessment);
exports.assessmentRouter.get("/athlete/:athleteId", assessmentController_1.getAthleteAssessments);
exports.assessmentRouter.get("/:assessmentId", assessmentController_1.getAssessmentDetail);
//# sourceMappingURL=assessments.js.map