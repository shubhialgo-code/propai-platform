# 🏘️ PropAI Platform

**PropAI** is a premium, AI-powered real estate platform specializing in the Hyderabad market. It leverages cutting-edge AI to help users discover luxury villas, modern apartments, and cozy studios through conversational search and intelligent filtering.

![PropAI Banner](https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80)

## 🚀 Key Features

- **🤖 AI Real Estate Assistant**: Conversational search powered by Model Context Protocol (MCP).
- **🏙️ Hyper-Local Data**: Specialized focus on Hyderabad's top localities (Gachibowli, Jubilee Hills, etc.).
- **💎 Premium UI**: A glassmorphic, high-performance interface built with Next.js and Vanilla CSS.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **⚡ Fast Search**: Real-time filtering by price, location, bedrooms, and property type.

## 📁 Architecture

The project is structured as a robust monorepo:

- **`frontend/`**: Next.js 16 (Pages Router) application with TypeScript and Tailwind-inspired custom styles.
- **`backend/`**: Express.js server managing the AI Agent, MCP tools, and SQLite database.
- **`backend/mcp/`**: MCP server implementation for tool-driven property querying.
- **`.github/workflows/`**: Automated CI/CD pipelines for build verification and linting.

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, Prisma (SQLite), Model Context Protocol.
- **DevOps**: GitHub Actions, Docker (Optional).

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v18 or higher.
- **Git**: For version control.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shubhialgo-code/propai-platform.git
   cd propai-platform
   ```

2. **Install Dependencies**:
   ```bash
   # Install root tools (if any)
   npm install

   # Install backend dependencies
   cd backend && npm install && cd ..

   # Install frontend dependencies
   cd frontend && npm install && cd ..
   ```

3. **Environment Setup**:
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="your-api-key-here" # Optional: AI falls back to Demo Mode if missing
   ```

4. **Initialize Database**:
   ```bash
   cd backend
   node db/seed.js
   cd ..
   ```

### Running Locally

You can launch both services simultaneously using the Windows batch script:
```bash
./run_app.bat
```

Or manually:
- **Backend**: `cd backend && npm run dev` (Runs on port 5000)
- **Frontend**: `cd frontend && npm run dev` (Runs on port 3000)

## 🧪 CI/CD

The platform includes a **GitHub Actions CI** workflow that automatically:
1. Validates backend dependencies.
2. Performs strict TypeScript type-checking on the frontend.
3. Executes ESLint for code quality.
4. Verifies the production build.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the PropAI Engineering Team.
