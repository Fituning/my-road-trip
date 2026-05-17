# Stage 1: Build the Nuxt application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions first to leverage Docker layer caching
COPY package*.json ./

# Use 'npm ci' for a clean, deterministic, and faster installation
RUN npm ci

# Copy the rest of the source code and build the project
COPY . .
RUN npm run build

# Stage 2: Setup the production runner
# Alpine is used to keep the final image size to an absolute minimum
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the compiled output from the builder stage
# Nuxt's Nitro engine bundles everything needed inside this standalone folder
COPY --from=builder /app/.output ./.output

# Define strict environment variables for production
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Expose the internal port Nuxt will listen on
EXPOSE 3000

# Start the optimized Nitro standalone server
CMD ["node", ".output/server/index.mjs"]