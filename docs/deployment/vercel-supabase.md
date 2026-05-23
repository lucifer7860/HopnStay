# Vercel and Supabase Deployment

## Supabase Setup

1. Create a Supabase project.
2. Copy the Supabase transaction pooler connection string for `DATABASE_URL`.
3. Copy the Supabase session pooler connection string for `DIRECT_URL`.
4. Confirm SSL requirements are enabled in the connection strings.
5. Add `DATABASE_URL` and `DIRECT_URL` to Vercel.

For Vercel, prefer these shapes:

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[DATABASE_PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.[PROJECT_REF]:[DATABASE_PASSWORD]@[REGION].pooler.supabase.com:5432/postgres
```

The direct host, `db.[PROJECT_REF].supabase.co:5432`, may be unreachable from Vercel if the direct route requires IPv6. The session pooler is the safer migration connection for Vercel builds.
6. Run:

```bash
npm run prisma:generate
```

7. Run:

```bash
npm run db:deploy
```

8. Confirm tables:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Hotel`
- `Room`
- `Review`
- `Wishlist`
- `AffiliateClick`
- `Booking`

## Vercel Setup

1. Push code to GitHub.
2. Import the repo into Vercel.
3. Framework preset: Next.js.
4. Build command:

```bash
npm run vercel-build
```

5. Add production environment variables from `.env.production.example`.
6. Deploy.
7. Check logs.
8. Confirm `prisma generate` ran.
9. Confirm `prisma migrate deploy` ran.
10. Confirm app URL is live.
11. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to the final domain.

## Travelpayouts Fallback

If credentials are not ready:

```env
TRAVELPAYOUTS_ENABLED=false
TRAVELPAYOUTS_API_KEY=
TRAVELPAYOUTS_AFFILIATE_MARKER=
```

The app will use mock hotel data and keep external affiliate redirect behavior.

## Production Checks

Run this before production deploy with real production-shaped values:

```bash
npm run validate:production-env
```

The validator rejects localhost URLs, placeholder secrets, weak seed passwords, a non-Supabase transaction-pooler `DATABASE_URL`, invalid `DIRECT_URL` values, and missing Travelpayouts credentials when Travelpayouts is enabled.
