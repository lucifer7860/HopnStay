import { subDays } from "date-fns";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ClickRow = {
  id: string;
  hotelId: string;
  hotelName: string | null;
  provider: string;
  source: string | null;
  createdAt: Date;
};

function estimatedValuePerClick() {
  const parsed = Number(process.env.ESTIMATED_VALUE_PER_CLICK ?? "5");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export async function getAffiliateAnalytics(prismaClient: PrismaClient = prisma) {
  const since = subDays(new Date(), 30);
  const [totalClicks, providerGroups, hotelGroups, recentClicks, dayRows] = await Promise.all([
    prismaClient.affiliateClick.count(),
    prismaClient.affiliateClick.groupBy({
      by: ["provider"],
      _count: { _all: true },
      orderBy: { _count: { provider: "desc" } }
    }),
    prismaClient.affiliateClick.groupBy({
      by: ["hotelId", "hotelName"],
      _count: { _all: true },
      orderBy: { _count: { hotelId: "desc" } },
      take: 10
    }),
    prismaClient.affiliateClick.findMany({
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
    }),
    prismaClient.$queryRaw<Array<{ day: Date; clicks: bigint }>>`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::bigint AS clicks
      FROM "AffiliateClick"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `
  ]);

  const clicksByProvider = providerGroups.map((group) => ({
    provider: group.provider,
    clicks: group._count._all
  }));

  const clicksByHotel = hotelGroups.map((group) => ({
    hotelId: group.hotelId,
    hotelName: group.hotelName,
    clicks: group._count._all
  }));

  const clicksByDay = Array.from({ length: 30 }, (_, index) => {
    const date = subDays(new Date(), 29 - index);
    const key = date.toISOString().slice(0, 10);
    const match = dayRows.find((row) => row.day.toISOString().slice(0, 10) === key);
    return {
      date: key,
      clicks: match ? Number(match.clicks) : 0
    };
  });

  return {
    totalClicks,
    clicksByProvider,
    clicksByHotel,
    recentClicks: (recentClicks as ClickRow[]).map((click) => ({
      id: click.id,
      hotelId: click.hotelId,
      hotelName: click.hotelName,
      provider: click.provider,
      source: click.source,
      createdAt: click.createdAt
    })),
    clicksByDay,
    topHotels: clicksByHotel,
    topProviders: clicksByProvider,
    estimatedAffiliateValue: {
      label: "Estimated only",
      currency: "USD",
      amount: totalClicks * estimatedValuePerClick()
    }
  };
}
