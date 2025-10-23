"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const hashPassword = (plain) => bcryptjs_1.default.hash(plain, 12);
exports.hashPassword = hashPassword;
const comparePassword = (plain, hash) => bcryptjs_1.default.compare(plain, hash);
exports.comparePassword = comparePassword;
const hashToken = async (t) => crypto_1.default.createHash("sha256").update(t, "utf8").digest("hex");
exports.hashToken = hashToken;
