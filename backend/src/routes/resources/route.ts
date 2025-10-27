import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { createBlog, createFAQ, deleteBlog, deleteFAQs, deleteUpdates, getUpdates, pushUpdates, readBlogs, readFAQs } from "../../controllers/resources/api";

const router = Router();

router.get("/faq", readFAQs);
router.post("/faq", createFAQ);
router.delete("/faq", requireAdmin, deleteFAQs);

router.get("/blog", readBlogs);
router.post("/blog", createBlog);
router.delete("/blog", requireAdmin, deleteBlog);

router.get("/changelog", getUpdates)
router.post("/changelog", requireAdmin, pushUpdates);
router.delete("/changelog", requireAdmin, deleteUpdates)

export default router;