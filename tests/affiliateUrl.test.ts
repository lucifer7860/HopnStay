import { buildAffiliateUrl, validateAffiliateUrl } from "@/lib/affiliateUrl";

describe("affiliateUrl", () => {
  it("rejects unsafe and non-HTTPS URLs", () => {
    expect(validateAffiliateUrl("")).toMatchObject({ isValid: false });
    expect(validateAffiliateUrl("javascript:alert(1)")).toMatchObject({ isValid: false });
    expect(validateAffiliateUrl("data:text/html,hi")).toMatchObject({ isValid: false });
    expect(validateAffiliateUrl("http://example.com/deal")).toMatchObject({ isValid: false });
    expect(validateAffiliateUrl("not a url")).toMatchObject({ isValid: false });
  });

  it("preserves query params and adds Travelpayouts marker", () => {
    const result = buildAffiliateUrl("https://example.com/deal?hotel=42&currency=INR", {
      provider: "travelpayouts",
      marker: "affiliate_123"
    });

    expect(result.isValid).toBe(true);
    const parsed = new URL(result.url!);
    expect(parsed.searchParams.get("hotel")).toBe("42");
    expect(parsed.searchParams.get("currency")).toBe("INR");
    expect(parsed.searchParams.get("marker")).toBe("affiliate_123");
  });
});
