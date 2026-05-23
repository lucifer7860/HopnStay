import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const wishlistSchema = z.object({
  hotelId: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireSession(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const items = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: { hotel: true },
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const parsed = wishlistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid wishlist payload" });
    }

    const hotel = await prisma.hotel.findUnique({ where: { id: parsed.data.hotelId } });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel must be present in the catalog before it can be saved" });
    }

    const item = await prisma.wishlist.upsert({
      where: {
        userId_hotelId: {
          userId: session.user.id,
          hotelId: parsed.data.hotelId
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        hotelId: parsed.data.hotelId
      },
      include: { hotel: true }
    });

    return res.status(201).json({ item });
  }

  if (req.method === "DELETE") {
    const parsed = wishlistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid wishlist payload" });
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: session.user.id,
        hotelId: parsed.data.hotelId
      }
    });

    return res.status(204).end();
  }

  res.setHeader("Allow", "GET,POST,DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
