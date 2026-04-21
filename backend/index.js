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
// Note: We mount all API routes under /api so both Vercel serverless and local dev share the same base path.
const apiRouter = express.Router();
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/favorites', favoriteRoutes);
apiRouter.use('/', aiRoutes); // ai-query, etc.

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'PropAI API', environment: process.env.NODE_ENV });
});


if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT} [Monorepo Structure]`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    }
  });
}

// Export the app for Vercel serverless
module.exports = app;
