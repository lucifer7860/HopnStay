import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, MapPin, Star } from "lucide-react";
import { AffiliateDealButton } from "@/components/affiliate-deal-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { getBreadcrumbJsonLd, getHotelJsonLd, getHotelMetadata } from "@/lib/seo";
import { getHotelDetails } from "@/services/hotelProvider";

type HotelPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const hotel = await getHotelDetails(resolvedParams.slug);
  return getHotelMetadata(hotel);
}

export default async function HotelPage({ params }: HotelPageProps) {
  const resolvedParams = await params;
  const hotel = await getHotelDetails(resolvedParams.slug);
  if (!hotel) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const hotelJsonLd = getHotelJsonLd(hotel);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: appUrl },
    { name: "Search", url: `${appUrl}/search?city=${encodeURIComponent(hotel.location.city)}` },
    { name: hotel.name, url: `${appUrl}/hotels/${hotel.slug || hotel.id}` }
  ]);

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link href={`/search?city=${encodeURIComponent(hotel.location.city)}`} className="hover:text-primary">
          {hotel.location.city}
        </Link>{" "}
        / <span>{hotel.name}</span>
      </nav>
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{hotel.starRating} star</Badge>
            <Badge variant="secondary">{hotel.provider}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{hotel.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {hotel.location.address}, {hotel.location.city}
            </span>
            <span>{hotel.location.distanceFromCenterKm.toFixed(1)} km from center</span>
          </div>
        </div>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">From</div>
            <div className="text-3xl font-bold text-slate-950">{formatMoney(hotel.price.amount, hotel.price.currency)}</div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-800">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                {hotel.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{hotel.reviewCount} reviews</span>
            </div>
            <AffiliateDealButton
              className="mt-5 w-full"
              hotelId={hotel.id}
              hotelName={hotel.name}
              provider={hotel.provider}
              bookingUrl={hotel.bookingUrl}
              source="hotel-detail-primary"
              searchContext={{ city: hotel.location.city }}
            />
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {(hotel.images?.length ? hotel.images : [hotel.image]).slice(0, 3).map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`${hotel.name} image ${index + 1}`}
            className={index === 0 ? "h-72 w-full rounded-lg object-cover md:col-span-2" : "h-72 w-full rounded-lg object-cover"}
          />
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-slate-700">{hotel.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {hotel.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    {amenity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rooms and display deals</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {hotel.rooms?.length ? (
                hotel.rooms.map((room) => (
                  <div key={String(room.id)} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                          <BedDouble className="h-5 w-5 text-primary" aria-hidden="true" />
                          {String(room.name)}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{String(room.description || "")}</p>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xl font-bold text-slate-950">
                          {formatMoney(Number(room.pricePerNight || hotel.price.amount), String(room.currency || hotel.price.currency))}
                        </div>
                        <div className="text-sm text-muted-foreground">display only</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Room display data is not available for this partner hotel yet.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {hotel.reviews?.length ? (
                hotel.reviews.map((review) => (
                  <div key={String(review.id)} className="rounded-lg border p-4">
                    <div className="font-semibold text-slate-950">{String(review.title)}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{String(review.rating)}/10</div>
                    <p className="mt-2 text-sm text-slate-700">{String(review.comment)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Reviews will appear when the provider supplies them.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="h-fit space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(hotel.providerOffers?.length
                ? hotel.providerOffers
                : [
                    {
                      id: `${hotel.id}-primary`,
                      provider: hotel.provider,
                      label: "Partner deal",
                      price: hotel.price,
                      bookingUrl: hotel.bookingUrl
                    }
                  ]
              ).map((offer) => (
                <div key={offer.id} className="rounded-lg border p-3">
                  <div className="font-semibold text-slate-950">{offer.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{offer.provider}</div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="font-bold">{formatMoney(offer.price.amount, offer.price.currency)}</span>
                    <AffiliateDealButton
                      hotelId={hotel.id}
                      hotelName={hotel.name}
                      provider={offer.provider}
                      bookingUrl={offer.bookingUrl}
                      source="hotel-detail-offer"
                      searchContext={{ city: hotel.location.city }}
                      label="Check price"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
