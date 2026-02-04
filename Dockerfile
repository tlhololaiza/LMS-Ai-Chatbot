# Multi-stage Dockerfile for React + Vite Frontend
# Stage 1: Development stage with hot reload
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose development port
EXPOSE 5173

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# Stage 2: Build stage - compile production build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 3: Production stage - serve with Nginx
FROM nginx:alpine AS production

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/api/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
