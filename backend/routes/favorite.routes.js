const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/favorites
router.post('/', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    const favorite = await prisma.favorite.create({ data: { userId, propertyId } });
    res.status(201).json(favorite);
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
