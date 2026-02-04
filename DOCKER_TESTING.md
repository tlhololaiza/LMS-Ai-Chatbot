# Docker Testing Guide

## Test Checklist

Use this guide to verify the Docker setup works correctly before deploying to production.

### Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Valid Google Gemini API key

---

## Test 1: Configuration Validation

### Test 1.1: Validate docker-compose.yml Syntax

```bash
# Navigate to project root
cd LMS-Ai-Chatbot

# Validate configuration
docker-compose config

# Expected Output:
# version: '3.8'
# services:
#   backend:
#     ...
#   frontend:
#     ...
```

**What This Tests:**
- YAML syntax is correct
- All service references resolve
- Environment variables are properly defined

---

## Test 2: Build Images

### Test 2.1: Build Backend Image

```bash
# Build backend
docker-compose build backend

# Expected Output:
# [+] Building 45.2s
# => => => => naming to docker.io/library/lms-ai-chatbot-backend:latest
```

**What This Tests:**
- Dockerfile syntax is valid
- TypeScript compilation works
- Dependencies are installed

### Test 2.2: Build Frontend Image

```bash
# Build frontend
docker-compose build frontend

# Expected Output:
# [+] Building 52.3s
# => => naming to docker.io/library/lms-ai-chatbot-frontend:latest
```

**What This Tests:**
- React app compiles
- Vite build is successful
- Node modules are installed

---

## Test 3: Service Startup

### Test 3.1: Start Services

```bash
# Start all services
docker-compose up

# Or start in background
docker-compose up -d

# Expected Output:
# Creating lms-ai-chatbot-backend-1  ... done
# Creating lms-ai-chatbot-frontend-1 ... done
# backend-1   | Server running on port 4000
# frontend-1  | VITE v5.4.19 ready in 456 ms
```

**What This Tests:**
- Both containers start successfully
- No port conflicts
- Environment variables are loaded

### Test 3.2: Check Container Status

```bash
# View running containers
docker-compose ps

# Expected Output:
# NAME                                COMMAND                  SERVICE      STATUS      PORTS
# lms-ai-chatbot-backend-1           "npm run dev"            backend      Up 5 seconds 0.0.0.0:4000->4000/tcp
# lms-ai-chatbot-frontend-1          "npm run dev"            frontend     Up 5 seconds 0.0.0.0:8080->5173/tcp
```

**What This Tests:**
- Both containers are running
- Ports are properly mapped
- No crashes or failures

---

## Test 4: Network Connectivity

### Test 4.1: Test Backend Health

```bash
# Health check from host
curl http://localhost:4000/api/health

# Expected Output:
# {
#   "status": "ok",
#   "timestamp": "2026-02-04T12:34:56.789Z"
# }
```

**What This Tests:**
- Backend is accessible
- API is responding
- No port conflicts with other services

### Test 4.2: Test Inter-container Communication

```bash
# Test from frontend container
docker-compose exec frontend curl http://backend:4000/api/health

# Expected Output:
# {
#   "status": "ok",
#   "timestamp": "2026-02-04T12:34:56.789Z"
# }
```

**What This Tests:**
- Docker network resolution works
- Frontend can reach backend using service name
- Internal communication is functioning

### Test 4.3: Test Frontend Access

```bash
# Open browser and navigate to
http://localhost:8080

# Expected:
# LMS Dashboard loads without errors
# No console errors related to API connection
```

**What This Tests:**
- Frontend is serving correctly
- No 404 errors for assets
- SPA routing works

---

## Test 5: API Endpoint Testing

### Test 5.1: Send Chat Message

```bash
# Send message to backend
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are React hooks?",
    "conversationHistory": [],
    "metadata": {"source": "test"}
  }'

# Expected Output:
# {
#   "response": "React hooks are functions that let you use state...",
#   "timestamp": "2026-02-04T12:34:56.789Z",
#   "conversationId": "conv-1707038096789"
# }
```

**What This Tests:**
- Backend can process messages
- Google Gemini API key is working
- Response generation is successful

### Test 5.2: Test Streaming Endpoint

```bash
# Test streaming endpoint
curl -X POST http://localhost:4000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain useState",
    "conversationHistory": []
  }'

# Expected Output:
# data: {"chunk":"React"}
# data: {"chunk":" hooks"}
# data: [DONE]
```

**What This Tests:**
- Streaming API is working
- Server-Sent Events are configured
- Real-time message delivery functions

