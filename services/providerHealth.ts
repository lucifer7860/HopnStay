import { getTravelpayoutsCredentials, isTravelpayoutsEnabled, travelpayoutsProvider } from "./providers/travelpayoutsProvider";

export type ProviderHealth = {
  travelpayoutsEnabled: boolean;
  apiKeyConfigured: boolean;
  affiliateMarkerConfigured: boolean;
  liveRequestSucceeded: boolean;
  normalizedResultsCount: number;
  fallbackAvailable: boolean;
  warnings: string[];
};

export async function getProviderHealth(options: { skipLiveRequest?: boolean } = {}): Promise<ProviderHealth> {
  const travelpayoutsEnabled = isTravelpayoutsEnabled();
  const { apiKey, marker } = getTravelpayoutsCredentials();
  const warnings: string[] = [];

  if (!travelpayoutsEnabled) {
    warnings.push("Travelpayouts disabled; mock provider fallback is active.");
  }
  if (travelpayoutsEnabled && !apiKey) {
    warnings.push("Travelpayouts is enabled but no API key/token is configured.");
  }
  if (travelpayoutsEnabled && !marker) {
    warnings.push("Travelpayouts is enabled but no affiliate marker is configured.");
  }

  let liveRequestSucceeded = false;
  let normalizedResultsCount = 0;

  if (travelpayoutsEnabled && apiKey && marker && !options.skipLiveRequest) {
    try {
      const results = await travelpayoutsProvider.searchHotels({
        city: "Bangalore",
        checkin: "2026-06-10",
        checkout: "2026-06-12",
        guests: 2,
        rooms: 1
      });
      liveRequestSucceeded = true;
      normalizedResultsCount = results.length;
      if (!results.length) {
        warnings.push("Travelpayouts live request returned no normalized results.");
      }
    } catch {
      warnings.push("Travelpayouts live request failed; mock fallback remains available.");
    }
  }

  return {
    travelpayoutsEnabled,
    apiKeyConfigured: Boolean(apiKey),
    affiliateMarkerConfigured: Boolean(marker),
    liveRequestSucceeded,
    normalizedResultsCount,
    fallbackAvailable: true,
    warnings
  };
}
