"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvite = exports.inviteTeamMember = void 0;
const prisma_1 = require("../../../lib/prisma");
const api_1 = require("../../auth/api");
const sendEmail_1 = require("../../../lib/sendEmail");
const emailTemp_1 = require("../../../lib/emailTemp");
const inviteTeamMember = async (req, res) => {
    try {
        const { email, teamId, invitedById } = req.body;
        const token = (0, api_1.generateEmailToken)(invitedById);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days
        await prisma_1.prisma.invitation.create({
            data: {
                email,
                teamId,
                invitedById,
                token,
                expiresAt
            }
        });
        await (0, sendEmail_1.sendEmail)({
            to: email,
            subject: "Join Your Team on TicTask",
            html: (0, emailTemp_1.composeEmailTemplate)({
                subject: "Join Your Team on TicTask",
                title: "You're Invited to Join a Team on TicTask!",
                subtitle: "Click the link below to accept the invitation",
                body1: `
          <p>Hello,</p>
          <p>You have been invited to join a team on TicTask. Click the button below to accept the invitation and get started:</p>
          <a href="${process.env.FRONTEND_URL}/accept-invite?token=${token}">
            Accept Invitation →
          </a>
        `,
                body2: `
          <p>If you did not expect this invitation, you can safely ignore this email.</p>
        `,
                closingRemark: `
          <p>Goodluck!,<br/>The TicTask Team</p>
        `
            }),
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.inviteTeamMember = inviteTeamMember;
const acceptInvite = async (req, res) => {
    try {
        const { token, userId } = req.body;
        const invite = await prisma_1.prisma.invitation.findUnique({ where: { token } });
        if (!invite || invite.accepted || invite.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired invitation' });
        }
        await prisma_1.prisma.teamMember.create({
            data: {
                userId,
                teamId: invite.teamId,
                role: 'MEMBER',
                invitedBy: invite.invitedById
            }
        });
        await prisma_1.prisma.invitation.update({
            where: { id: invite.id },
            data: { accepted: true }
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.acceptInvite = acceptInvite;
