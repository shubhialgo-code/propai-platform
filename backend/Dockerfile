# Use Node.js 20 as the base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies for SQLite/Prisma
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (if applicable)
RUN npx prisma generate || echo "Prisma generate skipped"

# --- Runtime Stage ---
FROM node:20-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /app

# Expose the backend port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Command to run the application
CMD ["npm", "run", "start"]
