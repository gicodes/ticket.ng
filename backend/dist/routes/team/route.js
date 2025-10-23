"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("../../controllers/team/invite/api");
const router = (0, express_1.Router)();
router.post("/invite", api_1.inviteTeamMember);
router.post("/accept-invite", api_1.acceptInvite);
exports.default = router;
