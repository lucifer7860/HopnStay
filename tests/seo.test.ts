import { buildAffiliateUrl } from "@/lib/affiliateUrl";
import { getBreadcrumbJsonLd, getHotelJsonLd, getSearchMetadata } from "@/lib/seo";
import { mockHotels } from "@/lib/mock-data";

describe("seo", () => {
  it("creates city-aware search metadata", () => {
    const metadata = getSearchMetadata("Bangalore");
    expect(metadata.title).toBe("Compare hotels in Bangalore | HopnStay");
    expect(metadata.description).toContain("Bangalore");
  });

  it("creates generic search metadata", () => {
    const metadata = getSearchMetadata();
    expect(metadata.title).toBe("Compare hotel prices | HopnStay");
    expect(metadata.description).toBe("Search and compare hotel deals from trusted travel partners.");
  });

  it("creates hotel and breadcrumb structured data", () => {
    const hotelJsonLd = getHotelJsonLd(mockHotels[0]);
    const breadcrumb = getBreadcrumbJsonLd([
      { name: "Home", url: "https://example.com" },
      { name: mockHotels[0].name, url: "https://example.com/hotels/seacliff-house-goa" }
    ]);

    expect(hotelJsonLd["@type"]).toBe("Hotel");
    expect(hotelJsonLd.name).toBe("Seacliff House Goa");
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
  });

  it("excludes invalid bookingUrl from structured data", () => {
    const hotel = { ...mockHotels[0], bookingUrl: "http://example.com/not-https" };
    const hotelJsonLd = getHotelJsonLd(hotel);
    expect(hotelJsonLd.makesOffer).toBeUndefined();
    expect(buildAffiliateUrl(hotel.bookingUrl, { provider: "mock" }).isValid).toBe(false);
  });
});
