import "dotenv/config";

const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_APP_URL",
  "TRAVELPAYOUTS_ENABLED",
  "CLICK_TRACKING_SALT",
  "ESTIMATED_VALUE_PER_CLICK",
  "RUN_DATABASE_MIGRATIONS",
  "SEED_ADMIN_EMAIL",
  "SEED_ADMIN_PASSWORD",
  "SEED_DEMO_USER"
] as const;

const weakPasswords = new Set(["password", "password123", "password123456", "admin", "admin123", "changeme", "letmein"]);
const placeholders = ["replace-with", "generate-a-long", "your-production-domain", "[PROJECT_REF]", "[DATABASE_PASSWORD]", "[REGION]"];

function fail(message: string): never {
  throw new Error(message);
}

function get(name: string) {
  return process.env[name] || "";
}

function requireBoolean(name: string) {
  const value = get(name);
  if (!["true", "false"].includes(value)) fail(`${name} must be true or false`);
}

function requireHttps(name: string) {
  const value = get(name);
  let parsed!: URL;
  try {
    parsed = new URL(value);
  } catch {
    fail(`${name} must be a valid URL`);
  }
  if (parsed.protocol !== "https:") fail(`${name} must use HTTPS`);
  if (["localhost", "127.0.0.1"].includes(parsed.hostname)) fail(`${name} must not use localhost in production`);
}

function requirePostgres(name: string) {
  const value = get(name);
  if (!value.startsWith("postgresql://") && !value.startsWith("postgres://")) {
    fail(`${name} must be a PostgreSQL connection string`);
  }
  if (value.includes("localhost") || value.includes("127.0.0.1")) {
    fail(`${name} must not point to localhost in production`);
  }
}

function parsePostgresUrl(name: string) {
  const value = get(name);
  try {
    return new URL(value);
  } catch {
    fail(`${name} must be a valid PostgreSQL connection string`);
  }
}

function isSupabasePooler(parsed: URL) {
  return parsed.hostname.endsWith(".pooler.supabase.com");
}

function isSupabaseTransactionPooler(parsed: URL) {
  return isSupabasePooler(parsed) && parsed.port === "6543";
}

function isSupabaseSessionPooler(parsed: URL) {
  return isSupabasePooler(parsed) && parsed.port === "5432";
}

function isSupabaseDirectHost(parsed: URL) {
  return parsed.hostname.startsWith("db.") && parsed.hostname.endsWith(".supabase.co") && parsed.port === "5432";
}

function containsPlaceholder(value: string) {
  return placeholders.some((placeholder) => value.toLowerCase().includes(placeholder.toLowerCase()));
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate() {
  const missing = required.filter((name) => !get(name));
  if (missing.length) fail(`Missing required production env vars: ${missing.join(", ")}`);

  for (const name of required) {
    if (containsPlaceholder(get(name))) fail(`${name} contains a placeholder value`);
  }

  requirePostgres("DATABASE_URL");
  requirePostgres("DIRECT_URL");
  const databaseUrl = parsePostgresUrl("DATABASE_URL");
  const directUrl = parsePostgresUrl("DIRECT_URL");
  if (!isSupabaseTransactionPooler(databaseUrl)) {
    fail("DATABASE_URL must use the Supabase transaction pooler on port 6543 for production");
  }
  if (databaseUrl.searchParams.get("pgbouncer") !== "true") {
    fail("DATABASE_URL must include pgbouncer=true for Prisma with the Supabase transaction pooler");
  }
  if (!isSupabaseSessionPooler(directUrl) && !isSupabaseDirectHost(directUrl)) {
    fail("DIRECT_URL must use either the Supabase session pooler on port 5432 or the direct Supabase host on port 5432");
  }

  requireHttps("NEXTAUTH_URL");
  requireHttps("NEXT_PUBLIC_APP_URL");

  if (get("NEXTAUTH_SECRET").length < 32) fail("NEXTAUTH_SECRET must be at least 32 characters");
  if (get("CLICK_TRACKING_SALT").length < 16) fail("CLICK_TRACKING_SALT must be at least 16 characters");

  const estimatedValue = Number(get("ESTIMATED_VALUE_PER_CLICK"));
  if (!Number.isFinite(estimatedValue) || estimatedValue < 0) {
    fail("ESTIMATED_VALUE_PER_CLICK must be a non-negative number");
  }

  requireBoolean("RUN_DATABASE_MIGRATIONS");
  requireBoolean("SEED_DEMO_USER");

  if (!isEmail(get("SEED_ADMIN_EMAIL"))) fail("SEED_ADMIN_EMAIL must be a valid email address");
  const seedPassword = get("SEED_ADMIN_PASSWORD");
  if (seedPassword.length < 12 || weakPasswords.has(seedPassword.toLowerCase())) {
    fail("SEED_ADMIN_PASSWORD must be at least 12 characters and not be a common weak password");
  }

  const travelpayoutsEnabled = get("TRAVELPAYOUTS_ENABLED");
  if (!["true", "false"].includes(travelpayoutsEnabled)) {
    fail("TRAVELPAYOUTS_ENABLED must be true or false");
  }

  if (travelpayoutsEnabled === "true") {
    const apiKey = get("TRAVELPAYOUTS_API_KEY") || get("TRAVELPAYOUTS_TOKEN");
    const marker = get("TRAVELPAYOUTS_AFFILIATE_MARKER") || get("TRAVELPAYOUTS_MARKER");
    if (!apiKey) fail("Travelpayouts enabled requires TRAVELPAYOUTS_API_KEY or TRAVELPAYOUTS_TOKEN");
    if (!marker) fail("Travelpayouts enabled requires TRAVELPAYOUTS_AFFILIATE_MARKER or TRAVELPAYOUTS_MARKER");
    if (["stayfinder_demo", "hopnstay_demo"].includes(marker) || containsPlaceholder(marker)) {
      fail("Travelpayouts marker must not be a placeholder");
    }
  }
}

try {
  validate();
  console.log("Production environment validation passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Production environment validation failed");
  process.exit(1);
}
