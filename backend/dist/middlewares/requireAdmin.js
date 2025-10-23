"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const jwt_1 = require("../lib/jwt");
const requireAdmin = (req, res, next) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token)
        return res.status(401).json({ message: "Missing token" });
    try {
        const payload = (0, jwt_1.verifyAccess)(token);
        if (payload.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: admin only" });
        }
        req.auth = payload;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.requireAdmin = requireAdmin;
