import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireRole } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const hotelSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2).default("India"),
  address: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  starRating: z.number().int().min(1).max(5),
  averageRating: z.number().min(0).max(10).default(8),
  reviewCount: z.number().int().nonnegative().default(0),
  latitude: z.number().default(0),
  longitude: z.number().default(0),
  distanceFromCenterKm: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  provider: z.string().default("manual"),
  externalProviderId: z.string().optional(),
  bookingUrl: z.string().url().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, "ADMIN");
  if (!session) return;

  if (req.method === "GET") {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        rooms: true,
        _count: { select: { reviews: true, wishlists: true } }
      }
    });
    return res.status(200).json({ hotels });
  }

  if (req.method === "POST") {
    const parsed = hotelSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid hotel payload" });
    }

    const hotel = await prisma.hotel.create({
      data: {
        ...parsed.data,
        slug: slugify(parsed.data.name)
      }
    });

    return res.status(201).json({ hotel });
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed" });
}
