"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.athleteRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const athleteController_1 = require("../controllers/athleteController");
exports.athleteRouter = (0, express_1.Router)();
exports.athleteRouter.use(auth_1.authenticate);
exports.athleteRouter.get("/", athleteController_1.getAthletes);
exports.athleteRouter.get("/:athleteId", athleteController_1.getAthleteDetail);
//# sourceMappingURL=athletes.js.map