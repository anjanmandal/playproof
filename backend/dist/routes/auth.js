"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", authController_1.postRegister);
exports.authRouter.post("/login", authController_1.postLogin);
exports.authRouter.get("/me", auth_1.authenticate, authController_1.getProfile);
//# sourceMappingURL=auth.js.map