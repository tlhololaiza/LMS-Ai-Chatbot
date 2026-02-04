# Docker Development Guide

## Quick Start

### 1. Prepare Environment

```bash
# Copy example env file
cp .env.docker.example .env

# Edit .env and add your Google Gemini API key
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

### 2. Build and Run

```bash
# Build images and start services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 3. Access Services

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:4000
- **Health Check:** `curl http://localhost:4000/api/health`

---

## Available Commands

### Container Management

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove everything (containers + volumes)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

### Viewing Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs (real-time)
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Service Status

```bash
# View running containers
docker-compose ps

# View resource usage
docker stats

# View container details
docker inspect lms-ai-chatbot-backend-1
```

### Execute Commands

```bash
# Run command in backend
docker-compose exec backend npm run test

# Open backend shell
docker-compose exec backend sh

# Open frontend shell
docker-compose exec frontend sh

# Check backend environment variables
docker-compose exec backend env
```

---

## Development Workflow

### Hot Reload

The Docker setup uses volumes to enable hot reload:

1. **Frontend:** Changes auto-refresh browser
   - Vite development server watches file changes
   - HMR (Hot Module Replacement) enabled

2. **Backend:** TypeScript auto-recompiles
   - `tsx watch` monitors file changes
   - Server restarts automatically

### Making Changes

```bash
# Start containers
docker-compose up

# Edit files locally (they sync to containers automatically)
# - src/components/...
# - server/src/...

# See changes immediately:
# - Frontend: Refresh browser
# - Backend: Check logs for compilation
```

### Debugging

```bash
# View compilation errors
docker-compose logs backend

# Check network connectivity
docker-compose exec frontend curl http://backend:4000/api/health

# View API requests
docker-compose logs -f backend

# Check if API key is set
docker-compose exec backend env | grep GOOGLE_GEMINI_API_KEY
```

---

## Troubleshooting

### Containers Won't Start

```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8080  # Frontend
lsof -i :4000  # Backend

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

### API Connection Error

```bash
# Test from frontend container
docker-compose exec frontend curl http://backend:4000/api/health

# Check backend logs
docker-compose logs backend

# Verify network connectivity
docker-compose exec frontend ping backend
```

### API Key Not Working

```bash
# Verify key is set
docker-compose exec backend env | grep GOOGLE_GEMINI_API_KEY

# Update .env file
echo "GOOGLE_GEMINI_API_KEY=new_key" >> .env

# Restart backend
docker-compose down backend
docker-compose up -d backend
```

### Build Failures

```bash
# Check Docker installation
docker --version
docker-compose --version

# Free up disk space
docker system prune

# Rebuild from scratch
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up
```

---

## Performance Optimization

### Reduce Image Size

```bash
# Use alpine base images (already configured)
# Alpine Linux is ~50MB vs ~300MB for Debian

# Clean up Docker resources
docker system prune -a
docker volume prune
```

### Speed Up Builds

```bash
# Use .dockerignore (similar to .gitignore)
# Skip node_modules, dist, .git, etc.

# Cache layers effectively
# Put most stable layers first in Dockerfile
```

### Volume Performance

```bash
# On macOS, use delegated mounts for better performance
# Add to docker-compose.yml:
# volumes:
#   - .:/app:delegated
#   - /app/node_modules
```

---

## Production Deployment

### Build Production Images

```bash
# Build frontend production image
docker build -f Dockerfile --target production -t lms-ai-chatbot:latest .

# Build backend production image
docker build -f server/Dockerfile -t lms-ai-chatbot-backend:latest server/

# Tag for registry
docker tag lms-ai-chatbot:latest your-registry/lms-ai-chatbot:latest
docker push your-registry/lms-ai-chatbot:latest
```

### Production Environment

```bash
# Use .env.production
VITE_API_URL=https://api.yourdomain.com
GOOGLE_GEMINI_API_KEY=your_production_key
NODE_ENV=production
```

### Monitor Production Containers

```bash
# View resource usage
docker stats

# View logs
docker logs lms-ai-chatbot-backend-1 -f

# Get container shell for debugging
docker exec -it lms-ai-chatbot-backend-1 sh
```

---

## Security Best Practices

✅ **Non-root User:** Backend runs as nodejs user  
✅ **API Key Security:** Never commit .env to git  
✅ **Health Checks:** Automatic service monitoring  
✅ **Network Isolation:** Services use private network  
✅ **Minimal Images:** Alpine base reduces attack surface  
✅ **Secrets Management:** Use docker secrets in production  

---

## Further Reading

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js in Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Vite Docker Setup](https://vitejs.dev/guide/env-and-modes.html)