---

## Test 6: Volume Mounting

### Test 6.1: Test Hot Reload - Frontend

```bash
# 1. Start services
docker-compose up

# 2. Navigate to http://localhost:8080

# 3. Edit a frontend file
# Example: src/App.tsx - change title

# 4. Observe browser auto-refresh
# Expected: Page updates without manual refresh
```

**What This Tests:**
- Volume mounting works
- File changes sync to container
- HMR (Hot Module Replacement) functions

### Test 6.2: Test Hot Reload - Backend

```bash
# 1. Check backend logs
docker-compose logs -f backend

# 2. Edit backend file
# Example: server/index.ts - add console.log

# 3. Observe logs for TypeScript recompilation
# Expected: File watched, recompiled, server restarted
```

**What This Tests:**
- Backend file watching works
- TypeScript auto-compilation functions
- Server restarts on changes

---

## Test 7: Environment Variables

### Test 7.1: Verify API Key is Loaded

```bash
# Check if API key is set in backend
docker-compose exec backend env | grep GOOGLE_GEMINI_API_KEY

# Expected Output:
# GOOGLE_GEMINI_API_KEY=sk-...your-key...
```

**What This Tests:**
- Environment variables are properly loaded from .env
- API key is accessible in container
- Secrets are not exposed in logs

### Test 7.2: Verify Frontend Configuration

```bash
# Check if frontend has API URL
docker-compose exec frontend env | grep VITE_API_URL

# Expected Output:
# VITE_API_URL=http://backend:4000
```

**What This Tests:**
- Frontend environment variables are set
- Service name resolution is configured
- Frontend knows where to reach backend

---

## Test 8: Error Handling

### Test 8.1: Test Invalid API Key

```bash
# Temporarily modify .env
# Change GOOGLE_GEMINI_API_KEY to an invalid value

# Restart backend
docker-compose restart backend

# Try to send a message
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Expected Output:
# {
#   "error": "Failed to generate response",
#   "message": "Invalid API key"
# }
```

**What This Tests:**
- Error handling works
- Graceful failure with meaningful messages
- No crashes on invalid configuration

### Test 8.2: Test Connection Failure

```bash
# Stop backend
docker-compose stop backend

# Try to access from frontend
# Browser DevTools > Network Tab

# Expected:
# 503 Service Unavailable
# Or connection timeout
```

**What This Tests:**
- Frontend handles backend unavailability
- Error messages are user-friendly
- No application crash

---

## Test 9: Container Lifecycle

### Test 9.1: Test Service Restart

```bash
# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs backend

# Expected:
# Backend restarts and comes back online
# No data loss or errors
```

**What This Tests:**
- Containers restart cleanly
- No orphaned processes
- Graceful shutdown and startup

### Test 9.2: Test Health Check

```bash
# Start containers and wait for health check
docker-compose up -d

# Wait 30 seconds

# Check health status
docker-compose ps

# Expected Output:
# lms-ai-chatbot-backend-1    ... (healthy)
```

**What This Tests:**
- Health check endpoint is working
- Docker recognizes healthy/unhealthy state
- Automatic restart would be triggered if unhealthy

---

## Test 10: Production Build

### Test 10.1: Build Production Frontend Image

```bash
# Build frontend with production target
docker build -f Dockerfile --target production -t lms-ai-chatbot-prod:latest .

# Expected Output:
# [+] Building production image
# => => naming to docker.io/library/lms-ai-chatbot-prod:latest
```

**What This Tests:**
- Production build completes
- Nginx configuration is valid
- Static files are served

### Test 10.2: Test Production Backend Image

```bash
# Build backend production image
docker build -f server/Dockerfile -t lms-ai-chatbot-backend-prod:latest server/

# Run container
docker run -p 4000:4000 \
  -e GOOGLE_GEMINI_API_KEY=your_key \
  lms-ai-chatbot-backend-prod:latest

# Expected Output:
# Server running on port 4000
```

**What This Tests:**
- Production image builds successfully
- Non-root user is used
- Minimal image size with only production dependencies

---

## Test 11: Performance

### Test 11.1: Check Image Sizes

```bash
# List images with sizes
docker images | grep lms-ai-chatbot

# Expected Output:
# REPOSITORY                    TAG        SIZE
# lms-ai-chatbot-backend        latest     250MB (alpine base)
# lms-ai-chatbot-frontend       latest     90MB (nginx)
```

