import { Router } from "express";
import { 
  createTicket, 
  updateTicket, 
  completeTicket, 
  getUserTicket,
  getAllTickets
} from "../../controllers/tickets/api";

const router = Router();

router.post("/", createTicket);
router.patch("/:id", updateTicket);
router.put("/:id/complete", completeTicket);

router.get("/", getAllTickets)
router.get("/:id", getUserTicket);

// .get /analytics (for org only)
// .delete (for admin only)

export default router;