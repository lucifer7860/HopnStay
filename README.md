# HopnStay

HopnStay is a production-oriented affiliate-only hotel comparison web app built with Next.js App Router, `pages/api` backend routes, Prisma, PostgreSQL, NextAuth credentials auth, and a Travelpayouts/mock provider layer.

## Affiliate-Only Business Model

Users search hotels, compare ratings, amenities, and prices, then click `View deal` or `Check price`. The app tracks an outbound affiliate click and redirects to a partner booking URL. Booking and payment happen only on the partner website.

There is no Stripe integration, no internal checkout, no internal payment collection, and no internal booking flow. Booking.com, Agoda, and Expedia direct integrations are intentionally not implemented yet.

## Included

- Search-first hotel comparison UI.
- Search results with filters, sorting, skeleton and empty states.
- Hotel detail pages with images, amenities, display-only rooms, provider offers, reviews, Hotel JSON-LD, and breadcrumb JSON-LD.
- Affiliate URL validation and safe marker handling.
- Click tracking with hashed IP only.
- NextAuth credentials auth with Prisma adapter and admin role support.
- Dashboard with profile, saved hotels, wishlist, and recent outbound deal activity.
- Admin analytics and provider health APIs/UI.
- Travelpayouts provider with server-side credentials and mock fallback.
- Supabase PostgreSQL-ready Prisma schema and migrations.
- Vercel build script with production env validation and migration deploy.
- Vitest coverage for affiliate URLs, provider fallback, click tracking, deal buttons, analytics, provider health, and SEO.

## File Structure

```text
app/
components/
components/ui/
hooks/
lib/
pages/api/
pages/api/admin/
pages/api/auth/
pages/api/hotels/
prisma/
prisma/migrations/
scripts/
services/
services/providers/
tests/
types/
docs/deployment/
```

## Environment Setup

Copy `.env.example` to `.env` for local development and set `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_APP_URL`.

Travelpayouts can be disabled locally:

```env
TRAVELPAYOUTS_ENABLED="false"
```

When disabled or unavailable, the app uses the mock provider.

## Local Run

```bash
npm install
npm run prisma:generate
npm run db:deploy
npm run db:seed
npm run dev
```

Local seed users:

- `admin@hopnstay.dev` / `password123`
- `demo@hopnstay.dev` / `password123`

## Test Commands

```bash
npm run typecheck
npm test
npm run build
npm run vercel-build
```

## Affiliate Flow Test

1. Open `/search?city=Bangalore&checkin=2026-06-10&checkout=2026-06-12`.
2. Click `View deal` on a valid hotel result.
3. The client posts to `/api/track-click`.
4. The client waits up to 1 second.
5. The browser redirects to the external partner URL even if tracking fails.
6. Invalid URLs show `Deal unavailable`, do not track, and do not redirect.

## Supabase Setup

1. Create a Supabase project.
2. Use the pooled connection string for `DATABASE_URL`.
3. Use the direct connection string for `DIRECT_URL`.
4. Add env vars in Vercel.
5. Run `npm run db:deploy`.
6. Run `npm run db:seed` only with strong production seed credentials.

## Vercel Deployment

1. Push the repo to GitHub.
2. Import into Vercel.
3. Use the Next.js preset.
4. Set build command to `npm run vercel-build`.
5. Add production env vars from `.env.production.example`.
6. Deploy and verify logs show Prisma generate, migration deploy, and Next build.

## Provider Abstraction

Provider files live in `services/providers`.

- `mockProvider.ts` returns realistic mock hotels.
- `travelpayoutsProvider.ts` calls Travelpayouts/Hotellook-style APIs when enabled.
- `hotelProvider.ts` chooses Travelpayouts when configured and falls back to mock data when disabled, failed, or empty.

Travelpayouts IDs use `travelpayouts_{providerHotelId}` and support old `travelpayouts-{providerHotelId}` compatibility.
