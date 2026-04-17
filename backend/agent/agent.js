const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const OpenAI = require("openai");
const path = require("path");
require('dotenv').config();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function getAgentResponse(userQuery) {
  const mcpServerPath = path.resolve(__dirname, "../mcp/build/index.js");
  const nodePath = "node";

  // Vercel / Serverless check: Stdio transport is not supported
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return "AI Agent functionality is currently limited in the cloud environment. Please use the local development setup for full features.";
  }

  const transport = new StdioClientTransport({
    command: nodePath,
    args: [mcpServerPath],
    env: process.env,
  });

  const mcpClient = new Client({
    name: "property-agent-client",
    version: "1.0.0",
  }, {
    capabilities: {},
  });

  try {
    await mcpClient.connect(transport);

    // List tools from MCP server
    const { tools } = await mcpClient.listTools();

    // Generate tool-calling prompt for LLM
    const messages = [
      { 
        role: "system", 
        content: "You are an AI Real Estate assistant for PropAI. You MUST ONLY search for and provide property information for Hyderabad and Bangalore. If asked for other locations, explain that PropAI currently only supports these two cities."
      },
      { role: "user", content: userQuery }
    ];
    const availableTools = tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema,
      },
    }));

    if (!openai) {
      console.log("No API key - Switching to Demo Mode (Keyword Search)");
      
      // Basic extraction of search terms
      let location = null;
      const lowerQuery = userQuery.toLowerCase();
      // Only allow Hyderabad and Bangalore
      if (lowerQuery.includes("hyderabad")) location = "Hyderabad";
      else if (lowerQuery.includes("bangalore") || lowerQuery.includes("bengaluru")) location = "Bangalore";
      
      let propertyType = null;
      if (lowerQuery.includes("villa")) propertyType = "Villa";
      else if (lowerQuery.includes("apartment")) propertyType = "Apartment";

      if (location) {
        console.log(`Demo Mode Search: location=${location}, type=${propertyType}`);
      } else {
         return `[Demo Mode] I'm currently running without an AI key and I can only search for properties in Hyderabad and Bangalore. Try asking for "Villas in Hyderabad" or "Apartments in Bangalore".`;
      }

      // Call MCP search tool directly
      // Map nulls to undefined to avoid Prisma complaining about explicit nulls in queries
      const result = await mcpClient.callTool({
        name: "search_properties",
        arguments: { 
          location: location || undefined, 
          propertyType: propertyType || undefined 
        },
      });

      if (result.isError || result.content[0].text.startsWith('Error:')) {
         return `[Demo Mode] I encountered a database issue: ${result.content[0].text}`;
      }

      let properties = [];
      try {
        properties = JSON.parse(result.content[0].text);
      } catch (e) {
        return `[Demo Mode] Failed to parse results: ${result.content[0].text}`;
      }
      
      if (!Array.isArray(properties) || properties.length === 0) {
        return `[Demo Mode] I'm currently running without an AI key. I couldn't find any properties matching "${userQuery}" in my basic search. Try asking for "Kondapur" or "Villas".`;
      }

      let response = `[Demo Mode] I found ${properties.length} properties matching your interest:\n\n`;
      properties.slice(0, 3).forEach(p => {
        response += `- **${p.title}** in ${p.location_city}: ₹${(p.price / 100000).toFixed(2)} Lakhs\n`;
      });
      response += `\n*Note: To enable full natural language search and smart recommendations, please add an \`OPENAI_API_KEY\` to your \`.env\` file.*`;
      
      return response;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools: availableTools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.tool_calls) {
      messages.push(responseMessage);
      const { generateEmbedding } = require('./embeddings');

      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        let functionArgs = JSON.parse(toolCall.function.arguments);

        console.log(`Calling MCP tool: ${functionName} with args:`, functionArgs);

        // Pre-process tools that need embeddings
        if (functionName === "semantic_property_search" && functionArgs.query) {
          const embedding = await generateEmbedding(functionArgs.query);
          functionArgs = { embedding, limit: functionArgs.limit };
        }

        if (functionName === "add_property" && !functionArgs.embedding) {
          const textToEmbed = `${functionArgs.title} ${functionArgs.description || ""}`;
          const embedding = await generateEmbedding(textToEmbed);
          functionArgs.embedding = embedding;
        }

        const result = await mcpClient.callTool({
          name: functionName,
          arguments: functionArgs,
        });

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(result.content),
        });
      }

      // Final summary from LLM
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
      });

      return secondResponse.choices[0].message.content;
    }

    return responseMessage.content;
  } catch (error) {
    console.error("Agent error:", error);
    return `I encountered an error trying to process your real estate query. [Demo Mode] Details: ${error.message}`;
  } finally {
    // We might want to keep the transport open for performance, 
    // but for now we close it to be safe.
    try { await mcpClient.close(); } catch (e) {}
  }
}

module.exports = { getAgentResponse };
