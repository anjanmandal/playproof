"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audienceRouter = void 0;
const express_1 = require("express");
const audienceController_1 = require("../controllers/audienceController");
const auth_1 = require("../middleware/auth");
exports.audienceRouter = (0, express_1.Router)();
exports.audienceRouter.use(auth_1.authenticate);
exports.audienceRouter.post("/", audienceController_1.postAudienceRewrite);
//# sourceMappingURL=audience.js.map