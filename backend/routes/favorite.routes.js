const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/favorites (Toggle)
router.post('/', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    
    // Check if it already exists
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: userId,
        propertyId: propertyId
      }
    });

    if (existing) {
      // Delete if already exists (Un-favorite)
      await prisma.favorite.delete({
        where: {
          id: existing.id
        }
      });
      return res.status(200).json({ saved: false, message: "Removed from favorites" });
    } else {
      // Create if doesn't exist (Favorite)
      const favorite = await prisma.favorite.create({ 
        data: { userId, propertyId } 
      });
      return res.status(201).json({ saved: true, favorite });
    }
  } catch (error) {
    console.error('POST /api/favorites error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/favorites
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const favorites = await prisma.favorite.findMany({
      where: { userId: String(userId) },
      include: { property: true }
    });
    res.json(favorites);
  } catch (error) {
    console.error('GET /api/favorites error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
