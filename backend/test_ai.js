const axios = require('axios');

async function testAI() {
  try {
    console.log("Testing AI Assistant API with query: 'villa in hyderabad'...");
    const response = await axios.post('http://localhost:5000/api/ai-query', {
      query: 'villa in hyderabad'
    });
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.status, error.response.data);
    } else {
      console.error("Connectivity Error:", error.message);
    }
  }
}

testAI();
