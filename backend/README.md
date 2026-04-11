# 🔙 PropAI Backend

The core engine of the PropAI platform, managing the AI Agent, MCP Server, and Database.

## 🚀 Features
- **Express.js API**: High-performance REST endpoints.
- **MCP Server**: Model Context Protocol implementation for tool-use.
- **SQLite Database**: persistent storage with Prisma ORM.
- **AI Agent**: Intelligent conversational logic.

## 🛠️ Setup
1. `npm install`
2. Configure `.env` with `DATABASE_URL` and `OPENAI_API_KEY`.
3. `npm run dev` to start the server.

## 📁 Structure
- `/mcp`: Tool definitions and MCP SDK integration.
- `/agent`: Main AI agent orchestration logic.
- `/db`: Database schemas and seed scripts.
- `/routes`: API endpoint definitions.
