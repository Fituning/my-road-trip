# 1. Base image with Node.js (Slim version for smaller footprint)
FROM node:20-slim AS base
WORKDIR /app

# 2. Copy package files first to leverage Docker layer caching
COPY package*.json ./

# 3. Install dependencies
RUN npm install

# 4. Copy the rest of the application code
COPY . .

# 5. Define runtime environment variables
ENV PORT=3000
ENV HOST=0.0.0.0

# 6. Expose the port Nuxt will run on
EXPOSE 3000

# 7. Default command for development (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]