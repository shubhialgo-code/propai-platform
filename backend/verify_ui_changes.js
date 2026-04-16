const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = "5459b8b1-85ac-41a1-b1c7-ddfa11a57c99";

  const propertyCount = await prisma.property.count();
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { property: true }
  });

  console.log(`Total properties: ${propertyCount}`);
  console.log(`User favorites count: ${favorites.length}`);
  if (favorites.length > 0) {
    console.log(`Latest favorite: ${favorites[favorites.length - 1].property.title}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
