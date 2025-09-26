import { Router } from "express";
import { acceptInvite, inviteTeamMember } from "../../controllers/team/invite/api";

const router = Router();

router.post("/invite", inviteTeamMember);
router.post("/accept-invite", acceptInvite);

export default router;