import { getHotelDetailsWithMeta, searchHotelsWithMeta } from "@/services/hotelProvider";
import { parseTravelpayoutsHotelId } from "@/services/providers/travelpayoutsProvider";

describe("hotelProvider", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("uses mock provider when Travelpayouts is disabled", async () => {
    process.env.TRAVELPAYOUTS_ENABLED = "false";
    const result = await searchHotelsWithMeta({ city: "Bangalore" });
    expect(result.provider).toBe("mock");
    expect(result.fallbackUsed).toBe(true);
    expect(result.data.some((hotel) => hotel.slug === "circuit-stay-bengaluru")).toBe(true);
  });

  it("falls back to mock provider when Travelpayouts is enabled but not configured", async () => {
    process.env.TRAVELPAYOUTS_ENABLED = "true";
    process.env.TRAVELPAYOUTS_API_KEY = "";
    process.env.TRAVELPAYOUTS_AFFILIATE_MARKER = "";
    const result = await searchHotelsWithMeta({ city: "Goa" });
    expect(result.provider).toBe("mock");
    expect(result.fallbackUsed).toBe(true);
    expect(result.data[0]?.provider).toBe("mock");
  });

  it("falls back for malformed Travelpayouts IDs", async () => {
    process.env.TRAVELPAYOUTS_ENABLED = "true";
    const result = await getHotelDetailsWithMeta("travelpayouts_");
    expect(result.provider).toBe("mock");
    expect(result.data?.slug).toBe("seacliff-house-goa");
  });

  it("returns mock hotel detail by slug", async () => {
    const result = await getHotelDetailsWithMeta("seacliff-house-goa");
    expect(result.data?.name).toBe("Seacliff House Goa");
    expect(result.data?.rooms?.length).toBeGreaterThan(0);
  });

  it("parses new and old Travelpayouts IDs", () => {
    expect(parseTravelpayoutsHotelId("travelpayouts_12345")).toBe("12345");
    expect(parseTravelpayoutsHotelId("travelpayouts-12345")).toBe("12345");
    expect(parseTravelpayoutsHotelId("mock_12345")).toBeNull();
  });
});
