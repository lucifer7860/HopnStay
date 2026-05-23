"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Clock, Heart, User } from "lucide-react";
import { AffiliateDealButton } from "@/components/affiliate-deal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";

type WishlistItem = {
  id: string;
  hotel: {
    id: string;
    slug: string;
    name: string;
    city: string;
    country: string;
    starRating: number;
    averageRating: number;
    provider: string;
    bookingUrl: string | null;
    images: string[];
    rooms?: Array<{ pricePerNight: string; currency: string }>;
  };
};

type ActivityItem = {
  id: string;
  hotelId: string;
  hotelName: string | null;
  provider: string;
  source: string | null;
  createdAt: string;
};

export function DashboardClient() {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((json) => setWishlist(json.items || []));
    fetch("/api/user/activity")
      .then((response) => (response.ok ? response.json() : { clicks: [] }))
      .then((json) => setActivity(json.clicks || []));
  }, [session]);

  if (status === "loading") {
    return <div className="rounded-lg border bg-white p-6">Loading dashboard...</div>;
  }

  if (!session) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Sign in to view your dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your saved hotels and recent partner deal clicks will appear here.</p>
        <Link href="/login" className="mt-5 inline-flex">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="font-semibold text-slate-950">{session.user?.name || "HopnStay user"}</div>
            <div className="text-muted-foreground">{session.user?.email}</div>
            <Badge variant={session.user.role === "ADMIN" ? "accent" : "secondary"}>{session.user.role}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              Recent Deal Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length ? (
              <div className="space-y-3">
                {activity.map((click) => (
                  <div key={click.id} className="rounded-md border p-3 text-sm">
                    <div className="font-semibold text-slate-950">{click.hotelName || click.hotelId}</div>
                    <div className="text-muted-foreground">
                      {click.provider} from {click.source || "site"} on {new Date(click.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Recent outbound partner clicks will appear after you view deals.</p>
            )}
          </CardContent>
        </Card>
      </aside>
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-slate-950">Saved hotels</h1>
        </div>
        {wishlist.length ? (
          <div className="grid gap-4">
            {wishlist.map((item) => {
              const firstRoom = item.hotel.rooms?.[0];
              const amount = Number(firstRoom?.pricePerNight || 0);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-[220px_1fr]">
                    <img src={item.hotel.images[0]} alt={item.hotel.name} className="h-48 w-full object-cover md:h-full" />
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/hotels/${item.hotel.slug}`} className="text-xl font-bold text-slate-950 hover:text-primary">
                          {item.hotel.name}
                        </Link>
                        <Badge variant="accent">{item.hotel.starRating} star</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.hotel.city}, {item.hotel.country}
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="font-semibold text-slate-950">{amount ? formatMoney(amount, firstRoom?.currency || "INR") : "Partner price"}</div>
                        <AffiliateDealButton
                          hotelId={item.hotel.id}
                          hotelName={item.hotel.name}
                          provider={item.hotel.provider}
                          bookingUrl={item.hotel.bookingUrl || ""}
                          source="dashboard-wishlist"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-950">No saved hotels yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Save hotels from search results and compare partner deals from here.</p>
            <Link href="/search" className="mt-5 inline-flex">
              <Button>Search hotels</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
