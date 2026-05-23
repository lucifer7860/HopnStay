import { hashIp, trackAffiliateClick } from "@/lib/clickTracking";

describe("clickTracking", () => {
  it("creates an IP hash", () => {
    const hash = hashIp("203.0.113.10", "test-salt");
    expect(hash).toHaveLength(64);
    expect(hash).not.toContain("203.0.113.10");
  });

  it("stores hashed IP data without raw IP", async () => {
    const create = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: "click_1", createdAt: new Date(), ...data }));
    const prismaClient = {
      affiliateClick: { create }
    } as any;

    await trackAffiliateClick({
      req: {
        headers: {
          "x-forwarded-for": "203.0.113.10",
          "user-agent": "vitest",
          referer: "https://hopnstay.test/search"
        },
        socket: {}
      } as any,
      payload: {
        hotelId: "mock_bengaluru_circuit_stay",
        hotelName: "Circuit Stay Bengaluru",
        provider: "mock",
        bookingUrl: "https://partners.example.com/bangalore/circuit-stay",
        source: "unit-test",
        searchContext: { city: "Bangalore" }
      },
      prismaClient
    });

    const data = create.mock.calls[0][0].data;
    expect(data.ipHash).toHaveLength(64);
    expect(data.ip).toBeUndefined();
    expect(JSON.stringify(data)).not.toContain("203.0.113.10");
  });
});
