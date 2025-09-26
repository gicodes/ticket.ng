import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { generateEmailToken } from "../../auth/api";
import { sendEmail } from "../../../lib/sendEmail";
import { composeEmailTemplate } from "../../../lib/emailTemp";

export const inviteTeamMember = async (req: Request, res: Response) => {
  try {
    const { email, teamId, invitedById } = req.body;

    const token = generateEmailToken(invitedById);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days

    await prisma.invitation.create({
      data: {
        email,
        teamId,
        invitedById,
        token,
        expiresAt
      }
    }); 

    await sendEmail({
      to: email,
      subject: "Join Your Team on TicTask",
      html: composeEmailTemplate({
        subject: "Join Your Team on TicTask",
        bodyHtml: `
          <p>Hello,</p>
          <p>You’ve been invited to join your team on <b>TicTask</b>.</p>
          <a href="${process.env.FRONTEND_URL}/team/invite/${token}" class="button">
            Accept Invitation
          </a>
          <p>If you didn’t expect this invitation, you can safely ignore this email.</p>
        `,
      }),
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const acceptInvite = async (req: Request, res: Response) => {
  try {
    const { token, userId } = req.body;

    const invite = await prisma.invitation.findUnique({ where: { token } });

    if (!invite || invite.accepted || invite.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired invitation' });
    }

    await prisma.teamMember.create({
      data: {
        userId,
        teamId: invite.teamId,
        role: 'MEMBER',
        invitedBy: invite.invitedById
      }
    });

    await prisma.invitation.update({
      where: { id: invite.id },
      data: { accepted: true }
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}