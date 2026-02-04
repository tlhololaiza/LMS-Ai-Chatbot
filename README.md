# 🎓 CodeTribe LMS - AI-Powered Learning Management System# CodeTribe LMS - Learning Management System



<div align="center">## Project Info



![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)A modern Learning Management System built for CodeTribe Academy. This platform provides an interactive learning experience with courses, tutorials, progress tracking, and an AI-powered chatbot assistant.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)## Features

![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **Dashboard**: Overview of your learning progress

A modern, interactive Learning Management System built for CodeTribe Academy featuring an **intelligent AI chatbot** with text-to-explanation capabilities.- **Courses**: Access to React, TypeScript, and other programming tutorials

- **Tasks**: Assignment tracking and submission

[Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Live Demo](#)- **Progress**: Visual representation of your learning journey

- **Announcements**: Stay updated with the latest news

</div>- **AI Chatbot**: Get help with your learning



---## How to Run



## 📋 Table of ContentsThe only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)



- [Overview](#-overview)Follow these steps:

- [Features](#-features)

- [Tech Stack](#-tech-stack)```sh

- [Installation](#-installation)# Step 1: Clone the repository

- [Branch Structure](#-branch-structure)git clone <YOUR_GIT_URL>

- [Implementation Status](#-implementation-status)

- [Contributing](#-contributing)# Step 2: Navigate to the project directory

cd lms-chatbot-main

---

# Step 3: Install the necessary dependencies

## 🌟 Overviewnpm install



CodeTribe LMS is a comprehensive learning platform designed to enhance the educational experience for coding bootcamp students. The system combines traditional LMS features with cutting-edge AI assistance, enabling learners to get instant explanations for concepts they don't understand by simply highlighting text.# Step 4: Start the development server

npm run dev

### 🎯 Key Highlights```



- **Interactive Learning**: Engage with course materials through an intuitive interface## Technologies Used

- **AI-Powered Assistance**: Highlight any text and get instant AI explanations ✨

- **Progress Tracking**: Monitor your learning journey with detailed analyticsThis project is built with:

- **Task Management**: Submit assignments and track deadlines

- **Real-time Announcements**: Stay updated with course information- Vite

- TypeScript

---- React

- shadcn-ui

## ✨ Features- Tailwind CSS



### 🎓 Core Learning Features## Deployment



#### 📚 Course ManagementBuild the project for production:

- Browse multiple courses (React, TypeScript, JavaScript, etc.)

- Module-based learning structure```sh

- Progress tracking per coursenpm run build

- Locked/unlocked module system```



#### 📖 Lesson ViewerThe output will be in the `dist` folder, ready to be deployed to any static hosting service.

- Rich content display with markdown support
- Video lessons, reading materials, quizzes, and tasks
- Code syntax highlighting
- Interactive lesson completion tracking

#### ✅ Task & Assignment System
- Assignment submission with GitHub integration
- Due date tracking
- Grading and feedback system
- Status indicators (pending, submitted, graded, late)

#### 📊 Progress Dashboard
- Visual progress cards
- Overall completion percentage
- Module completion tracking
- Learning statistics

#### 📢 Announcements
- Priority-based notifications (normal, important, urgent)
- Read/unread status tracking
- Real-time updates

### 🤖 AI Chatbot Features

#### 💬 Conversational AI Assistant
- **Google Gemini AI** powered responses
- **Real-time streaming** for instant feedback
- Context-aware responses with conversation history
- Platform navigation help
- Technical concept explanations
- Deadline and task assistance

#### ✨ Text Highlight Explanation
**Branch:** `text-highlight` ✅ **IMPLEMENTED**

- **Select any text** in lessons, modules, or tasks
- **Click "Explain" button** for instant AI explanation
- **Context-aware explanations** using surrounding content
- **Automatic chatbot opening** with formatted responses
- **Keyboard shortcuts**: Enter to explain, Esc to close
- **Smart popup positioning** avoiding screen overflow
- **Mobile-friendly** touch support

**How it works:**
1. Highlight any technical term or concept
2. Popup appears with "Explain" button
3. Click or press Enter
4. AI chatbot opens with detailed explanation
5. Continue conversation if needed

#### 🔌 API Integration
**Branch:** `feature/frontend-integration` ✅ **IMPLEMENTED**

- **Frontend API Client** (`src/services/apiClient.ts`)
  - `sendMessage()` - Send chat messages with full context
  - `streamMessage()` - Real-time streaming responses
  - Conversation history management
  - Error handling with APIError class
  - Connection health checks
  
- **Backend Chat API** (`server/index.ts`)
  - `GET /api/health` - Health check endpoint
  - `POST /api/chat` - Standard chat responses
  - `POST /api/chat/stream` - Server-Sent Events streaming
  - Google Gemini AI integration
  - Knowledge base retrieval (RAG)

**Features:**
- Streaming responses for better UX
- Automatic retry on network errors
- Request/response metadata tracking
- Conversation context preservation
- Independent testing suite

**Testing:**
```bash
# Run API client tests (requires backend running)
npm run test:api-client

# Quick setup verification
npm run verify:setup

# See the full testing guide
cat API_CLIENT_TESTING.md
```

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React 0.462.0** - Icons
- **class-variance-authority** - Component variants

### Routing & State
- **React Router DOM 6.30.1** - Client routing
- **React Context API** - State management
- **React Hook Form 7.61.1** - Form handling
- **Zod 3.25.76** - Schema validation

### Additional Libraries
- **Recharts 2.15.4** - Data visualization
- **date-fns 3.6.0** - Date utilities
- **@tanstack/react-query 5.83.0** - Data fetching
- **Sonner 1.7.4** - Toast notifications

### Development Tools
- **ESLint 9.32.0** - Code linting
- **Vitest 3.2.4** - Unit testing
- **@testing-library/react 16.0.0** - Component testing

---

## 🚀 Installation

### Prerequisites
- **Node.js** v18+ ([Install with nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun**
- **Git**

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/tlhololaiza/LMS-Ai-Chatbot.git
cd LMS-Ai-Chatbot

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Frontend: Create .env file
echo "VITE_API_URL=http://localhost:4000" > .env

# Backend: Configure server/.env
cd server
cp .env.example .env
# Edit server/.env and add your Google Gemini API key
# Get free key: https://makersuite.google.com/app/apikey

# 4. Install server dependencies
npm install
cd ..

# 5. Start backend server (in separate terminal)
cd server
npm run dev

# 6. Start frontend dev server (in another terminal)
npm run dev

# 7. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:4000
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:api-client  # Test API client integration (requires server)
npm run verify:setup     # Verify API client setup
```

---

## 🤖 AI Integration

### Backend Architecture

The LMS features a **Google Gemini AI-powered** backend that provides intelligent responses with knowledge base augmentation (RAG).

**Backend Components:**
- **Express.js API Server** (runs on port 4000)
- **Google Gemini Pro** AI model
- **Knowledge Base** with 10+ concepts and FAQs
- **RAG System** for enhanced responses
- **Server-Sent Events (SSE)** for real-time streaming

---

## 🧾 Query Logging (Response Outcome) — Implemented

This project logs all chat queries and their outcomes to a structured JSONL file for auditing and troubleshooting.

### Where logs are stored
- `server/query_logs.jsonl` (append-only JSON Lines)

### Logged entries
- Query entry (created for every request):
  - `timestamp` — ISO string
  - `query` — original text
  - `category` — source/category (e.g., `dashboard`, `general`)

- Response outcome entry (created after the AI generates a reply or an error occurs):
  - `timestamp` — ISO string
  - `event` — always `"response_outcome"`
  - `query` — echoes original query
  - `category` — echoes original category
  - `outcome` — `"success" | "error"`
  - `responsePreview` — trimmed first 200 chars of AI response (only when `outcome = success`)
  - `errorMessage` — error text (only when `outcome = error`)
  - `model` — e.g., `"gemini-pro"`
  - `aiError` — `true` if the AI produced an error-like text (e.g., rate limit message)

### Why classification was needed
Some AI failures return user-friendly error text instead of throwing exceptions. We detect these and log them as `outcome = error` with an `aiError` flag so audits clearly distinguish AI errors from successful responses.

### How to test it (Windows PowerShell)
1) Start the backend:
```powershell
cd S:\CodeTribe\FINAL_PROJECTS\updated2\LMS-Ai-Chatbot\server
npm run dev
```

2) Send a standard chat request:
```powershell
$body = @{
  message = "Explain closures in JavaScript"
  conversationHistory = @(@{ role = "user"; content = "I’m confused about scope" })
  metadata = @{ source = "dashboard" }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:4000/api/chat" -Method POST -ContentType "application/json" -Body $body
```

3) Inspect the last log entries:
```powershell
Get-Content S:\CodeTribe\FINAL_PROJECTS\updated2\LMS-Ai-Chatbot\server\query_logs.jsonl | Select-Object -Last 6
```

Expected examples:
```json
{"timestamp":"...","query":"Explain closures in JavaScript","category":"dashboard"}
{"timestamp":"...","event":"response_outcome","query":"Explain closures in JavaScript","category":"dashboard","outcome":"success","responsePreview":"Closures are...","model":"gemini-pro"}
```
or, when AI returns an error-like message:
```json
{"timestamp":"...","event":"response_outcome","query":"Explain closures in JavaScript","category":"dashboard","outcome":"error","errorMessage":"Sorry, I encountered an error. Please try again.","model":"gemini-pro","aiError":true}
```

### POPIA considerations
- We trim response previews to 200 chars and avoid logging full message bodies.
- Do not include PII in metadata; keep `category/source` generic.

### Implementation locations
- Backend logging functions: `server/logger.ts`
- Endpoints wiring: `server/index.ts` (`/api/chat` and `/api/chat/stream`)

Status: ✅ Completed (response outcome logging)

---

## 🧭 Escalation Event Logging — Implemented

Record when a conversation is escalated (e.g., to a mentor/support/moderation) with reason and context. Entries are appended alongside query and outcome logs.

### API Endpoint
- `POST /api/log-escalation`

### Payload
```json
{
  "query": "Explain closures in JavaScript",
  "category": "dashboard",
  "reason": "Low confidence from AI",
  "escalationType": "human_review",
  "target": "mentor",
  "severity": "medium",
  "correlationId": "conv-12345"
}
```

### Example log entry
```json
{"timestamp":"...","event":"escalation","query":"Explain closures in JavaScript","category":"dashboard","reason":"Low confidence from AI","escalationType":"human_review","target":"mentor","severity":"medium","correlationId":"conv-12345"}
```

### How to test (Windows PowerShell)
```powershell
cd S:\CodeTribe\FINAL_PROJECTS\updated2\LMS-Ai-Chatbot\server
npm run dev

$body = @{
  query = "Explain closures in JavaScript"
  category = "dashboard"
  reason = "Low confidence from AI"
  escalationType = "human_review"
  target = "mentor"
  severity = "medium"
  correlationId = "conv-12345"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:4000/api/log-escalation" -Method POST -ContentType "application/json" -Body $body
Get-Content S:\CodeTribe\FINAL_PROJECTS\updated2\LMS-Ai-Chatbot\server\query_logs.jsonl | Select-Object -Last 4
```

### Implementation locations
- Logger function: `server/logger.ts` (`logEscalationEvent`)
- Endpoint: `server/index.ts` (`POST /api/log-escalation`)

Status: ✅ Completed (backend + endpoint; wire frontend triggers as needed)

---

## 🔐 Tamper-Evident Logging (Hash Chain) — Implemented (Conceptual)

Each new log entry (query, outcome, escalation) includes a **hash chain** so tampering is detectable:
- `chainPrevHash` — previous entry’s hash
- `chainHash` — SHA-256 of `(chainPrevHash + canonical JSON payload)`
- `chainAlgo` — `sha256`

### Verification endpoint
- `GET /api/logs/verify` → returns `{ ok: boolean, issues: string[] }`

### How to test (Windows PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/logs/verify" -Method GET
# Expected: { ok: true, issues: [] } for new, untampered entries
```

If you run verification on an old log file (entries written before hash chaining), you’ll see `hash mismatch` lines. That’s expected—archive old logs or start fresh to maintain a clean chain.

### Notes
- POPIA: No PII is introduced; chain fields only strengthen audit integrity.
- For stronger guarantees, consider daily log rotation and anchoring the terminal hash externally.

### Implementation locations
- Chain logic & verification: `server/logger.ts`
- Verify endpoint: `server/index.ts` (`GET /api/logs/verify`)

Status: ✅ Completed (conceptual implementation with verification)

---

### Getting Google Gemini API Key

1. **Get Free API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the generated key

2. **Set Environment Variable:**
   ```bash
   cd server
   # Create .env file if it doesn't exist
   echo "GOOGLE_GEMINI_API_KEY=your_api_key_here" > .env
   ```

3. **Verify Setup:**
   ```bash
   npm run verify:setup
   ```

⚠️ **Security Warning:** Never commit your API key to version control. The `.gitignore` already excludes `.env` files.

### Backend Setup Instructions

#### 1. Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- `express` - Web framework
- `@google/generative-ai` - Gemini SDK
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `tsx` - TypeScript execution

#### 2. Configure Environment Variables

Create `server/.env`:

```env
# Required: Google Gemini API Key
GOOGLE_GEMINI_API_KEY=your_api_key_here

# Optional: Server port (default 4000)
PORT=4000
```

#### 3. Start Backend Server

```bash
# From server directory
npm run dev

# Or from root directory
cd server && npm run dev
```

**Expected Output:**
```
Server running on port 4000
Gemini Service initialized
```

### Starting Both Services

#### Development Mode (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Output: Server running on port 4000
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
# Output: VITE v5.4.19 ready in 123 ms
# ➜  Local:   http://localhost:5173/
```

Then open your browser to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000

#### Production Build

```bash
# Build frontend
npm run build

# Build creates optimized bundle in dist/
# Ready for deployment

# Backend runs with npm run dev in production
# Consider using PM2, systemd, or Docker for production
```

### API Endpoint Documentation

#### Health Check

**Request:**
```bash
GET http://localhost:4000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-04T12:34:56.789Z"
}
```

#### Chat Endpoint (Non-Streaming)

**Request:**
```bash
POST http://localhost:4000/api/chat
Content-Type: application/json

{
  "message": "What are React hooks?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you today?"
    }
  ],
  "metadata": {
    "source": "chatbot",
    "courseId": "react-101",
    "userId": "user123"
  }
}
```

**Response:**
```json
{
  "response": "React hooks are functions that let you use state and other React features in functional components. The most common hook is useState for managing component state...",
  "timestamp": "2026-02-04T12:34:56.789Z",
  "conversationId": "conv-1707038096789"
}
```

#### Streaming Chat Endpoint

**Request:**
```bash
POST http://localhost:4000/api/chat/stream
Content-Type: application/json

{
  "message": "Explain useState",
  "conversationHistory": [],
  "metadata": {
    "source": "text-highlight"
  }
}
```

**Response (Server-Sent Events):**
```
data: {"chunk":"React hooks"}

data: {"chunk":" are functions"}

data: {"chunk":" that let you"}

data: [DONE]
```

**Frontend Usage:**
```typescript
import { sendMessage, streamMessage } from '@/services/apiClient';

// Non-streaming
const response = await sendMessage('What is JSX?');
console.log(response);

// Streaming (real-time chunks)
for await (const chunk of streamMessage('Explain useState')) {
  console.log(chunk); // Process chunk by chunk
}
```

### Response Features

**Knowledge Base Integration:**
- Responses automatically include relevant concepts from the knowledge base
- FAQs are matched and integrated into responses
- Source citations appear naturally in responses

**Example Response:**
```
Hooks are functions that let you "hook into" React state and lifecycle features. 

Key concepts:
• useState: Manage component state
• useEffect: Side effects and lifecycle
• useContext: Share data between components

These are the most fundamental hooks. Once you master them, you can explore advanced hooks like useReducer, useCallback, and useMemo.

Related: You might also want to learn about custom hooks and the Rules of Hooks!
```

### Troubleshooting

#### API Key Issues

**Error:** `GOOGLE_GEMINI_API_KEY is not defined`

**Solution:**
1. Check `server/.env` exists
2. Verify API key is set: `echo $GOOGLE_GEMINI_API_KEY`
3. Restart backend server: `npm run dev`

#### Connection Issues

**Error:** `Cannot connect to http://localhost:4000`

**Solution:**
1. Verify backend is running: `curl http://localhost:4000/api/health`
2. Check port 4000 is not in use: `lsof -i :4000` (macOS/Linux)
3. Try different port: `PORT=5000 npm run dev`

#### Rate Limiting

**Error:** `Error 429: Too many requests`

**Solution:**
- Google Gemini API has rate limits on free tier
- Add exponential backoff retry logic
- Consider upgrading to paid tier for higher limits

#### Slow Responses

**Issue:** AI responses taking 5+ seconds

**Solution:**
1. Check internet connection
2. Try shorter/simpler prompts
3. Use streaming endpoint for better UX
4. Consider caching responses

#### Empty Responses

**Error:** API returns empty response

**Solution:**
1. Check message length (should be > 0)
2. Verify API key is valid
3. Check Gemini API status: [Google AI Status](https://status.cloud.google.com/)
4. Review backend logs: `npm run dev` shows errors

#### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- CORS is enabled in backend (line in `server/index.ts`)
- Verify frontend is calling `http://localhost:4000`
- Check frontend `.env`: `VITE_API_URL=http://localhost:4000`

#### Frontend Can't Find Backend

**Error:** `POST http://localhost:4000/api/chat net::ERR_CONNECTION_REFUSED`

**Solution:**
1. Start backend first: `cd server && npm run dev`
2. Wait 3 seconds for server startup
3. Verify backend is ready: `curl http://localhost:4000/api/health`
4. Check both services are running on correct ports

### Common Questions

**Q: Can I use a different AI API?**  
A: Yes! You can replace GeminiService with OpenAI, Claude, or other APIs. The interface is modular.

**Q: How does the knowledge base work?**  
A: The backend searches the knowledge base for relevant concepts when processing queries and injects them into the prompt for context-aware responses (RAG pattern).

**Q: Can I modify the knowledge base?**  
A: Yes! Edit `server/src/data/knowledgeBase.ts` to add more concepts, FAQs, and learning paths.

**Q: Why isn't my API key working?**  
A: Verify it's a valid Gemini API key from [makersuite.google.com](https://makersuite.google.com/app/apikey), not a Cloud API key.

---

## 🐳 Docker Setup

Running the entire application stack in Docker provides isolation, consistency, and easy deployment across environments.

### Prerequisites

- **Docker** - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose** - Usually included with Docker Desktop

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

### Docker Architecture

```
docker-compose.yml
├── frontend (Vite React App)
│   ├── Port: 8080
│   ├── Dockerfile: Dockerfile (Multi-stage build)
│   └── Environment: VITE_API_URL=http://backend:4000
│
└── backend (Express + Gemini)
    ├── Port: 4000
    ├── Dockerfile: server/Dockerfile
    └── Environment: GOOGLE_GEMINI_API_KEY (from .env)
```

### Files Created

#### 1. `docker-compose.yml` - Service Orchestration

Complete Docker Compose configuration for running both services:

**Features:**
- Multi-container setup (frontend + backend)
- Environment variable management
- Volume mounting for development
- Port mapping (8080 → frontend, 4000 → backend)
- Service dependency management
- Network isolation

#### 2. `server/Dockerfile` - Backend Container

Node.js backend with Gemini SDK:

**Build Stages:**
- **Build:** TypeScript compilation, dependency installation
- **Runtime:** Minimal Node.js image with only production dependencies

**Optimizations:**
- Multi-stage build reduces image size
- Non-root user for security
- Health check included
- Production optimizations

#### 3. `Dockerfile` - Frontend Container (Optional)

Vite React frontend with multi-stage build:

**Build Stages:**
- **Build:** Vite compilation, TypeScript checking
- **Runtime:** Nginx for optimized serving

**Features:**
- Static file serving
- Gzip compression
- Production build optimization
- SPA routing support

### Quick Start with Docker

#### 1. Build and Run

```bash
# Build images and start services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Expected Output:**
```
Creating network "lms-ai-chatbot_default" with driver "bridge"
Building backend
[+] Building 45.2s
...
Creating lms-ai-chatbot-backend-1  ... done
Creating lms-ai-chatbot-frontend-1 ... done
Attaching to lms-ai-chatbot-backend-1, lms-ai-chatbot-frontend-1

backend-1   | Server running on port 4000
frontend-1  | VITE v5.4.19 ready in 456 ms
```

#### 2. Access Services

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:4000
- **API Health Check:** curl http://localhost:4000/api/health

#### 3. Environment Configuration

Create `.env` file in project root:

```env
# Frontend (optional, defaults shown)
VITE_API_URL=http://backend:4000

# Backend (required for API key)
GOOGLE_GEMINI_API_KEY=your_api_key_here
PORT=4000
```

**Note:** The backend service name `backend` is resolved automatically within Docker network.

### Common Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# View running services
docker-compose ps

# View logs
docker-compose logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything (including volumes)
docker-compose down -v

# Rebuild and restart specific service
docker-compose up -d --build backend

# Execute command in container
docker-compose exec backend npm run dev
docker-compose exec frontend sh

# View environment variables in container
docker-compose exec backend env
```

### Debugging Docker Issues

#### Container Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

#### Port Already in Use

```bash
# Change ports in docker-compose.yml
# Or kill process using port:
lsof -i :8080  # Find process on port 8080
kill -9 <PID>  # Kill by process ID
```

#### API Connection Issues

```bash
# Test backend from frontend container
docker-compose exec frontend curl http://backend:4000/api/health

# Check network connectivity
docker-compose exec frontend ping backend

# View backend logs
docker-compose logs backend
```

#### API Key Not Working in Docker

```bash
# Verify env variable is set
docker-compose exec backend env | grep GOOGLE

# Rebuild with new environment variable
docker-compose down
echo "GOOGLE_GEMINI_API_KEY=your_new_key" > .env
docker-compose up -d --build backend
```

### Docker Development Workflow

#### Hot Reload Development

```bash
# Services automatically reload on file changes
docker-compose up

# Watch logs
docker-compose logs -f

# Edit files locally, Docker volumes sync automatically
# Frontend: http://localhost:8080 auto-refreshes
# Backend: tsx watch auto-reloads TypeScript
```

#### Inspect Docker Volumes

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect lms-ai-chatbot_server_node_modules

# View files in volume
docker run -v lms-ai-chatbot_server_node_modules:/data ubuntu ls -la /data
```

### Production Deployment

#### Build for Production

```bash
# Build frontend with production optimizations
npm run build

# Create production docker image
docker build -f Dockerfile -t lms-ai-chatbot:latest --target production .
docker build -f server/Dockerfile -t lms-ai-chatbot-backend:latest server/

# Push to Docker Hub/Registry
docker tag lms-ai-chatbot:latest your-registry/lms-ai-chatbot:latest
docker push your-registry/lms-ai-chatbot:latest
```

#### Environment Variables in Production

Create `.env.production`:
```env
# Use production domain
VITE_API_URL=https://api.yourdomain.com
GOOGLE_GEMINI_API_KEY=your_production_key

# Scale backend if needed
DOCKER_REPLICAS=3
```

#### Monitor Containers

```bash
# View resource usage
docker stats

# View container logs
docker logs lms-ai-chatbot-backend-1 -f

# Get container shell
docker exec -it lms-ai-chatbot-backend-1 sh
```

### Advantages of Docker

✅ **Consistency:** Same environment across dev, test, and production  
✅ **Isolation:** Services don't conflict with system packages  
✅ **Scalability:** Easy to add more instances with Docker Swarm/Kubernetes  
✅ **Deployment:** One command to deploy entire stack  
✅ **Team Collaboration:** Everyone works in identical environment  

---

## 🌿 Branch Structure

### Main Branches
- **`main`** - Production-ready code
- **`dev`** - Development integration branch

### Feature Branches - Implementation Phases

#### ✅ Phase 1: Text Highlight Integration (COMPLETE)
**Branch:** `text-highlight`

**Tasks Completed:**
- [x] Task 1.1: Text Selection Detection Hook
  - `src/hooks/useTextSelection.tsx`
  - Selection detection, position tracking, context capture
  - Mobile touch support, event cleanup
  
- [x] Task 1.2: Explain Popup Component
  - `src/components/features/ExplainPopup.tsx`
  - Floating UI, smart positioning, animations
  - Keyboard shortcuts, responsive design

- [x] Task 1.3: Integration with Content Areas
  - `src/contexts/TextSelectionContext.tsx`
  - Updated `AIChatbot.tsx` with ref API
  - Integrated in `LessonViewer`, `ModuleCard`, `TaskCard`

**Commits:**
1. `13d3ec8` - feat: add useTextSelection hook
2. `e608a01` - feat: add ExplainPopup component
3. `695e58f` - feat: integrate text selection with AI chatbot

**🔗 View:** [text-highlight branch on GitHub](https://github.com/tlhololaiza/LMS-Ai-Chatbot/tree/text-highlight)

#### ✅ Phase 2: Chatbot Context System (COMPLETE)
**Branch:** `feature/chatbot-context-system`

**Tasks Completed:**
- [x] Task 2.1: Extend Type Definitions
  - `src/types/lms.ts`
  - Added ChatContextType, ChatMessageMetadata, enhanced ChatMessage
  - ChatContext, AIPromptTemplate, PromptBuildContext interfaces
  
- [x] Task 2.2: Create Chat Context Manager
  - `src/contexts/ChatContextProvider.tsx`
  - Conversation history with localStorage persistence
  - Message queue (max 100), highlights tracking (max 10)
  - Context switching and profile management

- [x] Task 2.3: Build Prompt Engineering System
  - `src/utils/promptBuilder.ts`
  - 4 specialized prompt templates
  - Context-rich prompt construction
  - Intent detection and concept summarization

**Commits:**
1. `90fed12` - feat(types): extend LMS types with AI context tracking
2. `6678d8c` - feat(contexts): create ChatContextProvider for conversation state management
3. `5b8fdd3` - feat(utils): create prompt engineering system with template-based AI context building

**🔗 View:** [feature/chatbot-context-system branch on GitHub](https://github.com/tlhololaiza/LMS-Ai-Chatbot/tree/feature/chatbot-context-system)

#### ✅ Phase 3: Frontend API Integration (COMPLETE)
**Branch:** `feature/frontend-integration`

**Tasks Completed:**
- [x] Task 3.1: Create API Client Service
  - `src/services/apiClient.ts`
  - `sendMessage()` function with POST to `/api/chat`
  - `streamMessage()` async generator for real-time streaming
  - APIError class for typed error handling
  - HTTP status validation and network error handling
  - Helper functions for conversation history formatting

- [x] Task 3.2: Update AIChatbot Component
  - `src/components/features/AIChatbot.tsx`
  - Replace mock `getBotResponse()` with real API calls
  - Convert message history to API format (role + content)
  - Graceful API error handling with fallback messages
  - Async handlers for `handleSend()`, `explainText()`, `handleRegenerate()`

- [x] Task 3.3: Backend Chat Endpoints
  - `server/index.ts` - Updated with chat endpoints
  - `GET /api/health` - Health check endpoint
  - `POST /api/chat` - Main chat endpoint (non-streaming)
  - `POST /api/chat/stream` - Streaming chat with Server-Sent Events
  - Integration with GeminiService for AI responses

- [x] Task 3.4: Testing & Documentation
  - `src/services/apiClient.test.ts` - Unit tests with Vitest
  - `src/services/testApiClient.ts` - Integration test script
  - `API_CLIENT_TESTING.md` - Comprehensive testing guide
  - `API_CLIENT_SUMMARY.md` - Implementation documentation
  - `TASK_3.2_TESTING_GUIDE.md` - AIChatbot integration tests
  - `TASK_3.2_SUMMARY.md` - AIChatbot integration summary
  - Setup verification script

**Commits:**
1. `feat: implement frontend API client with streaming support`
2. `feat(chatbot): integrate real API client with error handling`

**🔗 View:** [feature/frontend-integration branch on GitHub](https://github.com/tlhololaiza/LMS-Ai-Chatbot/tree/feature/frontend-integration)

#### 📋 Phase 4: Enhanced Chatbot UI (PLANNED)
**Branch:** `feature/enhanced-chatbot-ui`

**Tasks:**
- [ ] Task 4.1: Redesign AIChatbot Component
- [ ] Task 4.2: Add Chat Features
- [ ] Task 4.3: Typing Indicators & Animations

#### ✅ Phase 5: Intelligent Responses (COMPLETE)
**Branch:** `feature/intelligent-responses`

**Tasks Completed:**
- [x] Task 5.1: Build Knowledge Base System
  - `src/data/knowledgeBase.ts`
  - 19 React/JavaScript concepts with explanations and examples
  - 10 expert-vetted FAQs categorized by topic
  - 6 concept learning paths (prerequisites → lessons → tasks)
  - 7 indexed lessons with keyword search
  - 12 retrieval utility functions (search, filter, get related concepts)

- [x] Task 5.2: Implement RAG (Retrieval Augmented Generation)
  - `src/utils/ragService.ts` (574 lines)
    - Content retrieval with relevance ranking (definition: 1.0, concept: 0.9, lesson: 0.85, faq: 0.8)
    - Source deduplication and combination algorithms
    - Difficulty-adaptive filtering based on user progress
    - Automatic citation generation with source metadata
    - Context-aware augmentation for enhanced prompts
  - `src/utils/promptBuilder.ts` (~400 lines)
    - Intent detection (explanation, FAQ, lesson, task, general)
    - 4 specialized system prompt templates
    - Context-aware prompt construction
    - Automatic categorization and term lookup
  - `src/components/features/AIChatbot.tsx` (UPDATED)
    - RAG integration in response generation
    - Source suggestion display in chat
    - Citation rendering with source type icons
    - Regenerate with fresh RAG context
  - `RAG_SYSTEM.md` (Comprehensive documentation)

- [x] Task 5.3: Context-Aware Response Logic (INTEGRATED)
  - Automatic context detection based on current page/lesson
  - Difficulty-based content filtering
  - Related concept suggestions
  - Learning path recommendations
  - Source prioritization based on relevance

**Key Features:**
- **Intelligent Search:** Full-text search across knowledge base with relevance ranking
- **Source Citations:** Automatic citation generation with icon indicators (📖 📚 💡 ❓)
- **Context Awareness:** Detects if user is in lesson, task, or course context
- **Difficulty Adaptation:** Adjusts explanation depth based on user progress (0-30% beginner, 30-70% intermediate, 70-100% advanced)
- **Learning Paths:** Suggests prerequisites and related concepts for structured learning

**Commits:**
1. `a1b2c3d` - feat(task-5.1): build knowledge base system with 19 concepts and 10 FAQs
2. `d4e5f6g` - feat(task-5.2): implement RAG with intelligent content retrieval and citation
3. `h7i8j9k` - fix: resolve unicode escape and CSS import order issues

**🔗 Documentation:** [RAG_SYSTEM.md](RAG_SYSTEM.md) - Complete RAG architecture and usage guide

#### ✅ Phase 6: Conversation Flows (COMPLETE)
**Branch:** `feature/conversation-flows`

**Tasks Completed:**
- [x] Task 6.1: Design Conversation Flow System
  - `src/utils/conversationFlows.ts`
  - Flow states and transitions management
  - Multi-step explanation handling
  - Decision trees for common questions
  
- [x] Task 6.2: Implement Flow Templates
  - `src/utils/flowTemplates.ts`
  - **Concept Explanation Flow:** Acknowledge → Simple Definition → Detailed Explanation → Practical Example → Related Concepts → Check Understanding
  - **Task Help Flow:** Understand Requirements → Break Down Steps → Code Examples → Resources → Debugging Tips → Check Comprehension
  - **Navigation Help Flow:** Identify Goal → Step-by-Step Navigation → Visual Indicators → Alternative Paths → Confirm Found

- [x] Task 6.3: Build Flow Engine
  - `src/utils/flowEngine.ts`
  - State machine implementation
  - Progress tracking through flows
  - Handle user interruptions (pause/resume)
  - Flow restart capability
  - Support for branching paths

**Commits:**
1. `108e6df` - feat(flows): design conversation flow system with state management
2. `79a93e4` - feat(flows): implement predefined flow templates for common scenarios
3. `c9d14e9` - feat(flows): build flow engine with state machine and progress tracking

**🔗 View:** [feature/conversation-flows branch on GitHub](https://github.com/tlhololaiza/LMS-Ai-Chatbot/tree/feature/conversation-flows)

#### ✅ Phase 6: Conversation Flows (COMPLETE)
**Branch:** `feature/conversation-flows`

**Tasks Completed:**
- [x] Task 6.1: Design Conversation Flow System
  - `src/utils/conversationFlows.ts`
  - Flow states and transitions management
  - Multi-step explanation handling
  - Decision trees for common questions
  
- [x] Task 6.2: Implement Flow Templates
  - `src/utils/flowTemplates.ts`
  - **Concept Explanation Flow:** Acknowledge → Simple Definition → Detailed Explanation → Practical Example → Related Concepts → Check Understanding
  - **Task Help Flow:** Understand Requirements → Break Down Steps → Code Examples → Resources → Debugging Tips → Check Comprehension
  - **Navigation Help Flow:** Identify Goal → Step-by-Step Navigation → Visual Indicators → Alternative Paths → Confirm Found

- [x] Task 6.3: Build Flow Engine
  - `src/utils/flowEngine.ts`
  - State machine implementation
  - Progress tracking through flows
  - Handle user interruptions (pause/resume)
  - Flow restart capability
  - Support for branching paths

#### ✅ Phase 7: Personalization & Adaptive Learning (COMPLETE)
**Branch:** `feature/personalization`

**Tasks Completed:**
- [x] Task 7.1: User Learning Profile
  - `src/types/personalization.ts`
  - `src/contexts/PersonalizationContext.tsx`
  - Concept interaction tracking with timestamps
  - Difficulty preferences (1-5 scale) per concept
  - Learning pace detection and recording
  - Frequently confused topics identification
  - Profile persistence to localStorage
  - User progress analytics

- [x] Task 7.2: Adaptive Responses
  - `src/utils/adaptiveResponseService.ts`
  - Complexity level adjustment (beginner, intermediate, advanced)
  - Response length personalization based on user preferences
  - Example selection matching user interests
  - Repetition avoidance with interaction history
  - Progressive disclosure of information
  - Connection to previous explanations
  - Related topic suggestions based on learning gaps

- [x] Task 7.3: Learning Path Recommendations
  - `src/utils/learningPathRecommender.ts`
  - Question analysis for knowledge gap identification
  - Prerequisite concept mapping and suggestions
  - Personalized lesson recommendations
  - Practice exercise generation based on mastery level
  - Concept graph with 20+ JavaScript/React topics
  - Mastery tracking and progression analytics

**UI Components:**
- `src/components/features/UserLearningProfile.tsx`
  - Learning profile display with tabs (Overview, Preferences, Progress)
  - Mastery gauge visualization
  - Strengths and improvement areas
  - User preference customization
  - Progress analytics with interaction history
  - Integrated into Settings page

- `src/components/features/LearningRecommendations.tsx`
  - Gap analysis display
  - Recommended lessons and exercises
  - Prerequisite chains visualization
  - Mastery progress indicators
  - Integrated into Dashboard

**Integration:**
- `src/App.tsx` - PersonalizationProvider wrapper for global state
- `src/pages/Dashboard.tsx` - LearningRecommendations component
- `src/pages/Settings.tsx` - UserLearningProfile in new tab
- `src/hooks/useChatbotPersonalization.tsx` - Integration hook for chatbot

**Key Features:**
- **Concept Tracking:** Records all user interactions with concepts
- **Difficulty Preferences:** 1-5 scale for each concept (very easy to very hard)
- **Learning Pace:** Detects fast, normal, or slow learner patterns
- **Confusion Tracking:** Identifies frequently confused topics
- **Adaptive Complexity:** Adjusts explanations based on previous performance
- **Repetition Avoidance:** Remembers previous explanations to avoid duplication
- **Progressive Disclosure:** Reveals information gradually based on mastery
- **Gap Analysis:** Identifies missing prerequisites and knowledge gaps
- **Exercise Generation:** Creates targeted practice exercises
- **Mastery Tracking:** Scores (0-1) for each concept


#### 🤖 Phase 8: AI Backend Integration - Google Gemini (IN PROGRESS)

**Branch:** `feature/gemini-integration`

**Objective:** Connect the LMS chatbot to Google Gemini AI API to provide real, intelligent responses instead of mock data.

**Tasks Completed:**

- [x] **Task 1.1: Google Gemini SDK Setup**
  - Installed `@google/generative-ai` package
  - Configured environment variables (`.env.example`)
  - Added security with `.gitignore` for sensitive data
  - API key management ready
  - **Commit:** `4113b4b` - `feat(gemini): setup Google Gemini SDK - Task 1.1`

- [x] **Task 1.2: Core AI Service Implementation**
  - `server/src/services/geminiService.ts` - Complete AI service layer
  - **Features Implemented:**
    - `generateResponse()` - Generates AI responses with conversation history
    - `streamResponse()` - Real-time streaming for typing effect
    - Conversation history support (last 3 messages for context)
    - Error handling (rate limits, API failures)
    - Educational prompt engineering
  - `server/test-gemini.ts` - Testing utility
  - **Commit:** `cf2fa2b` - `feat(gemini): create basic GeminiService for chat - Task 1.2`

- [x] **Task 1.3: Knowledge Base Integration (RAG)**
  - `server/src/data/knowledgeBase.ts` - Backend knowledge repository
  - **Knowledge Base Contents:**
    - 10 Core Concepts (Component, JSX, Props, State, Hooks, useEffect, TypeScript, Async/Await, API, REST)
    - 10 FAQs covering React fundamentals, hooks, TypeScript, async operations
  - **RAG Features:**
    - `findRelevantKnowledge()` - Smart concept and FAQ matching
    - Keyword-based search with fuzzy matching
    - Contextual injection into AI prompts
    - Natural integration with Gemini responses
  - Enhanced `generateResponse()` with knowledge base context
  - **Commit:** `bb1b64b` - `feat(gemini): integrate knowledge base with AI responses - Task 1.3`

**Technical Architecture:**

```typescript
// Service Structure
server/
├── .env.example              ← API key template
├── .gitignore               ← Security configuration
├── test-gemini.ts           ← Testing utility
└── src/
    ├── data/
    │   └── knowledgeBase.ts  ← 10 concepts + 10 FAQs
    └── services/
        └── geminiService.ts  ← AI service with RAG
```

**Key Features:**
- ✅ Google Gemini Pro model integration
- ✅ Conversation memory (3-turn context window)
- ✅ RAG-enhanced responses using knowledge base
- ✅ Smart keyword matching for concepts
- ✅ FAQ query detection and matching
- ✅ Educational prompt templates
- ✅ Error handling with user-friendly messages
- ✅ Streaming support for real-time responses
- ✅ TypeScript type safety throughout

**Example Usage:**
```typescript
import geminiService from './src/services/geminiService.js';

// Generate response with knowledge base
const response = await geminiService.generateResponse(
  'What are React hooks?',
  conversationHistory
);
// Returns: AI response enhanced with knowledge base context

// Stream response
for await (const chunk of geminiService.streamResponse('Explain props')) {
  console.log(chunk); // Real-time chunks
}
```

**Testing:**
```bash
cd server
echo "GOOGLE_GEMINI_API_KEY=your_key" > .env
npx tsx test-gemini.ts
```

**Next Steps:**
- Phase 8.2: Create REST API endpoints (`/api/chat`)
- Phase 8.3: Connect frontend to backend
- Phase 8.4: Add rate limiting and caching
- Phase 8.5: Testing and deployment

---

#### 📋 Phase 9-10: Future Phases
- Phase 9: Comprehensive Testing
- Phase 10: Production Deployment

---

## ✅ Implementation Status

### ✨ What's Implemented (text-highlight branch)

#### 1. Text Selection Detection
**File:** `src/hooks/useTextSelection.tsx`

Custom hook that:
- Detects text highlighting across the app
- Captures selection position & surrounding context
- Validates minimum selection length (3 chars)
- Handles mobile touch events
- Cleans up event listeners properly

```typescript
const { selection, clearSelection, isActive } = useTextSelection({
  containerRef,
  minLength: 3,
  contextLength: 100,
});
```

#### 2. Explain Popup UI
**File:** `src/components/features/ExplainPopup.tsx`

Floating popup that:
- Appears near selected text
- Shows "Explain" button with Sparkles icon
- Positions smartly to avoid overflow
- Supports keyboard shortcuts (Enter/Esc)
- Fades in/out smoothly
- Works on mobile with touch

#### 3. AI Chatbot Integration
**Files:** 
- `src/contexts/TextSelectionContext.tsx` (NEW)
- `src/components/features/AIChatbot.tsx` (UPDATED)
- `src/components/layout/DashboardLayout.tsx` (UPDATED)

Features:
- Context provider wraps all content
- Chatbot exposes `explainText()` via ref
- Auto-opens chat when "Explain" clicked
- Generates formatted explanations:
  - 🎯 Quick Overview
  - 📖 Detailed Explanation
  - 💡 Practical Example
  - 🔗 Related Topics

#### 4. Content Integration
**Files:**
- `src/components/features/LessonViewer.tsx`
- `src/components/features/ModuleCard.tsx`
- `src/components/features/TaskCard.tsx`

All lesson content, module descriptions, and task descriptions are now selectable with text highlight explanation support.

### ✨ What's Implemented (feature/intelligent-responses branch - Task 5.2: RAG)

#### 1. Knowledge Base System
**File:** `src/data/knowledgeBase.ts` (856 lines)

Comprehensive knowledge repository with:
- **19 React/JavaScript Concepts** (Component, JSX, Props, State, Hooks, useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useLayoutEffect, useImperativeHandle, Custom Hooks, Lifting State Up, Key Prop, React.memo, Controlled Components)
- **10 Expert-Vetted FAQs** organized by category (fundamentals, hooks, performance, best practices)
- **6 Learning Paths** (Complete React Basics, Modern Hooks Deep Dive, Performance Optimization, State Management Mastery, Advanced Patterns, Testing & Best Practices)
- **7 Indexed Lessons** with keyword search
- **Utility Functions:**
  - `searchKnowledgeBase(query)` - Full-text search with relevance ranking
  - `getConceptByTerm(term)` - Direct concept lookup
  - `getRelatedConcepts(conceptId)` - Find connected topics
  - `getFAQsByCategory(category)` - Categorized FAQ retrieval
  - `getLearningPath(conceptId)` - Get prerequisites and learning sequence
  - `getContextualSuggestions(courseId, moduleId, lessonId)` - AI-driven recommendations

```typescript
// Example: Search and retrieve related content
const results = searchKnowledgeBase('useState');
const concept = getConceptByTerm('useState');
const path = getLearningPath(concept.id);
```

#### 2. RAG (Retrieval Augmented Generation) Engine
**File:** `src/utils/ragService.ts` (574 lines)

Intelligent content retrieval with ranking and augmentation:

**Core Retrieval Functions:**
- `retrieveRelevantContent(query, metadata, maxSources)` - Multi-source search with difficulty filtering
- `retrieveContextualContent(courseId, moduleId, lessonId)` - Lesson-specific content retrieval
- `retrieveFAQContent(category)` - FAQ-based retrieval with helpfulness ranking
- `retrieveTermExplanation(term)` - Definition + examples + related concepts

**Advanced Processing:**
- `deduplicateSources()` - Remove duplicate content keeping highest relevance
- `combineSources()` - Format sources into structured markdown (Definitions → Concepts → FAQs → Lessons)
- `calculateCombinedRelevance()` - Weighted scoring across source types
- `createEnhancedPrompt(query, metadata)` - Main RAG function combining all sources
- `enhanceResponseWithCitations(response, sources)` - Append formatted citations with icons

**Source Ranking System:**
```
Definition: 1.0 (highest)
Concept: 0.9
Lesson: 0.85
FAQ: 0.8 (lowest)
```

**Difficulty Adaptation:**
- 0-30% progress → Beginner + Intermediate content
- 30-70% progress → Intermediate + Advanced content
- 70-100% progress → Advanced + Expert content

#### 3. Context-Aware Prompt Builder
**File:** `src/utils/promptBuilder.ts` (~400 lines)

Intelligent prompt construction with intent detection:

**Intent Detection:**
- `detectExplanationRequest()` - Identify concept explanation requests
- `detectFAQRequest()` - Recognize FAQ-style questions
- `extractCategoryFromQuery()` - Auto-categorize user queries

**Specialized Prompt Builders:**
- `buildSystemPrompt(metadata)` - Role and context setup
- `buildExplanationPrompt(highlightedText, context, metadata)` - Text-based explanations
- `buildLessonPrompt(lessonId, courseId, query)` - Lesson-specific questions
- `buildFAQPrompt(category, query)` - FAQ-targeted responses
- `buildTaskPrompt(taskId, courseId, query)` - Assignment help (guidance without solutions)
- `buildContextAwarePrompt(query, metadata)` - Auto-routes to appropriate builder

**System Prompts:**
- **Learning:** General educational queries
- **Explanation:** Deep dives into concepts
- **Technical:** Advanced implementation details
- **Help:** Platform navigation and support

#### 4. AIChatbot Integration
**File:** `src/components/features/AIChatbot.tsx` (Updated)

RAG features integrated into chatbot:
- Uses `buildContextAwarePrompt()` for intelligent routing
- Injects retrieved sources into responses
- Automatic citation generation with source type icons:
  - 📖 Definition
  - 💡 Concept
  - ❓ FAQ
  - 📚 Lesson
- Source suggestions displayed below responses
- Regenerate button uses fresh RAG context
- Text highlight explanations use `buildExplanationPrompt()`

**Example Response with Citations:**
```
[Bot Response Content]

---
**Sources:**
📖 Definition: React Component
💡 Concept: Functional Components
📚 Lesson: Building Your First Component
```

#### 5. Documentation
**File:** `RAG_SYSTEM.md`

Complete documentation including:
- Architecture overview with diagrams
- Retrieval pipeline walkthrough
- Source ranking algorithm explanation
- Citation format specifications
- Performance metrics and optimization
- Usage examples for all core functions

### 🎉 Try RAG Features!

1. **Text Highlighting:** Highlight any text and click "Explain" for concept clarification
2. **Knowledge Search:** Ask "What is useState?" or "How do hooks work?"
3. **Contextual Help:** Navigate to a lesson and ask related questions
4. **FAQ Retrieval:** Ask "Why is my component re-rendering?"
5. **Source Citations:** Look for source icons in responses

---

### 🎉 Try It Now! (Text Highlight)

1. Checkout `text-highlight` branch
2. Run `npm run dev`
3. Navigate to any course → Open a lesson
4. Highlight any text (e.g., "React", "component")
5. Click "Explain" button
6. Watch AI explain the concept with RAG-enhanced sources!

---

### ✨ What's Implemented (feature/conversation-flows branch)

#### 1. Conversation Flow System
**File:** `src/utils/conversationFlows.ts`

Core flow management system with:
- **Flow States:** `idle` | `started` | `in_progress` | `awaiting_response` | `completed` | `interrupted` | `failed`
- **Flow Types:** `concept_explanation` | `task_help` | `navigation_help` | `progress_check` | `troubleshooting` | `resource_suggestion`
- **Flow Architecture:**
  - FlowStep interface with actions, validation, lifecycle hooks
  - FlowAction for user interactions (next, skip, detail, example, restart, exit)
  - FlowContext for state tracking and user data
  - FlowTransitionManager for step-to-step navigation

**Multi-Step Explanations:**
```typescript
class MultiStepExplanation {
  addStep(level: 'simple' | 'intermediate' | 'detailed' | 'technical', content);
  getNextStep(currentLevel): Step;
}
```

**Decision Tree Routing:**
```typescript
buildCommonQuestionsTree(): DecisionTree
navigateDecisionTree(tree, userInput): { flowId, nextNodeId }
```

#### 2. Predefined Flow Templates
**File:** `src/utils/flowTemplates.ts`

**🎓 Concept Explanation Flow:**
1. **Acknowledge** - Greet and confirm the concept
2. **Simple Definition** - Provide basic explanation
3. **Detailed Explanation** - Break down in depth with key points
4. **Practical Example** - Show real code examples
5. **Related Concepts** - Suggest connected topics
6. **Check Understanding** - Verify comprehension
7. **Completion** - Encourage further learning

**💻 Task Help Flow:**
1. **Understand Requirements** - Clarify what's being asked
2. **Clarify Requirements** - Explain in simpler terms if needed
3. **Break Down Steps** - Provide step-by-step approach
4. **Explain Step** - Detail specific steps
5. **Code Examples** - Show working implementations
6. **Suggest Resources** - Share helpful materials
7. **Debugging Tips** - Common issues and solutions
8. **Check Comprehension** - Verify readiness
9. **Completion** - Motivational send-off

**🧭 Navigation Help Flow:**
1. **Identify Goal** - Understand what user is looking for
2. **Navigate (Courses/Tasks/Progress)** - Step-by-step directions
3. **Custom Navigation** - Handle unique requests
4. **Alternative Path** - Show other ways to reach destination
5. **Confirm Found** - Verify user found target
6. **Completion** - Offer continued assistance

**Usage:**
```typescript
const flow = createConceptExplanationFlow('React Hooks');
const taskFlow = createTaskHelpFlow();
const navFlow = createNavigationHelpFlow();
```

#### 3. Flow Engine (State Machine)
**File:** `src/utils/flowEngine.ts`

**FlowEngine Class Features:**

🚀 **Flow Lifecycle:**
```typescript
startFlow(flow, trigger, userData): FlowContext
executeAction(flowInstanceId, action, userInput): Result
completeFlow(flowInstanceId): Result
cancelFlow(flowInstanceId): Result
```

⏸️ **Interruption Handling:**
```typescript
handleInterruption(flowInstanceId, userMessage): {
  shouldContinueFlow,
  shouldPauseFlow,
  shouldCancelFlow,
  interpretation
}
resumeFlow(flowInstanceId): Result
```

🔄 **Flow Control:**
```typescript
restartFlow(flowInstanceId, fromStepId?): Result
getFlowProgress(flowInstanceId): number  // 0-100%
```

📊 **State Management:**
- Active flows tracking with Map
- Flow history with complete audit trail
- Progress calculation (steps completed / total steps)
- Context persistence across steps

🌳 **Branching Support:**
```typescript
class BranchEvaluator {
  static evaluateBranch(condition, context): boolean
  static findMatchingBranch(branches, context): stepId
}
```

**Key Features:**
- ✅ State machine with 7 states
- ✅ Progress tracking (percentage completion)
- ✅ Handle user interruptions (pause/resume/cancel)
- ✅ Flow restart from any step
- ✅ Conditional step execution
- ✅ Lifecycle hooks (onEnter, onExit)
- ✅ Input validation
- ✅ Branching path support
- ✅ Complete history tracking

**Example Usage:**
```typescript
import { flowEngine } from './flowEngine';
import { createConceptExplanationFlow } from './flowTemplates';

// Start a flow
const flow = createConceptExplanationFlow('useState');
const context = flowEngine.startFlow(flow, {
  text: 'Explain useState',
  contextType: 'explanation',
  metadata: { highlightedText: 'useState' }
}, { highlightedText: 'useState' });

// Execute action
const result = flowEngine.executeAction(
  context.flowInstanceId,
  { id: 'continue', label: 'Continue', type: 'next', nextStep: 'simple_definition' }
);

// Check progress
const progress = flowEngine.getFlowProgress(context.flowInstanceId); // 25%

// Handle interruption
const interrupt = flowEngine.handleInterruption(context.flowInstanceId, 'wait');
// { shouldPauseFlow: true }

// Resume
flowEngine.resumeFlow(context.flowInstanceId);
```

---

## 📁 Project Structure

```
LMS-Ai-Chatbot/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── AIChatbot.tsx        # AI chatbot with ref API ✨
│   │   │   ├── ExplainPopup.tsx     # Text selection popup ✨ NEW
│   │   │   ├── LessonViewer.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                      # 40+ shadcn/ui components
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── TextSelectionContext.tsx # Selection state ✨ NEW
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useTextSelection.tsx     # Selection hook ✨ NEW
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Courses.tsx
│   │   ├── Tasks.tsx
│   │   └── ...
│   ├── data/
│   │   └── mockData.ts              # Course content
│   ├── types/
│   │   └── lms.ts                   # TypeScript types
│   └── lib/
│       └── utils.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (recommended)
npm install -g vercel
vercel

# Deploy to Netlify
npm run build
netlify deploy --dir=dist
```

---

## 🤝 Contributing

We welcome contributions!

### How to Contribute

```bash
# 1. Fork the repo
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/LMS-Ai-Chatbot.git

# 3. Create feature branch from dev
git checkout dev
git checkout -b feature/your-feature

# 4. Make changes and commit
git commit -m "feat: add amazing feature"

# 5. Push and create PR
git push origin feature/your-feature
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Tooling

---

## 🔮 Roadmap

### Q1 2026
- [x] Text highlight explanation
- [ ] Real AI API integration
- [ ] Enhanced markdown rendering

### Q2 2026
- [ ] RAG implementation
- [ ] Knowledge base system
- [ ] User profiles

### Q3-Q4 2026
- [ ] Multi-modal AI
- [ ] Collaborative features
- [ ] Mobile app

---

## 📄 License

© 2026 CodeTribe Academy. All rights reserved.

---

## 👥 Credits

**Developer:** Tlholohelo Liza ([@tlhololaiza](https://github.com/tlhololaiza))  
**Organization:** CodeTribe Academy  
**Repository:** [github.com/tlhololaiza/LMS-Ai-Chatbot](https://github.com/tlhololaiza/LMS-Ai-Chatbot)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/tlhololaiza/LMS-Ai-Chatbot/issues)
- **Discussions:** [GitHub Discussions](https://github.com/tlhololaiza/LMS-Ai-Chatbot/discussions)

---

<div align="center">

**Built with ❤️ for CodeTribe Academy**

⭐ **Star this repo if you find it helpful!** ⭐

[⬆ Back to Top](#-codetribe-lms---ai-powered-learning-management-system)

</div>
