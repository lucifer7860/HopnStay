export type HotelSearchParams = {
  city?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  amenities?: string[];
  sort?: "recommended" | "price_asc" | "price_desc" | "rating_desc" | "distance_asc";
};

export type NormalizedHotel = {
  id: string;
  slug?: string;
  name: string;
  location: {
    city: string;
    country: string;
    address: string;
    latitude: number;
    longitude: number;
    distanceFromCenterKm: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  starRating: number;
  image: string;
  images?: string[];
  provider: string;
  bookingUrl: string;
  amenities?: string[];
  shortDescription?: string;
  description?: string;
};

export type ProviderOffer = {
  id: string;
  provider: string;
  label: string;
  price: {
    amount: number;
    currency: string;
  };
  bookingUrl: string;
  refundable?: boolean;
};

export type HotelDetails = NormalizedHotel & {
  rooms?: Array<Record<string, unknown>>;
  reviews?: Array<Record<string, unknown>>;
  providerOffers?: ProviderOffer[];
};

export interface HotelProvider {
  searchHotels(params: HotelSearchParams): Promise<NormalizedHotel[]>;
  getHotelDetails(idOrSlug: string): Promise<HotelDetails | null>;
}
