import { buildAffiliateUrl } from "@/lib/affiliateUrl";
import { slugify, toNumber } from "@/lib/utils";
import type { HotelDetails, HotelProvider, HotelSearchParams, NormalizedHotel } from "./types";

type TravelpayoutsHotel = {
  hotelId?: string | number;
  id?: string | number;
  hotelName?: string;
  name?: string;
  location?: {
    name?: string;
    country?: string;
    geo?: { lat?: number; lon?: number };
  };
  priceAvg?: number;
  priceFrom?: number;
  price?: number;
  stars?: number;
  rating?: number;
  reviewsCount?: number;
  distance?: number;
  address?: string;
  photoUrl?: string;
  link?: string;
};

const CACHE_ENDPOINT = "https://engine.hotellook.com/api/v2/cache.json";
const SEARCH_ENDPOINT = "https://search.hotellook.com/hotels";

export function isTravelpayoutsEnabled() {
  return process.env.TRAVELPAYOUTS_ENABLED === "true";
}

export function getTravelpayoutsCredentials() {
  const apiKey = process.env.TRAVELPAYOUTS_API_KEY || process.env.TRAVELPAYOUTS_TOKEN || "";
  const marker = process.env.TRAVELPAYOUTS_AFFILIATE_MARKER || process.env.TRAVELPAYOUTS_MARKER || "";
  return { apiKey, marker };
}

export function parseTravelpayoutsHotelId(idOrSlug: string) {
  const match = idOrSlug.match(/^travelpayouts[_-](.+)$/);
  return match?.[1] || null;
}

function buildFallbackBookingUrl(hotelId: string, params: HotelSearchParams, marker: string) {
  const url = new URL(SEARCH_ENDPOINT);
  if (params.city) url.searchParams.set("destination", params.city);
  if (params.checkin) url.searchParams.set("checkIn", params.checkin);
  if (params.checkout) url.searchParams.set("checkOut", params.checkout);
  url.searchParams.set("adults", String(params.guests || 2));
  url.searchParams.set("rooms", String(params.rooms || 1));
  url.searchParams.set("hotelId", hotelId);
  if (marker) url.searchParams.set("marker", marker);
  return url.toString();
}

function normalizeHotel(raw: TravelpayoutsHotel, params: HotelSearchParams, marker: string): NormalizedHotel | null {
  const providerHotelId = raw.hotelId ?? raw.id;
  const name = raw.hotelName || raw.name;

  if (!providerHotelId || !name) {
    return null;
  }

  const id = `travelpayouts_${providerHotelId}`;
  const city = params.city || raw.location?.name || "Unknown city";
  const baseUrl = raw.link || buildFallbackBookingUrl(String(providerHotelId), params, marker);
  const affiliateUrl = buildAffiliateUrl(baseUrl, { provider: "travelpayouts", marker });

  if (!affiliateUrl.isValid || !affiliateUrl.url) {
    return null;
  }

  return {
    id,
    slug: `${slugify(name)}-${id}`,
    name,
    location: {
      city,
      country: raw.location?.country || "India",
      address: raw.address || city,
      latitude: toNumber(raw.location?.geo?.lat, 0),
      longitude: toNumber(raw.location?.geo?.lon, 0),
      distanceFromCenterKm: toNumber(raw.distance, 0)
    },
    price: {
      amount: toNumber(raw.priceAvg ?? raw.priceFrom ?? raw.price, 0),
      currency: "INR"
    },
    rating: toNumber(raw.rating, 8),
    reviewCount: Math.round(toNumber(raw.reviewsCount, 0)),
    starRating: Math.round(toNumber(raw.stars, 0)),
    image: raw.photoUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: raw.photoUrl ? [raw.photoUrl] : undefined,
    provider: "travelpayouts",
    bookingUrl: affiliateUrl.url,
    amenities: ["Partner deal", "External booking"],
    shortDescription: `Partner hotel deal in ${city}.`,
    description: `Compare partner prices and continue to the booking partner for ${name}.`
  };
}

export const travelpayoutsProvider: HotelProvider = {
  async searchHotels(params) {
    const { apiKey, marker } = getTravelpayoutsCredentials();
    if (!isTravelpayoutsEnabled() || !apiKey || !marker) {
      throw new Error("Travelpayouts is disabled or not configured");
    }

    const url = new URL(CACHE_ENDPOINT);
    url.searchParams.set("location", params.city || "Bangalore");
    if (params.checkin) url.searchParams.set("checkIn", params.checkin);
    if (params.checkout) url.searchParams.set("checkOut", params.checkout);
    url.searchParams.set("currency", "inr");
    url.searchParams.set("limit", "30");
    url.searchParams.set("token", apiKey);

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error(`Travelpayouts request failed with ${response.status}`);
    }

    const json = (await response.json()) as TravelpayoutsHotel[];
    if (!Array.isArray(json)) {
      throw new Error("Travelpayouts returned an unexpected response");
    }

    return json
      .map((hotel) => normalizeHotel(hotel, params, marker))
      .filter((hotel): hotel is NormalizedHotel => Boolean(hotel && hotel.bookingUrl && hotel.price.amount > 0));
  },

  async getHotelDetails(idOrSlug) {
    const providerHotelId = parseTravelpayoutsHotelId(idOrSlug);
    if (!providerHotelId) {
      throw new Error("Malformed Travelpayouts hotel id");
    }

    const { marker } = getTravelpayoutsCredentials();
    const bookingUrl = buildFallbackBookingUrl(providerHotelId, {}, marker);
    const safeUrl = buildAffiliateUrl(bookingUrl, { provider: "travelpayouts", marker });
    if (!safeUrl.isValid || !safeUrl.url) {
      throw new Error("Travelpayouts booking URL failed validation");
    }

    const hotel: HotelDetails = {
      id: `travelpayouts_${providerHotelId}`,
      slug: `travelpayouts-${providerHotelId}`,
      name: `Partner Hotel ${providerHotelId}`,
      location: {
        city: "Unknown city",
        country: "India",
        address: "Partner supplied address",
        latitude: 0,
        longitude: 0,
        distanceFromCenterKm: 0
      },
      price: { amount: 0, currency: "INR" },
      rating: 8,
      reviewCount: 0,
      starRating: 0,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
      provider: "travelpayouts",
      bookingUrl: safeUrl.url,
      amenities: ["Partner deal"],
      shortDescription: "Partner hotel detail from Travelpayouts.",
      description: "Continue to the partner booking website to confirm live prices and availability.",
      rooms: [],
      reviews: [],
      providerOffers: [
        {
          id: `travelpayouts_${providerHotelId}_offer`,
          provider: "travelpayouts",
          label: "Travelpayouts partner deal",
          price: { amount: 0, currency: "INR" },
          bookingUrl: safeUrl.url
        }
      ]
    };

    return hotel;
  }
};
