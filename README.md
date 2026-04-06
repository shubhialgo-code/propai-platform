# PropAI Platform

A comprehensive real-estate platform with an AI-powered property assistant.

## Project Structure

```
├── backend/            # Express.js server & MCP tools
├── frontend/           # Next.js user interface
├── .github/workflows/  # CI/CD pipeline configurations
└── run_app.bat         # Windows batch script to launch services
```

## Getting Started

### Local Development

1. **Prerequisites**: Node.js v18+ installed.
2. **Setup**: Run `npm install` in both `backend/` and `frontend/` directories.
3. **Environment**: Create a `.env` file in the `backend/` directory (see `backend/.env` for example).
4. **Run**: Use the `run_app.bat` script or run `npm run dev` in both folders.

## CI/CD

This project uses **GitHub Actions** for continuous integration. The workflow is defined in `.github/workflows/ci.yml` and runs automatically on every push.
