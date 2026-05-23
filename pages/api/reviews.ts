import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const createReviewSchema = z.object({
  hotelId: z.string().min(1),
  rating: z.number().int().min(1).max(10),
  title: z.string().min(3).max(120),
  comment: z.string().min(10).max(2000)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const hotelId = typeof req.query.hotelId === "string" ? req.query.hotelId : undefined;
    if (!hotelId) return res.status(400).json({ error: "hotelId is required" });

    const reviews = await prisma.review.findMany({
      where: { hotelId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    });

    return res.status(200).json({ reviews });
  }

  if (req.method === "POST") {
    const session = await requireSession(req, res);
    if (!session) return;

    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid review payload" });
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        hotelId: parsed.data.hotelId,
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        status: "PENDING"
      }
    });

    return res.status(201).json({ review });
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed" });
}
