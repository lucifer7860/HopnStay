import type { NextApiRequest, NextApiResponse } from "next";
import { requireSession } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireSession(req, res);
  if (!session) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clicks = await prisma.affiliateClick.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      hotelId: true,
      hotelName: true,
      provider: true,
      source: true,
      createdAt: true
    }
  });

  return res.status(200).json({ clicks });
}
