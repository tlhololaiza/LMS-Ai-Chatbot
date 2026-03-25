**LMS AI Chatbot**

A lightweight Learning Management System (LMS) frontend paired with an AI-powered chatbot backend for personalized learner assistance, recommendations, and escalation handling.

**Features**
- **AI Chat**: Context-aware chatbot integrated into the LMS UI.
- **Personalization**: Learner profile-based recommendations and adaptive responses.
- **Escalation**: Automated escalation drafts and mailer for human intervention.
- **RAG Support**: Retrieval-augmented generation utilities for grounding responses.

**Repository Structure**
- **Frontend**: [src](src) — React + Vite application (core UI and components).
- **Backend**: [server](server) — Node/TypeScript backend (chat, logging, escalation).
- **Scripts & Config**: [package.json](package.json), Vite and TypeScript configs.

**Quick Start**
- **Install dependencies**:
  - `npm install`
- **Run both apps (dev)**:
  - Frontend: `npm run dev` (from repo root)
  - Backend: `cd server && npm run dev`

**Environment**
- Copy and populate environment variables for the backend: [server/.env](server/.env)
- Typical variables you may need:
  - `PORT` — server port
  - `OPENAI_API_KEY` or provider key — AI provider credential
  - `MAILER_*` — SMTP config (if using escalation mailer)

**Important Files**
- **Server entry**: [server/index.ts](server/index.ts)
- **Main frontend**: [src/App.tsx](src/App.tsx)
- **Backend utils**: [server/logger.ts](server/logger.ts), [server/services/geminiService.ts](server/services/geminiService.ts)

**Testing**
- Run unit tests with: `npm test`
- Backend tests (if separated): `cd server && npm test`

**Deployment**
- Build frontend: `npm run build`
- Start backend in production mode (example): `NODE_ENV=production node dist/index.js` (adjust to your process manager)
- The repository includes notes for deploying the backend to Render: "Step-by-Step Guide Deploy Your LMS AI Chatbot Backend to Render.md"

**Contributing**
- Open issues for bugs or feature requests.
- Create PRs against `main` and follow existing code style.

**License**
- MIT (or update as appropriate)

**Contact / Help**
- For backend logs and debugging, check [server/query_logs.jsonl](server/query_logs.jsonl) and [server/logger.ts](server/logger.ts).

If you want, I can:
- add a sample `.env.example`,
- list exact `npm` scripts found in `package.json`, or
- scaffold a `README` badge section and usage screenshots.
