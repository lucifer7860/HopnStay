import { mockHotels } from "@/lib/mock-data";
import type { HotelDetails, HotelProvider, HotelSearchParams, NormalizedHotel } from "./types";

function matchesCity(hotel: HotelDetails, city?: string) {
  if (!city) return true;
  const normalized = city.toLowerCase();
  return (
    hotel.location.city.toLowerCase().includes(normalized) ||
    hotel.location.address.toLowerCase().includes(normalized) ||
    hotel.name.toLowerCase().includes(normalized)
  );
}

function applyFilters(hotels: HotelDetails[], params: HotelSearchParams) {
  return hotels
    .filter((hotel) => matchesCity(hotel, params.city))
    .filter((hotel) => (params.minPrice ? hotel.price.amount >= params.minPrice : true))
    .filter((hotel) => (params.maxPrice ? hotel.price.amount <= params.maxPrice : true))
    .filter((hotel) => (params.starRating ? hotel.starRating >= params.starRating : true))
    .filter((hotel) => {
      if (!params.amenities?.length) return true;
      const hotelAmenities = new Set(hotel.amenities?.map((item) => item.toLowerCase()));
      return params.amenities.every((item) => hotelAmenities.has(item.toLowerCase()));
    });
}

function sortHotels(hotels: HotelDetails[], sort: HotelSearchParams["sort"]) {
  const sorted = [...hotels];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case "price_desc":
      return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case "rating_desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "distance_asc":
      return sorted.sort((a, b) => a.location.distanceFromCenterKm - b.location.distanceFromCenterKm);
    default:
      return sorted.sort((a, b) => b.rating * 10 + b.reviewCount / 100 - (a.rating * 10 + a.reviewCount / 100));
  }
}

function toSearchHotel(hotel: HotelDetails): NormalizedHotel {
  return {
    id: hotel.id,
    slug: hotel.slug,
    name: hotel.name,
    location: hotel.location,
    price: hotel.price,
    rating: hotel.rating,
    reviewCount: hotel.reviewCount,
    starRating: hotel.starRating,
    image: hotel.image,
    images: hotel.images,
    provider: hotel.provider,
    bookingUrl: hotel.bookingUrl,
    amenities: hotel.amenities,
    shortDescription: hotel.shortDescription,
    description: hotel.description
  };
}

export const mockProvider: HotelProvider = {
  async searchHotels(params) {
    return sortHotels(applyFilters(mockHotels, params), params.sort).map(toSearchHotel);
  },

  async getHotelDetails(idOrSlug) {
    return (
      mockHotels.find((hotel) => hotel.slug === idOrSlug || hotel.id === idOrSlug) ||
      mockHotels.find((hotel) => hotel.slug === "seacliff-house-goa") ||
      null
    );
  }
};
