const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ownerId = "5459b8b1-85ac-41a1-b1c7-ddfa11a57c99";

  const properties = [
    {
      title: "Sunset Beach Villa",
      description: "A breathtaking waterfront villa in North Goa with direct access to a private beach. Features a large pool, open terrace, and modern interiors.",
      price: 65000000,
      location_city: "Goa",
      location_state: "Goa",
      location_country: "India",
      bedrooms: 4,
      bathrooms: 4,
      area_sqft: 3500,
      property_type: "Villa",
      ownerId: ownerId,
      amenities: JSON.stringify(["Beach Access", "Pool", "Open Kitchen", "Security"]),
      images: JSON.stringify(["/properties/goa_villa.png"]),
    },
    {
      title: "Skyline Penthouse",
      description: "Experience the height of luxury in this duplex penthouse in Worli, Mumbai. Panoramic city and sea views with high-end designer fittings throughout.",
      price: 180000000,
      location_city: "Mumbai",
      location_state: "Maharashtra",
      location_country: "India",
      bedrooms: 3,
      bathrooms: 4,
      area_sqft: 2800,
      property_type: "Apartment",
      ownerId: ownerId,
      amenities: JSON.stringify(["Sea View", "Private Lift", "Clubhouse", "Concierge"]),
      images: JSON.stringify(["/properties/mumbai_penthouse.png"]),
    },
    {
      title: "Pine Grove Cottage",
      description: "A charming wooden cottage situated in a quiet pine grove near Manali. Ideal for mountain lovers seeking peace and incredible views of the Himalayas.",
      price: 22000000,
      location_city: "Manali",
      location_state: "Himachal Pradesh",
      location_country: "India",
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 1500,
      property_type: "Villa",
      ownerId: ownerId,
      amenities: JSON.stringify(["Mountain View", "Fireplace", "Wooden Deck", "Parking"]),
      images: JSON.stringify(["/properties/manali_cottage.png"]),
    }
  ];

  for (const p of properties) {
    const property = await prisma.property.create({ data: p });
    console.log(`Created property: ${property.title}`);
  }

  console.log("All properties saved successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
