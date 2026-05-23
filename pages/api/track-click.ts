import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";
import { trackAffiliateClick } from "@/lib/clickTracking";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const click = await trackAffiliateClick({
      req,
      payload: req.body,
      userId: session?.user?.id || undefined
    });

    return res.status(201).json({ id: click.id, createdAt: click.createdAt });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid click payload" });
    }

    return res.status(400).json({
      error: error instanceof Error ? error.message : "Click tracking failed"
    });
  }
}
