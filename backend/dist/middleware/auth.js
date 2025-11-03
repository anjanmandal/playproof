"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = exports.authenticate = void 0;
const authService_1 = require("../services/authService");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }
    const [, token] = authHeader.split(" ");
    if (!token) {
        return res.status(401).json({ error: "Invalid Authorization header" });
    }
    try {
        const payload = (0, authService_1.verifyToken)(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            athleteId: payload.athleteId ?? undefined,
        };
        next();
    }
    catch (error) {
        console.error("Auth error", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
const requireRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
    }
    return next();
};
exports.requireRoles = requireRoles;
//# sourceMappingURL=auth.js.map