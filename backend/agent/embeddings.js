const OpenAI = require("openai");
require('dotenv').config();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function generateEmbedding(text) {
  if (!text) return null;
  
  if (!openai) {
    console.error("OpenAI API key is missing for embeddings.");
    return null;
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

module.exports = { generateEmbedding };
