"use client";

import { useMemo, useRef, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { buildAffiliateUrl } from "@/lib/affiliateUrl";
import { Button } from "@/components/ui/button";

type AffiliateDealButtonProps = {
  hotelId: string;
  hotelName?: string;
  provider: string;
  bookingUrl?: string;
  marker?: string;
  source?: string;
  searchContext?: Record<string, unknown>;
  label?: "View deal" | "Check price";
  className?: string;
  redirect?: (url: string) => void;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AffiliateDealButton({
  hotelId,
  hotelName,
  provider,
  bookingUrl = "",
  marker,
  source,
  searchContext,
  label = "View deal",
  className,
  redirect = (url) => window.location.assign(url)
}: AffiliateDealButtonProps) {
  const [redirecting, setRedirecting] = useState(false);
  const clickedRef = useRef(false);
  const affiliateUrl = useMemo(() => buildAffiliateUrl(bookingUrl, { provider, marker }), [bookingUrl, marker, provider]);
  const disabled = !affiliateUrl.isValid || !affiliateUrl.url || redirecting;

  async function handleClick() {
    if (clickedRef.current || !affiliateUrl.url || !affiliateUrl.isValid) return;
    clickedRef.current = true;
    setRedirecting(true);

    try {
      await Promise.race([
        fetch("/api/track-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hotelId,
            hotelName,
            provider,
            bookingUrl: affiliateUrl.url,
            source,
            searchContext
          })
        }),
        wait(1000)
      ]);
    } catch {
      // The affiliate redirect must continue even if tracking fails.
    } finally {
      redirect(affiliateUrl.url);
    }
  }

  return (
    <Button onClick={handleClick} disabled={disabled} className={className} aria-label={affiliateUrl.isValid ? label : "Deal unavailable"}>
      {redirecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Redirecting to partner site
        </>
      ) : affiliateUrl.isValid ? (
        <>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {label}
        </>
      ) : (
        "Deal unavailable"
      )}
    </Button>
  );
}
