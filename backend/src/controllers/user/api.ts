import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userProfile = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!userProfile) {
      return res.status(404).json({
        ok: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      ok: true,
      data: userProfile,
      message: "User profile fetched successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch user profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ ok: false, message: "Invalid user ID" });
    }

    const allowedFields = [
      "name",
      "bio",
      "phone",
      "country",
      "position",
      "organization",
      "industry",
      "teamSize",
      "website",
      "photo",
      "logo",
    ];

    const filteredData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) filteredData[key] = data[key];
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: filteredData,
    });

    res.status(200).json({
      ok: true,
      data: updatedUser,
      message: "User profile updated successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "Failed to update user profile",
    });
  }
};