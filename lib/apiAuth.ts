import type { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return session;
}

export async function requireRole(req: NextApiRequest, res: NextApiResponse, role: Role) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id || session.user.role !== role) {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return session;
}
