const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateEmbedding } = require('../agent/embeddings');

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, propertyType, bedrooms } = req.query;
    const where = {};
    
    if (location) {
      where.OR = [
        { location_city: { contains: location } },
        { location_state: { contains: location } },
        { title: { contains: location } },
        { description: { contains: location } },
      ];
    }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
    if (propertyType && propertyType !== 'All') where.property_type = propertyType;
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    
    const properties = await prisma.property.findMany({ 
      where,
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({ 
      where: { id: req.params.id },
      include: { owner: true }
    });
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create property
router.post('/', async (req, res) => {
  try {
    // Demo safety fallback: ensure dummy owner exists
    if (req.body.ownerId === "user-123") {
      try {
        const existingUser = await prisma.user.findFirst({ where: { id: "user-123" } });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: "user-123",
              email: "demo@propai.com",
              name: "Demo Seller",
              role: "OWNER"
            }
          });
        }
      } catch (userErr) {
        console.error("Warning: Failed to ensure dummy user exists:", userErr);
      }
    }

    const textToEmbed = `${req.body.title} ${req.body.description || ""}`;
    const embedding = await generateEmbedding(textToEmbed);
    const property = await prisma.property.create({ 
      data: { ...req.body, embedding: embedding ? JSON.stringify(embedding) : undefined } 
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    await prisma.property.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
