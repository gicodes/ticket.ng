"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshCookie = exports.cookieOptions = exports.verifyRefresh = exports.verifyAccess = exports.signRefresh = exports.signAccess = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
const ACCESS_TTL = process.env.JWT_ACCESS_TTL || "15m";
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || "30d";
const signAccess = (payload) => jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
exports.signAccess = signAccess;
const signRefresh = (payload) => {
    const jti = crypto_1.default.randomUUID();
    const token = jsonwebtoken_1.default.sign({ ...payload, jti }, REFRESH_SECRET, {
        expiresIn: REFRESH_TTL,
    });
    const { exp } = jsonwebtoken_1.default.decode(token);
    return { token, jti, exp: new Date(exp * 1000) };
};
exports.signRefresh = signRefresh;
const verifyAccess = (token) => jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
exports.verifyAccess = verifyAccess;
const verifyRefresh = (token) => jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
exports.verifyRefresh = verifyRefresh;
const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAME_SITE || "strict",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
});
exports.cookieOptions = cookieOptions;
const setRefreshCookie = (res, token) => {
    res.cookie("refresh_token", token, {
        ...(0, exports.cookieOptions)(),
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });
};
exports.setRefreshCookie = setRefreshCookie;
