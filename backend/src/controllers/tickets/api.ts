import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { TicketStatus } from "../../types/tickets";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { type, title, description, priority, assignTo, tags, createdById, dueDate } = req.body;
    const creator = await prisma.user.findUnique({ where: { id: createdById } });
    if (!creator) {
      return res.status(404).json({ ok: false, message: "No user found!" });
    }

    const assignedUser = assignTo
      ? await prisma.user.findUnique({ where: { email: assignTo } })
      : null;

    let status: TicketStatus = TicketStatus.OPEN;
    if (dueDate && new Date(dueDate) > new Date()) {
      status = TicketStatus.UPCOMING;
    }

    const ticket = await prisma.ticket.create({
      data: {
        type,
        title,
        description,
        priority,
        tags: tags ?? [],
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById,
        assignedToId: assignedUser?.id || null,
        status,
      },
      include: { assignedTo: true, createdBy: true },
    });
    return res.status(201).json({ ok: true, message: "Ticket created", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to create ticket" });
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
    console.log("hi")
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
    const tickets = await prisma.$queryRaw`
      SELECT * FROM "Ticket"
      WHERE "createdById" = ${Number(id)}
      ORDER BY
        CASE WHEN "dueDate" IS NULL THEN 1 ELSE 0 END,  -- dueDate NULLs last
        "dueDate" ASC,
        CASE "priority"
          WHEN 'URGENT' THEN 1
          WHEN 'HIGH' THEN 2
          WHEN 'MEDIUM' THEN 3
          WHEN 'LOW' THEN 4
          ELSE 5
        END,
        "createdAt" DESC;
    `;
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
