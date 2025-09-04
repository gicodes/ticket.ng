import { Router } from "express";
import { 
  createTicket, 
  updateTicket, 
  completeTicket 
} from "../../controllers/tickets/api";

const router = Router();

router.post("/", createTicket);
router.put("/:id", updateTicket);
router.put("/:id/complete", completeTicket);

// .delete (for admin only)
// .get /analytics (for admin only)

export default router;