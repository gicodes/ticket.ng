"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jwt_1 = require("../lib/jwt");
const requireAuth = (req, res, next) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token)
        return res.status(401).json({ message: "Missing token" });
    try {
        const payload = (0, jwt_1.verifyAccess)(token);
        req.auth = { userId: payload.sub, role: payload.role };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => (req, res, next) => {
    const role = req.auth?.role;
    if (!role || !roles.includes(role))
        return res.status(403).json({ message: "Forbidden" });
    next();
};
exports.requireRole = requireRole;
