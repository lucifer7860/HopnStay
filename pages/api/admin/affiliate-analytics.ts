import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "@/lib/apiAuth";
import { getAffiliateAnalytics } from "@/services/affiliateAnalytics";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, "ADMIN");
  if (!session) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const analytics = await getAffiliateAnalytics();
  return res.status(200).json(analytics);
}
