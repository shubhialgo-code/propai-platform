const express = require('express');
const router = express.Router();
const { getAgentResponse } = require('../agent/agent');

router.post('/ai-query', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });
  
  try {
    const response = await getAgentResponse(query);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
