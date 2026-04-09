const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.favorite.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      name: "PropAI Admin",
      email: "admin@propai.com",
      role: "OWNER",
    }
  });

  const properties = [
    {
      title: "Modern 2BHK Corner Apartment",
      description: "Spacious and well-lit corner apartment in Gachibowli. Walking distance to major IT parks and shopping centers. Features a modern kitchen and premium fittings.",
      price: 7500000,
      location_city: "Hyderabad",
      location_state: "Telangana",
      location_country: "India",
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 1250,
      property_type: "Apartment",
      ownerId: user.id,
      amenities: JSON.stringify(["Swimming Pool", "Gym", "24/7 Security", "Power Backup"]),
      images: JSON.stringify(["/properties/modern_2bhk.png"]),
    },
    {
      title: "Luxury Villa in Jubilee Hills",
      description: "An architectural masterpiece in the heart of Jubilee Hills. This 4200 sqft villa offers unparalleled luxury with a private garden, lap pool, and smart home automation.",
      price: 125000000,
      location_city: "Hyderabad",
      location_state: "Telangana",
      location_country: "India",
      bedrooms: 4,
      bathrooms: 5,
      area_sqft: 4200,
      property_type: "Villa",
      ownerId: user.id,
      amenities: JSON.stringify(["Private Pool", "Home Theatre", "Landscaped Garden", "Smart Home"]),
      images: JSON.stringify(["/properties/luxury_villa.png"]),
    },
    {
      title: "Premium 3BHK in Kondapur",
      description: "Modern 3BHK with excellent ventilation and city views. Located in a premium gated community with all modern amenities and proximity to schools and hospitals.",
      price: 9500000,
      location_city: "Hyderabad",
      location_state: "Telangana",
      location_country: "India",
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 1800,
      property_type: "Apartment",
      ownerId: user.id,
      amenities: JSON.stringify(["Clubhouse", "Children's Play Area", "Jogging Track", "Intercom"]),
      images: JSON.stringify(["/properties/premium_3bhk.png"]),
    },
    {
      title: "Spacious 3BHK at Banjara Hills",
      description: "An elegant home in one of the most prestigious areas of Hyderabad. Recently renovated with top-of-the-line appliances and beautiful marble floors.",
      price: 18000000,
      location_city: "Hyderabad",
      location_state: "Telangana",
      location_country: "India",
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 2100,
      property_type: "Apartment",
      ownerId: user.id,
      amenities: JSON.stringify(["Balcony", "Private Terrace", "24/7 Security"]),
      images: JSON.stringify(["/properties/spacious_3bhk.png"]),
    },
    {
      title: "Cozy Studio in Hitech City",
      description: "A perfect compact home for young professionals. Fully furnished and located right in the middle of Hyderabad's IT hub.",
      price: 4500000,
      location_city: "Hyderabad",
      location_state: "Telangana",
      location_country: "India",
      bedrooms: 1,
      bathrooms: 1,
      area_sqft: 650,
      property_type: "Apartment",
      ownerId: user.id,
      amenities: JSON.stringify(["Furnished", "Gym Access", "Near Metro"]),
      images: JSON.stringify(["/properties/cozy_studio.png"]),
    }
  ];

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
