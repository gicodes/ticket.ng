"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTickets = exports.completeTicket = exports.updateTicket = exports.createTicket = void 0;
const prisma_1 = require("../../lib/prisma");
const createTicket = async (req, res) => {
    try {
        const { title, description, createdById } = req.body;
        const ticket = await prisma_1.prisma.ticket.create({
            data: { title, description, createdById }
        });
        res.json(ticket);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create ticket" });
    }
};
exports.createTicket = createTicket;
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assignedToId, status } = req.body;
        const ticket = await prisma_1.prisma.ticket.update({
            where: { id: Number(id) },
            data: { title, description, assignedToId, status }
        });
        res.json(ticket);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update ticket" });
    }
};
exports.updateTicket = updateTicket;
const completeTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await prisma_1.prisma.ticket.update({
            where: { id: Number(id) },
            data: { status: "CLOSED" }
        });
        res.json(ticket);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to mark ticket as complete" });
    }
};
exports.completeTicket = completeTicket;
const getAllTickets = async (res) => {
    try {
        const allTickets = await prisma_1.prisma.ticket.findMany();
        res.json(allTickets);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
};
exports.getAllTickets = getAllTickets;
