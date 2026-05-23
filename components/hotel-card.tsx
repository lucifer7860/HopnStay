"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { AffiliateDealButton } from "@/components/affiliate-deal-button";
import { WishlistButton } from "@/components/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import type { NormalizedHotel } from "@/services/providers/types";

type HotelCardProps = {
  hotel: NormalizedHotel;
  searchContext?: Record<string, unknown>;
};

export function HotelCard({ hotel, searchContext }: HotelCardProps) {
  const detailHref = `/hotels/${hotel.slug || hotel.id}`;

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[260px_1fr]">
        <Link href={detailHref} className="block bg-slate-100">
          <img src={hotel.image} alt={hotel.name} className="h-56 w-full object-cover md:h-full" />
        </Link>
        <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={detailHref} className="text-xl font-bold leading-tight text-slate-950 hover:text-primary">
                  {hotel.name}
                </Link>
                <Badge variant="accent">{hotel.starRating} star</Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {hotel.location.city}, {hotel.location.country}
                </span>
                <span>{hotel.location.distanceFromCenterKm.toFixed(1)} km from center</span>
              </div>
            </div>
            <WishlistButton hotelId={hotel.id} />
          </div>
          <p className="line-clamp-2 text-sm text-slate-600">{hotel.shortDescription || hotel.description}</p>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities?.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-800">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                {hotel.rating.toFixed(1)}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{hotel.reviewCount} reviews</div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs uppercase text-muted-foreground">From</div>
              <div className="text-2xl font-bold text-slate-950">{formatMoney(hotel.price.amount, hotel.price.currency)}</div>
              <div className="mt-3 flex gap-2 sm:justify-end">
                <Link href={detailHref} className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold hover:bg-muted">
                  Details
                </Link>
                <AffiliateDealButton
                  hotelId={hotel.id}
                  hotelName={hotel.name}
                  provider={hotel.provider}
                  bookingUrl={hotel.bookingUrl}
                  source="search-results"
                  searchContext={searchContext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