**What This Tests:**
- Images use alpine for smaller size
- Multi-stage builds reduce final size
- No unnecessary layers

### Test 11.2: Monitor Resource Usage

```bash
# View container resource usage
docker stats

# Expected:
# Monitor memory and CPU during operation
# Memory should stabilize around 100-200MB per container
# CPU usage should be minimal at idle
```

**What This Tests:**
- Containers don't consume excessive resources
- Memory leaks are not present
- Performance is acceptable

---

## Test 12: Cleanup and Teardown

### Test 12.1: Stop Services Cleanly

```bash
# Stop all services
docker-compose stop

# Expected Output:
# Stopping lms-ai-chatbot-frontend-1 ... done
# Stopping lms-ai-chatbot-backend-1  ... done
```

**What This Tests:**
- Services stop gracefully
- No hanging processes
- Clean container termination

### Test 12.2: Remove Containers and Volumes

```bash
# Remove everything
docker-compose down -v

# Expected Output:
# Removing lms-ai-chatbot-frontend-1 ... done
# Removing lms-ai-chatbot-backend-1  ... done
# Removing volume lms-ai-chatbot_postgres_data
```

**What This Tests:**
- Complete cleanup works
- No orphaned resources
- Volumes are removed correctly

---

## Test Results Template

```markdown
## Docker Test Results - [DATE]

**Environment:**
- Docker Version: [VERSION]
- OS: [WINDOWS/MAC/LINUX]
- Node Version: [VERSION]

**Test 1: Configuration Validation** ✅/❌
- docker-compose config: ✅

**Test 2: Build Images** ✅/❌
- Backend build: ✅
- Frontend build: ✅

**Test 3: Service Startup** ✅/❌
- Service startup: ✅
- Container status: ✅

**Test 4: Network Connectivity** ✅/❌
- Backend health: ✅
- Frontend access: ✅

**Test 5: API Endpoints** ✅/❌
- Chat endpoint: ✅
- Streaming endpoint: ✅

**Test 6: Volume Mounting** ✅/❌
- Frontend hot reload: ✅
- Backend hot reload: ✅

**Test 7: Environment Variables** ✅/❌
- API key loaded: ✅
- Frontend config: ✅

**Test 8: Error Handling** ✅/❌
- Invalid API key: ✅
- Connection failure: ✅

**Test 9: Container Lifecycle** ✅/❌
- Service restart: ✅
- Health check: ✅

**Test 10: Production Build** ✅/❌
- Frontend prod build: ✅
- Backend prod build: ✅

**Test 11: Performance** ✅/❌
- Image sizes: ✅
- Resource usage: ✅

**Test 12: Cleanup** ✅/❌
- Services stop: ✅
- Volume cleanup: ✅

**Overall Result:** ✅ ALL TESTS PASSED
```

---

## Troubleshooting Failed Tests

### If docker-compose config fails
```bash
# Check YAML syntax
docker-compose config

# Fix issues in docker-compose.yml
# Common issues: indentation, missing quotes
```

### If build fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### If services don't start
```bash
# Check logs
docker-compose logs

# Look for:
# - Port conflicts
# - Missing environment variables
# - Dependency issues
```

### If API calls fail
```bash
# Test connectivity
docker-compose exec frontend curl http://backend:4000/api/health

# Check firewall/network rules
# Verify .env has correct API key
```

---

## Running CI/CD Tests

For automated testing in CI/CD pipelines:

```bash
#!/bin/bash
set -e

# Build
docker-compose build

# Start services
docker-compose up -d

# Wait for services
sleep 10

# Health check
curl -f http://localhost:4000/api/health || exit 1

# Test API
curl -f -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' || exit 1

# Cleanup
docker-compose down

echo "All Docker tests passed!"
```

---

## Performance Benchmarks

**Expected performance metrics:**

| Metric | Target | Actual |
|--------|--------|--------|
| Backend startup time | < 5s | - |
| Frontend compile time | < 3s | - |
| API response time | < 2s | - |
| Memory per container | < 300MB | - |
| Image size (backend) | < 300MB | - |
| Image size (frontend) | < 100MB | - |

---

## Next Steps

After all tests pass:

1. ✅ Commit Docker files to git
2. ✅ Document any custom configurations
3. ✅ Set up CI/CD pipeline for automated testing
4. ✅ Deploy to staging environment
5. ✅ Performance test in staging
6. ✅ Deploy to production

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-04  
**Status:** Ready for Testing
