# Use Node.js 18 Alpine
FROM node:18-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript → JavaScript
RUN npm run build

# Add any native deps (optional)
RUN apk add --no-cache openssl

# Expose Render port
ENV PORT=4000
EXPOSE 4000

# Start the built server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]