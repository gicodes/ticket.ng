import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, createdById } = req.body;
    const ticket = await prisma.ticket.create({
      data: { title, description, createdById }
    });
    res.status(201).json({ message: "Ticket Created", ticket});
  } catch (err) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, assignedToId, status } = req.body;
    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { title, description, assignedToId, status }
    });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

export const completeTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { status: "CLOSED" }
    });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark ticket as complete" });
  }
};

export const getAllTickets = async (res: Response) => {
  try {
    const allTickets = await prisma.ticket.findMany();
    res.json(allTickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
}