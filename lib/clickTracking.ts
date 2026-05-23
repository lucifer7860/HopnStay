import crypto from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest } from "next";
import { z } from "zod";
import { validateAffiliateUrl } from "./affiliateUrl";
import { prisma } from "./prisma";

export const clickPayloadSchema = z.object({
  hotelId: z.string().min(1),
  hotelName: z.string().min(1).optional(),
  provider: z.string().min(1),
  bookingUrl: z.string().min(1),
  source: z.string().max(120).optional(),
  searchContext: z.record(z.unknown()).optional()
});

export type ClickPayload = z.infer<typeof clickPayloadSchema>;

export function getClientIp(req: Pick<NextApiRequest, "headers" | "socket">) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  const direct = req.headers["x-real-ip"];
  const socketIp = req.socket?.remoteAddress;
  return String(firstForwarded || direct || socketIp || "").trim();
}

export function hashIp(ip: string | undefined, salt = process.env.CLICK_TRACKING_SALT) {
  const usableSalt =
    salt && salt.length >= 8
      ? salt
      : process.env.NODE_ENV === "production"
        ? ""
        : "dev-click-tracking-salt";

  if (!ip || !usableSalt) {
    return undefined;
  }

  return crypto.createHash("sha256").update(`${usableSalt}:${ip}`).digest("hex");
}

export async function trackAffiliateClick({
  req,
  payload,
  userId,
  prismaClient = prisma
}: {
  req: Pick<NextApiRequest, "headers" | "socket">;
  payload: unknown;
  userId?: string;
  prismaClient?: PrismaClient;
}) {
  const parsed = clickPayloadSchema.parse(payload);
  const safeUrl = validateAffiliateUrl(parsed.bookingUrl);

  if (!safeUrl.isValid || !safeUrl.url) {
    throw new Error(safeUrl.reason || "Invalid affiliate URL");
  }

  const ipHash = hashIp(getClientIp(req));

  return prismaClient.affiliateClick.create({
    data: {
      userId,
      hotelId: parsed.hotelId,
      hotelName: parsed.hotelName,
      provider: parsed.provider,
      bookingUrl: safeUrl.url,
      source: parsed.source,
      searchContext: parsed.searchContext as Prisma.InputJsonValue | undefined,
      userAgent: Array.isArray(req.headers["user-agent"])
        ? req.headers["user-agent"].join(", ")
        : req.headers["user-agent"],
      referrer: Array.isArray(req.headers.referer) ? req.headers.referer[0] : req.headers.referer,
      ipHash
    }
  });
}
