import type { HotelDetails } from "../services/providers/types";

export const mockHotels: HotelDetails[] = [
  {
    id: "mock_goa_seacliff_house",
    slug: "seacliff-house-goa",
    name: "Seacliff House Goa",
    location: {
      city: "Goa",
      country: "India",
      address: "Candolim Beach Road, North Goa",
      latitude: 15.5167,
      longitude: 73.7626,
      distanceFromCenterKm: 2.1
    },
    price: { amount: 8400, currency: "INR" },
    rating: 8.9,
    reviewCount: 412,
    starRating: 4,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    provider: "mock",
    bookingUrl: "https://partners.example.com/goa/seacliff-house?marker=hopnstay_demo",
    amenities: ["Beach access", "Pool", "Breakfast", "Airport shuttle", "Spa"],
    shortDescription: "Beachside stay with sea-facing rooms near Candolim.",
    description:
      "A relaxed beach hotel with bright rooms, a pool courtyard, coastal dining, and easy access to North Goa beaches.",
    rooms: [
      {
        id: "goa-deluxe",
        name: "Deluxe Sea View",
        description: "Balcony room facing the Arabian Sea.",
        capacity: 2,
        bedType: "King bed",
        pricePerNight: 8400,
        currency: "INR",
        availableRooms: 5,
        amenities: ["Sea view", "Breakfast", "Wi-Fi"],
        images: [],
        refundable: true
      },
      {
        id: "goa-family",
        name: "Family Garden Suite",
        description: "Spacious suite close to the pool and garden.",
        capacity: 4,
        bedType: "King bed and sofa bed",
        pricePerNight: 11800,
        currency: "INR",
        availableRooms: 2,
        amenities: ["Garden view", "Breakfast", "Extra bed"],
        images: [],
        refundable: false
      }
    ],
    reviews: [
      { id: "goa-r1", rating: 9, title: "Excellent location", comment: "Quiet beach access and clean rooms.", createdAt: "2026-02-18" },
      { id: "goa-r2", rating: 8, title: "Great staff", comment: "Helpful team and breakfast was fresh.", createdAt: "2026-03-12" }
    ],
    providerOffers: [
      {
        id: "goa-offer-1",
        provider: "mock",
        label: "Partner beach deal",
        price: { amount: 8400, currency: "INR" },
        bookingUrl: "https://partners.example.com/goa/seacliff-house?room=deluxe&marker=hopnstay_demo",
        refundable: true
      }
    ]
  },
  {
    id: "mock_mumbai_skyline_grand",
    slug: "skyline-grand-mumbai",
    name: "Skyline Grand Mumbai",
    location: {
      city: "Mumbai",
      country: "India",
      address: "Marine Drive, Mumbai",
      latitude: 18.9435,
      longitude: 72.8238,
      distanceFromCenterKm: 1.4
    },
    price: { amount: 12600, currency: "INR" },
    rating: 9.1,
    reviewCount: 688,
    starRating: 5,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
    ],
    provider: "mock",
    bookingUrl: "https://partners.example.com/mumbai/skyline-grand?marker=hopnstay_demo",
    amenities: ["Sea view", "Gym", "Rooftop bar", "Business center", "Valet parking"],
    shortDescription: "City hotel overlooking Marine Drive with business amenities.",
    description:
      "A polished city hotel for business and leisure stays, close to Nariman Point, Colaba, and Mumbai's waterfront.",
    rooms: [
      {
        id: "mumbai-club",
        name: "Club King Room",
        description: "Higher floor room with lounge access.",
        capacity: 2,
        bedType: "King bed",
        pricePerNight: 12600,
        currency: "INR",
        availableRooms: 3,
        amenities: ["Lounge access", "Breakfast", "Desk"],
        images: [],
        refundable: true
      }
    ],
    reviews: [
      { id: "mumbai-r1", rating: 9, title: "Great business base", comment: "Fast Wi-Fi and convenient location.", createdAt: "2026-01-29" }
    ],
    providerOffers: [
      {
        id: "mumbai-offer-1",
        provider: "mock",
        label: "Partner city deal",
        price: { amount: 12600, currency: "INR" },
        bookingUrl: "https://partners.example.com/mumbai/skyline-grand?room=club&marker=hopnstay_demo",
        refundable: true
      }
    ]
  },
  {
    id: "mock_bengaluru_circuit_stay",
    slug: "circuit-stay-bengaluru",
    name: "Circuit Stay Bengaluru",
    location: {
      city: "Bangalore",
      country: "India",
      address: "Outer Ring Road, Bengaluru",
      latitude: 12.9352,
      longitude: 77.6245,
      distanceFromCenterKm: 5.8
    },
    price: { amount: 6200, currency: "INR" },
    rating: 8.7,
    reviewCount: 354,
    starRating: 4,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80"
    ],
    provider: "mock",
    bookingUrl: "https://partners.example.com/bangalore/circuit-stay?marker=hopnstay_demo",
    amenities: ["Workspace", "Gym", "Breakfast", "Airport transfer", "Laundry"],
    shortDescription: "Business-focused hotel near tech parks and meeting hubs.",
    description:
      "A practical Bengaluru business hotel with quiet workspaces, quick access to tech corridors, and dependable transport links.",
    rooms: [
      {
        id: "blr-business",
        name: "Business Queen Room",
        description: "Compact room with ergonomic desk and fast Wi-Fi.",
        capacity: 2,
        bedType: "Queen bed",
        pricePerNight: 6200,
        currency: "INR",
        availableRooms: 8,
        amenities: ["Desk", "Breakfast", "Laundry credit"],
        images: [],
        refundable: true
      },
      {
        id: "blr-suite",
        name: "Studio Suite",
        description: "Extended-stay studio with kitchenette.",
        capacity: 3,
        bedType: "King bed",
        pricePerNight: 8600,
        currency: "INR",
        availableRooms: 4,
        amenities: ["Kitchenette", "Desk", "Breakfast"],
        images: [],
        refundable: true
      }
    ],
    reviews: [
      { id: "blr-r1", rating: 9, title: "Reliable work stay", comment: "Quiet rooms and very good internet.", createdAt: "2026-04-08" },
      { id: "blr-r2", rating: 8, title: "Good access", comment: "Easy cab pickup and helpful reception.", createdAt: "2026-04-21" }
    ],
    providerOffers: [
      {
        id: "blr-offer-1",
        provider: "mock",
        label: "Partner business deal",
        price: { amount: 6200, currency: "INR" },
        bookingUrl: "https://partners.example.com/bangalore/circuit-stay?room=business&marker=hopnstay_demo",
        refundable: true
      }
    ]
  },
  {
    id: "mock_jaipur_haveli_courtyard",
    slug: "haveli-courtyard-jaipur",
    name: "Haveli Courtyard Jaipur",
    location: {
      city: "Jaipur",
      country: "India",
      address: "Near Johari Bazaar, Jaipur",
      latitude: 26.9239,
      longitude: 75.8267,
      distanceFromCenterKm: 1.9
    },
    price: { amount: 7300, currency: "INR" },
    rating: 8.8,
    reviewCount: 276,
    starRating: 4,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
    ],
    provider: "mock",
    bookingUrl: "https://partners.example.com/jaipur/haveli-courtyard?marker=hopnstay_demo",
    amenities: ["Heritage decor", "Restaurant", "Terrace", "Guided tours", "Airport shuttle"],
    shortDescription: "Heritage-style stay near Jaipur's old city markets.",
    description:
      "A heritage hotel with courtyard dining, hand-painted interiors, and easy access to Jaipur landmarks.",
    rooms: [
      {
        id: "jaipur-heritage",
        name: "Heritage Room",
        description: "Traditional room with courtyard view.",
        capacity: 2,
        bedType: "Queen bed",
        pricePerNight: 7300,
        currency: "INR",
        availableRooms: 6,
        amenities: ["Courtyard view", "Breakfast", "Tea service"],
        images: [],
        refundable: true
      }
    ],
    reviews: [
      { id: "jaipur-r1", rating: 9, title: "Beautiful stay", comment: "Lovely courtyard and close to the old city.", createdAt: "2026-03-03" }
    ],
    providerOffers: [
      {
        id: "jaipur-offer-1",
        provider: "mock",
        label: "Partner heritage deal",
        price: { amount: 7300, currency: "INR" },
        bookingUrl: "https://partners.example.com/jaipur/haveli-courtyard?room=heritage&marker=hopnstay_demo",
        refundable: true
      }
    ]
  },
  {
    id: "mock_delhi_aero_link",
    slug: "aero-link-delhi",
    name: "Aero Link Delhi",
    location: {
      city: "Delhi",
      country: "India",
      address: "Aerocity, New Delhi",
      latitude: 28.5562,
      longitude: 77.1,
      distanceFromCenterKm: 12.4
    },
    price: { amount: 9100, currency: "INR" },
    rating: 8.6,
    reviewCount: 531,
    starRating: 4,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80"
    ],
    provider: "mock",
    bookingUrl: "https://partners.example.com/delhi/aero-link?marker=hopnstay_demo",
    amenities: ["Airport shuttle", "Meeting rooms", "Gym", "24-hour desk", "Restaurant"],
    shortDescription: "Airport and business hotel in Delhi Aerocity.",
    description:
      "A convenient Delhi airport hotel for layovers, meetings, and early departures, with shuttle access and business facilities.",
    rooms: [
      {
        id: "delhi-executive",
        name: "Executive Room",
        description: "Sound-insulated room with airport shuttle access.",
        capacity: 2,
        bedType: "King bed",
        pricePerNight: 9100,
        currency: "INR",
        availableRooms: 7,
        amenities: ["Shuttle", "Desk", "Breakfast"],
        images: [],
        refundable: true
      }
    ],
    reviews: [
      { id: "delhi-r1", rating: 8, title: "Best for flights", comment: "Quick airport ride and comfortable bed.", createdAt: "2026-02-11" }
    ],
    providerOffers: [
      {
        id: "delhi-offer-1",
        provider: "mock",
        label: "Partner airport deal",
        price: { amount: 9100, currency: "INR" },
        bookingUrl: "https://partners.example.com/delhi/aero-link?room=executive&marker=hopnstay_demo",
        refundable: true
      }
    ]
  }
];
