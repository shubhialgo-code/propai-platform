// This is the root entry point for Vercel Serverless Functions
const app = require('../backend/index.js');

// Vercel expects an exported function or the express app directly
module.exports = app;
