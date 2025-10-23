"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailToken = exports.generateEmailToken = exports.logout = exports.refresh = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
const auth_schema_1 = require("../../validators/auth.schema");
const crypto_1 = require("../../lib/crypto");
const jwt_1 = require("../../lib/jwt");
const login = async (req, res) => {
    // console.warn("Login attempt from IP:", req.ip);
    try {
        const { email, password } = auth_schema_1.loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(423).json({ message: "Account temporarily locked" });
        }
        const ok = await (0, crypto_1.comparePassword)(password, user.password);
        if (!ok) {
            const failedLogins = user.failedLogins + 1;
            let lockedUntil = null;
            if (failedLogins >= 5) {
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { failedLogins, lockedUntil }
            });
            return res.status(401).json({ message: "Invalid credentials" });
        }
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { failedLogins: 0,
                lockedUntil: null
            }
        });
        const access = (0, jwt_1.signAccess)({ sub: user.id, role: user.role });
        const { token: refresh, jti, exp } = (0, jwt_1.signRefresh)({ sub: user.id });
        await prisma_1.prisma.refreshToken.create({
            data: {
                jti,
                userId: user.id,
                hashedToken: await (0, crypto_1.hashToken)(refresh),
                expiresAt: exp,
                ip: req.ip,
                userAgent: req.headers["user-agent"] || undefined,
            }
        });
        (0, jwt_1.setRefreshCookie)(res, refresh);
        res.status(201).json({
            ok: true,
            accessToken: access,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user?.name,
                photo: user.photo,
            }
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(400).json({ message: "Invalid request" });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    const raw = req.cookies?.refresh_token;
    if (!raw)
        return res.status(401).json({ message: "Missing refresh token" });
    const payload = (0, jwt_1.verifyRefresh)(raw);
    const record = await prisma_1.prisma.refreshToken.findUnique({ where: { jti: payload.jti } });
    if (!record)
        return res.status(401).json({ message: "Unknown token" });
    if (record.revokedAt || record.usedAt || record.expiresAt < new Date()) {
        return res.status(401).json({ message: "Token no longer valid" });
    }
    await prisma_1.prisma.refreshToken.update({
        where: { jti: payload.jti },
        data: { usedAt: new Date() }
    });
    const access = (0, jwt_1.signAccess)({ sub: payload.sub, role: payload.role });
    const { token: newRefresh, jti, exp } = (0, jwt_1.signRefresh)({ sub: payload.sub, role: payload.role });
    await prisma_1.prisma.refreshToken.create({
        data: {
            jti,
            userId: payload.sub,
            hashedToken: await (0, crypto_1.hashToken)(newRefresh),
            expiresAt: exp,
            ip: req.ip,
            userAgent: req.headers["user-agent"] || undefined,
        }
    });
    (0, jwt_1.setRefreshCookie)(res, newRefresh);
    res.json({ accessToken: access });
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const raw = req.cookies?.refresh_token;
    if (raw) {
        const payload = (0, jwt_1.verifyRefresh)(raw);
        await prisma_1.prisma.refreshToken.update({
            where: { jti: payload.jti },
            data: { revokedAt: new Date() }
        });
    }
    res.clearCookie("refresh_token", (0, jwt_1.cookieOptions)());
    res.status(204).send();
};
exports.logout = logout;
const generateEmailToken = (userId) => {
    return jsonwebtoken_1.default.sign({ sub: userId }, process.env.JWT_EMAIL_SECRET, { expiresIn: "1d" });
};
exports.generateEmailToken = generateEmailToken;
const verifyEmailToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_EMAIL_SECRET);
};
exports.verifyEmailToken = verifyEmailToken;
