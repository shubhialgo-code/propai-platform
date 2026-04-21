const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// List of actually existing images in frontend/public/properties/
const EXISTING_IMAGES = [
  "/properties/cozy_studio.png",
  "/properties/luxury_villa.png",
  "/properties/modern_2bhk.png",
  "/properties/modern_apartment.png",
  "/properties/premium_3bhk.png",
  "/properties/scenic_villa.png",
  "/properties/spacious_3bhk.png"
];

async function update() {
  try {
    const properties = await prisma.property.findMany();
    console.log(`Checking ${properties.length} properties...`);

    for (const p of properties) {
      let images = [];
      try {
        images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
      } catch (e) {
        console.log(`Failed to parse images for ${p.id}, resetting to default.`);
        images = [];
      }

      // Filter or replace missing images
      let updatedImages = images.filter(img => EXISTING_IMAGES.includes(img));
      
      // If no valid images left, or if it was empty, assign a random existing one
      if (updatedImages.length === 0) {
        const randomImg = EXISTING_IMAGES[Math.floor(Math.random() * EXISTING_IMAGES.length)];
        updatedImages = [randomImg];
        console.log(`Property "${p.title}" had missing/invalid images. Assigned: ${randomImg}`);
      }

      await prisma.property.update({
        where: { id: p.id },
        data: {
          images: JSON.stringify(updatedImages)
        }
      });
    }

    console.log("Database update complete! All properties now use existing assets.");
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

update();
