const express = require('express');
const cors = require('cors');
require('dotenv').config();

const propertyRoutes = require('./routes/property.routes');
const aiRoutes = require('./routes/ai.routes');
const favoriteRoutes = require('./routes/favorite.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend monorepo is running' });
});

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api', aiRoutes);


const server = app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT} [Monorepo Structure]`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  }
});

// Keep process alive
setInterval(() => {
  // Heartbeat to keep the event loop busy just in case
}, 60000);
