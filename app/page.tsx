import { Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 py-4 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <Badge variant="secondary">Affiliate-only hotel comparison</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
            Compare hotel prices and continue to trusted partner deals.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Search hotels, review amenities and ratings, then use partner links to book externally.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-soft">
          <div className="grid gap-4 text-sm">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <span>No internal payment or checkout flow.</span>
            </div>
            <div className="flex gap-3">
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Outbound clicks are tracked for affiliate analytics.</span>
            </div>
            <div className="flex gap-3">
              <Building2 className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <span>Travelpayouts support with mock fallback.</span>
            </div>
          </div>
        </div>
      </section>
      <SearchForm />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Bangalore", "Business stays near tech corridors"],
          ["Goa", "Beach hotels and weekend breaks"],
          ["Mumbai", "City hotels with waterfront access"]
        ].map(([city, copy]) => (
          <a key={city} href={`/search?city=${encodeURIComponent(city)}&checkin=2026-06-10&checkout=2026-06-12&guests=2&rooms=1`} className="rounded-lg border bg-white p-5 shadow-sm hover:border-primary">
            <div className="text-lg font-bold text-slate-950">{city}</div>
            <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
          </a>
        ))}
      </section>
    </div>
  );
}
