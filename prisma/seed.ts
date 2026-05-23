import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { mockHotels } from "../lib/mock-data";

const prisma = new PrismaClient();

const weakPasswords = new Set(["password", "password123", "password123456", "admin", "admin123", "changeme", "letmein"]);

function isProductionLike() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production" || process.env.RUN_DATABASE_MIGRATIONS === "true";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requireSeedCredentials(label: string, email: string | undefined, password: string | undefined) {
  if (!email || !isEmail(email)) {
    throw new Error(`${label} seed email must be a valid email address`);
  }
  if (!password || password.length < 12 || weakPasswords.has(password.toLowerCase())) {
    throw new Error(`${label} seed password must be at least 12 characters and not be a common weak password`);
  }
}

async function upsertUser({
  email,
  password,
  name,
  role
}: {
  email: string;
  password: string;
  name: string;
  role: "USER" | "ADMIN";
}) {
  const passwordHash = await hash(password, 12);
  return prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role },
    create: { email, name, passwordHash, role }
  });
}

async function main() {
  const production = isProductionLike();
  const adminEmail = process.env.SEED_ADMIN_EMAIL || (production ? undefined : "admin@hopnstay.dev");
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || (production ? undefined : "password123");

  if (production) {
    requireSeedCredentials("Admin", adminEmail, adminPassword);
  }

  const admin = await upsertUser({
    email: adminEmail!,
    password: adminPassword!,
    name: "HopnStay Admin",
    role: "ADMIN"
  });

  const seedDemoUser = process.env.SEED_DEMO_USER ? process.env.SEED_DEMO_USER === "true" : !production;
  let demoUser = null;

  if (seedDemoUser) {
    const demoEmail = process.env.SEED_DEMO_EMAIL || (production ? undefined : "demo@hopnstay.dev");
    const demoPassword = process.env.SEED_DEMO_PASSWORD || (production ? undefined : "password123");
    if (production) {
      requireSeedCredentials("Demo", demoEmail, demoPassword);
    }
    demoUser = await upsertUser({
      email: demoEmail!,
      password: demoPassword!,
      name: "Demo Traveler",
      role: "USER"
    });
  }

  for (const hotel of mockHotels) {
    await prisma.hotel.upsert({
      where: { id: hotel.id },
      update: {
        slug: hotel.slug!,
        name: hotel.name,
        description: hotel.description || hotel.shortDescription || hotel.name,
        shortDescription: hotel.shortDescription,
        city: hotel.location.city,
        country: hotel.location.country,
        address: hotel.location.address,
        latitude: hotel.location.latitude,
        longitude: hotel.location.longitude,
        distanceFromCenterKm: hotel.location.distanceFromCenterKm,
        starRating: hotel.starRating,
        averageRating: hotel.rating,
        reviewCount: hotel.reviewCount,
        amenities: hotel.amenities || [],
        images: hotel.images || [hotel.image],
        provider: hotel.provider,
        externalProviderId: hotel.id,
        bookingUrl: hotel.bookingUrl
      },
      create: {
        id: hotel.id,
        slug: hotel.slug!,
        name: hotel.name,
        description: hotel.description || hotel.shortDescription || hotel.name,
        shortDescription: hotel.shortDescription,
        city: hotel.location.city,
        country: hotel.location.country,
        address: hotel.location.address,
        latitude: hotel.location.latitude,
        longitude: hotel.location.longitude,
        distanceFromCenterKm: hotel.location.distanceFromCenterKm,
        starRating: hotel.starRating,
        averageRating: hotel.rating,
        reviewCount: hotel.reviewCount,
        amenities: hotel.amenities || [],
        images: hotel.images || [hotel.image],
        provider: hotel.provider,
        externalProviderId: hotel.id,
        bookingUrl: hotel.bookingUrl
      }
    });

    await prisma.room.deleteMany({ where: { hotelId: hotel.id } });
    await prisma.review.deleteMany({ where: { hotelId: hotel.id } });

    for (const room of hotel.rooms || []) {
      await prisma.room.create({
        data: {
          hotelId: hotel.id,
          name: String(room.name),
          description: String(room.description || ""),
          capacity: Number(room.capacity || 2),
          bedType: String(room.bedType || "King bed"),
          pricePerNight: Number(room.pricePerNight || hotel.price.amount),
          currency: String(room.currency || hotel.price.currency),
          availableRooms: Number(room.availableRooms || 1),
          amenities: Array.isArray(room.amenities) ? room.amenities.map(String) : [],
          images: Array.isArray(room.images) ? room.images.map(String) : [],
          refundable: Boolean(room.refundable)
        }
      });
    }

    for (const review of hotel.reviews || []) {
      await prisma.review.create({
        data: {
          userId: demoUser?.id || admin.id,
          hotelId: hotel.id,
          rating: Number(review.rating || 8),
          title: String(review.title || "Recommended"),
          comment: String(review.comment || "Good partner hotel option."),
          status: "APPROVED"
        }
      });
    }
  }

  if (demoUser) {
    await prisma.wishlist.upsert({
      where: {
        userId_hotelId: {
          userId: demoUser.id,
          hotelId: "mock_bengaluru_circuit_stay"
        }
      },
      update: {},
      create: {
        userId: demoUser.id,
        hotelId: "mock_bengaluru_circuit_stay"
      }
    });
  }

  console.log(`Seed complete. Hotels: ${mockHotels.length}. Admin: ${admin.email}. Demo user: ${demoUser ? "created" : "disabled"}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
