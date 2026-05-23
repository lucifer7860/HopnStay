export type AffiliateUrlResult = {
  isValid: boolean;
  url?: string;
  reason?: string;
};

type BuildAffiliateOptions = {
  provider?: string;
  marker?: string;
};

export function validateAffiliateUrl(url: unknown): AffiliateUrlResult {
  if (typeof url !== "string" || url.trim().length === 0) {
    return { isValid: false, reason: "Affiliate URL is empty" };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return { isValid: false, reason: "Affiliate URL must use HTTPS" };
    }

    if (["javascript:", "data:"].includes(parsed.protocol)) {
      return { isValid: false, reason: "Unsafe affiliate URL protocol" };
    }

    return { isValid: true, url: parsed.toString() };
  } catch {
    return { isValid: false, reason: "Affiliate URL is malformed" };
  }
}

export function buildAffiliateUrl(url: string, options: BuildAffiliateOptions = {}): AffiliateUrlResult {
  const validation = validateAffiliateUrl(url);
  if (!validation.isValid || !validation.url) {
    return validation;
  }

  const parsed = new URL(validation.url);
  const marker = options.marker?.trim();

  if (marker && options.provider?.toLowerCase() === "travelpayouts") {
    parsed.searchParams.set("marker", marker);
  }

  return { isValid: true, url: parsed.toString() };
}
