import type { Metadata } from "next";
import { validateAffiliateUrl } from "./affiliateUrl";
import type { HotelDetails } from "@/services/providers/types";

const appName = "HopnStay";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function getSearchMetadata(city?: string): Metadata {
  const cleanCity = city?.trim();
  const title = cleanCity ? `Compare hotels in ${cleanCity} | ${appName}` : `Compare hotel prices | ${appName}`;
  const description = cleanCity
    ? `Compare hotel prices, ratings, amenities, and deals in ${cleanCity}. View partner deals and choose the best stay.`
    : "Search and compare hotel deals from trusted travel partners.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: cleanCity ? `${appUrl}/search?city=${encodeURIComponent(cleanCity)}` : `${appUrl}/search`
    }
  };
}

export function getHotelMetadata(hotel: HotelDetails | null): Metadata {
  if (!hotel) {
    return {
      title: `Hotel not found | ${appName}`,
      description: "The requested hotel could not be found."
    };
  }

  const location = `${hotel.location.city}, ${hotel.location.country}`;
  const title = `${hotel.name} - Compare Prices | ${appName}`;
  const description = `Compare prices, amenities, ratings, and partner deals for ${hotel.name} in ${location}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: hotel.image ? [{ url: hotel.image }] : undefined,
      url: `${appUrl}/hotels/${hotel.slug || hotel.id}`
    }
  };
}

export function getHotelJsonLd(hotel: HotelDetails) {
  const safeUrl = validateAffiliateUrl(hotel.bookingUrl);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description || hotel.shortDescription,
    image: hotel.images?.length ? hotel.images : [hotel.image],
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.location.address,
      addressLocality: hotel.location.city,
      addressCountry: hotel.location.country
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.rating,
      reviewCount: hotel.reviewCount
    }
  };

  if (safeUrl.isValid && safeUrl.url) {
    jsonLd.makesOffer = {
      "@type": "Offer",
      url: safeUrl.url,
      price: hotel.price.amount,
      priceCurrency: hotel.price.currency,
      availability: "https://schema.org/InStock"
    };
  }

  return jsonLd;
}

export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
