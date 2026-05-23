import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireRole } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  shortDescription: z.string().optional(),
  bookingUrl: z.string().url().nullable().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  starRating: z.number().int().min(1).max(5).optional(),
  averageRating: z.number().min(0).max(10).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, "ADMIN");
  if (!session) return;

  const id = typeof req.query.id === "string" ? req.query.id : undefined;
  if (!id) return res.status(400).json({ error: "Hotel id is required" });

  if (req.method === "GET") {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { rooms: true, reviews: true, wishlists: true }
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    return res.status(200).json({ hotel });
  }

  if (req.method === "PATCH") {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid hotel update payload" });
    }

    const hotel = await prisma.hotel.update({
      where: { id },
      data: parsed.data
    });
    return res.status(200).json({ hotel });
  }

  if (req.method === "DELETE") {
    await prisma.hotel.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", "GET,PATCH,DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
