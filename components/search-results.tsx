"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { HotelCard } from "@/components/hotel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { NormalizedHotel } from "@/services/providers/types";

type SearchResponse = {
  data: NormalizedHotel[];
  provider: string;
  fallbackUsed: boolean;
  warning?: string;
};

type SearchResultsProps = {
  initialParams: Record<string, string | undefined>;
};

const amenityOptions = ["Breakfast", "Pool", "Gym", "Airport shuttle", "Workspace"];

function buildQuery(params: Record<string, string | number | undefined>, amenities: string[]) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && String(value).trim()) query.set(key, String(value));
  });
  if (amenities.length) query.set("amenities", amenities.join(","));
  return query.toString();
}

export function SearchResults({ initialParams }: SearchResultsProps) {
  const [hotels, setHotels] = useState<NormalizedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    starRating: "",
    sort: "recommended"
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [refreshToken, setRefreshToken] = useState(0);

  const query = useMemo(
    () =>
      buildQuery(
        {
          ...initialParams,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          starRating: filters.starRating,
          sort: filters.sort
        },
        amenities
      ),
    [amenities, filters, initialParams]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/hotels/search?${query}`)
      .then((response) => response.json())
      .then((json: SearchResponse) => {
        if (cancelled) return;
        setHotels(json.data || []);
        setWarning(json.warning || (json.fallbackUsed ? "Mock provider fallback is active." : undefined));
      })
      .catch(() => {
        if (!cancelled) {
          setHotels([]);
          setWarning("Search failed. Try again in a moment.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, refreshToken]);

  function toggleAmenity(amenity: string) {
    setAmenities((current) => (current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity]));
  }

  const searchContext = {
    city: initialParams.city,
    checkin: initialParams.checkin,
    checkout: initialParams.checkout,
    guests: initialParams.guests,
    rooms: initialParams.rooms
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-base font-semibold">
          <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
          Filters
        </div>
        <div className="mt-4 grid gap-4">
          <div>
            <Label htmlFor="minPrice">Min price</Label>
            <Input id="minPrice" type="number" min="0" value={filters.minPrice} onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max price</Label>
            <Input id="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
          </div>
          <div>
            <Label htmlFor="starRating">Minimum stars</Label>
            <Select id="starRating" value={filters.starRating} onChange={(event) => setFilters({ ...filters, starRating: event.target.value })}>
              <option value="">Any</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort">Sort</Label>
            <Select id="sort" value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price low to high</option>
              <option value="price_desc">Price high to low</option>
              <option value="rating_desc">Top rated</option>
              <option value="distance_asc">Nearest first</option>
            </Select>
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Amenities</legend>
            <div className="mt-2 grid gap-2">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="h-4 w-4 rounded border-slate-300" />
                  {amenity}
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="button" variant="secondary" onClick={() => setRefreshToken((current) => current + 1)}>
            <Filter className="h-4 w-4" aria-hidden="true" />
            Apply filters
          </Button>
        </div>
      </aside>
      <section className="min-w-0">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              {initialParams.city ? `Hotels in ${initialParams.city}` : "Compare hotel prices"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Results show partner deals only. Booking happens on the partner website.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">{loading ? "Searching..." : `${hotels.length} results`}</div>
        </div>
        {warning ? <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{warning}</div> : null}
        {loading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-[240px_1fr]">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-3">
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length ? (
          <div className="grid gap-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} searchContext={searchContext} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-950">No matching hotels</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a different city, price range, rating, or amenity filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
