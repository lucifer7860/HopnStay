import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { searchHotelsWithMeta } from "@/services/hotelProvider";

const searchSchema = z.object({
  city: z.string().optional(),
  checkin: z.string().optional(),
  checkout: z.string().optional(),
  guests: z.coerce.number().int().positive().optional(),
  rooms: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  starRating: z.coerce.number().int().min(1).max(5).optional(),
  amenities: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const values = Array.isArray(value) ? value : value.split(",");
      return values.map((item) => item.trim()).filter(Boolean);
    }),
  sort: z.enum(["recommended", "price_asc", "price_desc", "rating_desc", "distance_asc"]).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = searchSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid hotel search parameters" });
  }

  const result = await searchHotelsWithMeta(parsed.data);
  return res.status(200).json(result);
}
