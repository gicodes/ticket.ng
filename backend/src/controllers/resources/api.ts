import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { slugify } from "../../lib/slugify";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { title, excerpt, content, coverImage, status } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: "Title and content required" });

    const baseSlug = slugify
      ? slugify(title)
      : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = baseSlug;
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) slug = `${baseSlug}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status: status || "published",
        authorId: user?.id || null,
      },
    });

    res.status(201).json({ message: "Blog Created", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const readBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Blog ID required" });

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Author or admin check
    const isAdmin = user?.roles?.includes?.("admin");
    if (blog.authorId !== user?.id && !isAdmin)
      return res.status(403).json({ error: "Unauthorized" });

    await prisma.blog.delete({ where: { id } });
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

export const pushUpdates = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { version, date, highlights } = req.body;
    if (!version || !date || !Array.isArray(highlights))
      return res.status(400).json({ error: "Invalid fields" });

    const update = await prisma.changelog.create({
      data: {
        version,
        date: new Date(date),
        highlights,
        createdById: user?.id || null,
      },
    });

    res.status(201).json({ message: "Changelog created", update });
  } catch (err) {
    res.status(500).json({ error: "Failed to create changelog" });
  }
};

export const getUpdates = async (_req: Request, res: Response) => {
  try {
    const updates = await prisma.changelog.findMany({
      orderBy: { date: "desc" },
    });
    res.json({ success: true, data: updates });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch updates" });
  }
};

export const deleteUpdates = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID required" });

    await prisma.changelog.delete({ where: { id } });
    res.json({ success: true, message: "Changelog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete changelog" });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer, faqId, user } = req.body;
    if (question && !faqId) {
      const faq = await prisma.fAQ.create({
        data: {
          question,
          answer: answer ?? '',
          createdById: user?.id || null,
        },
      });
      return res.status(201).json({ message: "Question submitted", faq });
    }

    if (answer && faqId) {
      if (!user) return res.status(401).json({ error: "Login required to answer" });

      const faq = await prisma.fAQ.update({
        where: { id: Number(faqId) },
        data: { 
          answer,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({ message: "Answer added", faq });
    }

    return res.status(400).json({ error: "Invalid FAQ payload" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create or update FAQ" });
  }
};

export const readFAQs = async (_req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

export const deleteFAQs = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.fAQ.delete({ where: { id } });
    res.status(200).json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};