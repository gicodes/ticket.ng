"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("../../controllers/tickets/api");
const router = (0, express_1.Router)();
router.post("/", api_1.createTicket);
router.put("/:id", api_1.updateTicket);
router.put("/:id/complete", api_1.completeTicket);
// .delete (for admin only)
// .get /analytics (for admin only)
exports.default = router;
