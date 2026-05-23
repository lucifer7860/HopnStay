import { mockProvider } from "./providers/mockProvider";
import {
  isTravelpayoutsEnabled,
  parseTravelpayoutsHotelId,
  travelpayoutsProvider
} from "./providers/travelpayoutsProvider";
import type { HotelDetails, HotelProvider, HotelSearchParams, NormalizedHotel } from "./providers/types";

export type ProviderResult<T> = {
  data: T;
  provider: "travelpayouts" | "mock";
  fallbackUsed: boolean;
  warning?: string;
};

export function getHotelProvider(): HotelProvider {
  return {
    searchHotels,
    getHotelDetails
  };
}

export async function searchHotels(params: HotelSearchParams): Promise<NormalizedHotel[]> {
  const result = await searchHotelsWithMeta(params);
  return result.data;
}

export async function searchHotelsWithMeta(params: HotelSearchParams): Promise<ProviderResult<NormalizedHotel[]>> {
  if (!isTravelpayoutsEnabled()) {
    return {
      data: await mockProvider.searchHotels(params),
      provider: "mock",
      fallbackUsed: true,
      warning: "Travelpayouts disabled"
    };
  }

  try {
    const hotels = await travelpayoutsProvider.searchHotels(params);
    if (!hotels.length) {
      return {
        data: await mockProvider.searchHotels(params),
        provider: "mock",
        fallbackUsed: true,
        warning: "Travelpayouts returned no valid results"
      };
    }

    return { data: hotels, provider: "travelpayouts", fallbackUsed: false };
  } catch (error) {
    return {
      data: await mockProvider.searchHotels(params),
      provider: "mock",
      fallbackUsed: true,
      warning: error instanceof Error ? error.message : "Travelpayouts failed"
    };
  }
}

export async function getHotelDetails(idOrSlug: string): Promise<HotelDetails | null> {
  const result = await getHotelDetailsWithMeta(idOrSlug);
  return result.data;
}

export async function getHotelDetailsWithMeta(idOrSlug: string): Promise<ProviderResult<HotelDetails | null>> {
  const travelpayoutsId = parseTravelpayoutsHotelId(idOrSlug);

  if (travelpayoutsId && isTravelpayoutsEnabled()) {
    try {
      const hotel = await travelpayoutsProvider.getHotelDetails(idOrSlug);
      return { data: hotel, provider: "travelpayouts", fallbackUsed: false };
    } catch (error) {
      return {
        data: await mockProvider.getHotelDetails(idOrSlug),
        provider: "mock",
        fallbackUsed: true,
        warning: error instanceof Error ? error.message : "Travelpayouts detail failed"
      };
    }
  }

  return {
    data: await mockProvider.getHotelDetails(idOrSlug),
    provider: "mock",
    fallbackUsed: Boolean(travelpayoutsId),
    warning: travelpayoutsId ? "Travelpayouts detail unavailable; mock fallback used" : undefined
  };
}
