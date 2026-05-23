import { getAffiliateAnalytics } from "@/services/affiliateAnalytics";

describe("affiliateAnalytics", () => {
  it("returns total clicks, grouped clicks, and estimated value", async () => {
    process.env.ESTIMATED_VALUE_PER_CLICK = "5";
    const prismaClient = {
      affiliateClick: {
        count: vi.fn(async () => 3),
        groupBy: vi
          .fn()
          .mockResolvedValueOnce([{ provider: "mock", _count: { _all: 2 } }, { provider: "travelpayouts", _count: { _all: 1 } }])
          .mockResolvedValueOnce([{ hotelId: "h1", hotelName: "Hotel One", _count: { _all: 2 } }]),
        findMany: vi.fn(async () => [
          {
            id: "click_1",
            hotelId: "h1",
            hotelName: "Hotel One",
            provider: "mock",
            source: "search",
            createdAt: new Date("2026-05-20T10:00:00Z")
          }
        ])
      },
      $queryRaw: vi.fn(async () => [{ day: new Date(), clicks: 3n }])
    } as any;

    const analytics = await getAffiliateAnalytics(prismaClient);

    expect(analytics.totalClicks).toBe(3);
    expect(analytics.clicksByProvider[0]).toEqual({ provider: "mock", clicks: 2 });
    expect(analytics.clicksByHotel[0]).toEqual({ hotelId: "h1", hotelName: "Hotel One", clicks: 2 });
    expect(analytics.estimatedAffiliateValue).toMatchObject({ label: "Estimated only", amount: 15 });
  });
});
