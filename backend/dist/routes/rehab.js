"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rehabRouter = void 0;
const express_1 = require("express");
const rehabController_1 = require("../controllers/rehabController");
const auth_1 = require("../middleware/auth");
exports.rehabRouter = (0, express_1.Router)();
exports.rehabRouter.use(auth_1.authenticate);
exports.rehabRouter.post("/", rehabController_1.postRehabAssessment);
exports.rehabRouter.get("/athlete/:athleteId", rehabController_1.getRehabHistory);
exports.rehabRouter.get("/:rehabAssessmentId", rehabController_1.getRehabDetail);
//# sourceMappingURL=rehab.js.map