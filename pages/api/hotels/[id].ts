import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getHotelDetailsWithMeta } from "@/services/hotelProvider";

const paramsSchema = z.object({
  id: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = paramsSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid hotel id" });
  }

  const result = await getHotelDetailsWithMeta(parsed.data.id);
  if (!result.data) {
    return res.status(404).json({ error: "Hotel not found" });
  }

  return res.status(200).json(result);
}
