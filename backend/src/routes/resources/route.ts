import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { createBlog, createFAQ, deleteBlog, deleteFAQs, deleteUpdates, getUpdates, pushUpdates, readBlogs, readFAQs } from "../../controllers/resources/api";

const router = Router();

router.get("/faq", readFAQs);
router.post("/faq", createFAQ);
router.delete("/faq", deleteFAQs);

router.get("/blog", readBlogs);
router.post("/blog", requireAuth, createBlog);
router.delete("/blog", requireAuth, deleteBlog);

router.get("/changelog", getUpdates)
router.post("/changelog", requireAdmin, pushUpdates);
router.delete("/changelog", requireAdmin, deleteUpdates)

export default router;