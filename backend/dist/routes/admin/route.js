"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("../../controllers/admin/api");
const requireAdmin_1 = require("../../middlewares/requireAdmin");
const router = express_1.default.Router();
router.post("/cleanup", requireAdmin_1.requireAdmin, api_1.cleanupDevData);
exports.default = router;
