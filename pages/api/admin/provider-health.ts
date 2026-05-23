import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "@/lib/apiAuth";
import { getProviderHealth } from "@/services/providerHealth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, "ADMIN");
  if (!session) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const health = await getProviderHealth();
  return res.status(200).json(health);
}
