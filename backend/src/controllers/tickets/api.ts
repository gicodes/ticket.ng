import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { type, title, description, priority, assignTo, tags, createdById, dueDate } = req.body;
    console.log(req.body);
    const ticket = await prisma.ticket.create({
      data: {
        type,
        title,
        description,
        priority,
        tags,
        dueDate: new Date(dueDate),
        createdById,
        createdAt: new Date()
      }
    });
    res.status(201).json({ message: "Ticket Created", ticket});
  } catch (err) {
    console.error(err)
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

export const getUserTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tickets = await prisma.ticket.findMany({
      where: { createdById: Number(id) }
    })

    res.status(201).json({
      ok: true,
      message: "Fetched tickets successfully",
      tickets: tickets
    })
  }
  catch (err) {
    res.status(500).json({ error: "Failed to mark ticket as complete" });
  }
}