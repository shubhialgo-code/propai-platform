const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const properties = await prisma.property.findMany({ take: 5 });
    console.log("Found properties:", properties.length);
    properties.forEach(p => {
      console.log(`ID: ${p.id}, Title: ${p.title}`);
      console.log(`Images (raw): ${p.images} (type: ${typeof p.images})`);
      try {
        const parsed = JSON.parse(p.images);
        console.log(`Images (parsed):`, parsed);
      } catch (e) {
        console.log(`Failed to parse images: ${e.message}`);
      }
      console.log('---');
    });
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
