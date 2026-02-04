# 📋 Quick Team Reference - Gemini Integration

## 🎯 **Project Goal**
Connect our LMS chatbot to **Google Gemini AI** (free tier) to get real AI responses instead of mock data.

---

## 👥 **Team Assignments**

```
MEMBER 1: AI Integration     (5h) → feature/gemini-integration
MEMBER 2: Backend API         (5h) → feature/api-endpoints  
MEMBER 3: Frontend Connect    (5h) → feature/frontend-integration
MEMBER 4: Testing             (4h) → feature/testing
MEMBER 5: Docs & Deploy       (4h) → feature/docs-and-deploy

TOTAL: 23 hours → 5-6 days (part-time)
```

---

## 📅 **Timeline**

### **Day 1: Setup** (Mon)
- Member 1: Install Gemini SDK, get API key working
- Member 2: Create `/api/chat` endpoint structure
- Member 3: Build API client service
- Member 4: Setup test frameworks
- Member 5: Start documentation

### **Day 2: Core Work** (Tue)
- Member 1: Build Gemini service (call AI API)
- Member 2: Add streaming endpoint
- Member 3: Connect AIChatbot to real backend
- Member 4: Write backend tests
- Member 5: Create deployment setup

### **Day 3: Enhancement** (Wed)
- Member 1: Add knowledge base to AI prompts
- Member 2: Add rate limiting (prevent spam)
- Member 3: Add loading states/error handling
- Member 4: Write frontend tests
- Member 5: Final documentation

### **Day 4: Testing** (Thu)
- All: Test everything together
- All: Fix bugs
- All: Code review

### **Day 5: Demo Prep** (Fri)
- All: Final testing
- All: Prepare demo
- All: Update docs
- All: Practice presentation

---

## 🔧 **Setup Instructions**

### **1. Get Google Gemini API Key (FREE)**
```
Visit: https://makersuite.google.com/app/apikey
Click: Create API Key
Copy: Your key
```

### **2. Backend Setup**
```bash
cd server
npm install @google/generative-ai dotenv express-rate-limit

# Create .env file
echo "GOOGLE_GEMINI_API_KEY=your_key_here" > .env
echo "PORT=4000" >> .env
```

### **3. Frontend Setup**
```bash
# In root directory
echo "VITE_API_URL=http://localhost:4000" > .env
```

### **4. Run Project**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend  
npm run dev
```

---

## 💻 **Git Workflow**

```bash
# 1. Create your branch
git checkout dev
git pull origin dev
git checkout -b <your-branch-name>

# Examples:
# git checkout -b feature/gemini-integration
# git checkout -b feature/api-endpoints
# git checkout -b feature/frontend-integration
# git checkout -b feature/testing
# git checkout -b feature/docs-and-deploy

# 2. Work on your tasks
# ... make changes ...

# 3. Commit each task
git add .
git commit -m "feat(component): description - Task X.Y"

# Examples:
# git commit -m "feat(gemini): setup SDK - Task 1.1"
# git commit -m "feat(api): create chat endpoint - Task 2.1"
# git commit -m "feat(frontend): connect to backend - Task 3.2"

# 4. Push to GitHub
git push -u origin <your-branch-name>

# 5. Create Pull Request
# Go to GitHub → Compare & Pull Request
# Target: dev branch
# Add: 1 team member as reviewer
```

---

## 📝 **Commit Message Format**

```
<type>(<scope>): <description> - Task X.Y

Types:
  feat    - New feature
  fix     - Bug fix
  test    - Adding tests
  docs    - Documentation only
  chore   - Maintenance (config, setup)

Examples:
✅ feat(gemini): setup Google Gemini SDK - Task 1.1
✅ feat(api): create /api/chat endpoint - Task 2.1
✅ feat(frontend): connect AIChatbot to backend - Task 3.2
✅ test(api): add endpoint validation tests - Task 4.1
✅ docs(readme): add Gemini setup instructions - Task 5.1
```

---

## 🗂️ **Files Each Member Will Create/Edit**

### **Member 1 (AI Integration)**
```
CREATE:
  server/src/services/geminiService.ts
  server/.env
  server/test-gemini.ts

EDIT:
  server/.gitignore
```

### **Member 2 (Backend API)**
```
EDIT:
  server/index.ts (add chat endpoints)

INSTALL:
  express-rate-limit
```

### **Member 3 (Frontend)**
```
CREATE:
  src/services/apiClient.ts
  .env

EDIT:
  src/components/features/AIChatbot.tsx (replace mock responses)
```

### **Member 4 (Testing)**
```
CREATE:
  server/jest.config.js
  server/src/__tests__/api.test.ts
  src/components/features/__tests__/AIChatbot.test.tsx

INSTALL:
  jest, ts-jest, supertest
```

### **Member 5 (Docs & Deploy)**
```
EDIT:
  README.md (add AI setup section)

CREATE:
  DEMO_INSTRUCTIONS.md (optional)
```

---

## 🧪 **Testing Commands**

```bash
# Backend tests
cd server
npm test

# Frontend tests
npm test

# Run everything
npm run test:all
```

---

## ✅ **Daily Checklist**

```
END OF DAY:
  □ Committed all changes
  □ Pushed to your branch
  □ Tested your work locally
  □ Updated team on Slack/WhatsApp
  □ Noted any blockers

BEFORE PULL REQUEST:
  □ Pulled latest from dev
  □ Resolved any conflicts
  □ All tests passing
  □ Code reviewed by yourself
  □ Commit messages follow format
```

---

## 🎯 **Success = Demo Works**

### **What should work by Day 5:**
1. ✅ Open chatbot in browser
2. ✅ Type "What is React?"
3. ✅ Get REAL AI response (not mock)
4. ✅ Loading spinner shows while waiting
5. ✅ Error message if something fails
6. ✅ Conversation history maintained
7. ✅ Can ask follow-up questions

---

## 🆘 **Troubleshooting**

### **"API key not working"**
```bash
# Check if loaded
node -e "require('dotenv').config(); console.log(process.env.GOOGLE_GEMINI_API_KEY)"

# Should print your key, not 'undefined'
```

### **"Backend won't start"**
```bash
# Check if port 4000 is free
netstat -ano | findstr :4000

# Kill process if needed
taskkill /PID <process_id> /F
```

### **"Frontend can't connect to backend"**
```bash
# Check .env has correct URL
cat .env

# Should have:
# VITE_API_URL=http://localhost:4000
```

### **"CORS error"**
```typescript
// In server/index.ts, ensure:
app.use(cors());
```

---

## 📞 **Communication**

### **Daily Standup (10 min)**
```
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers?
```

### **When to Ask for Help:**
- ⏰ Stuck for > 30 minutes
- ❓ Don't understand the task
- 🐛 Can't fix a bug
- 🤝 Need code review

---

## 📊 **Progress Tracking**

### **Use this emoji system:**
```
⏳ Not started
🔄 In progress
✅ Done
🐛 Has issues
🔍 Needs review
```

**Example in team chat:**
```
Member 1:
  ✅ Task 1.1 - Gemini SDK setup
  🔄 Task 1.2 - Building service
  ⏳ Task 1.3 - RAG integration
```

---

## 🎓 **Learning Resources**

- **Gemini API Docs:** https://ai.google.dev/docs
- **Express.js:** https://expressjs.com/
- **React TypeScript:** https://react-typescript-cheatsheet.netlify.app/
- **Git Basics:** https://git-scm.com/doc

---

## 🏆 **Grading Criteria (Expected)**

✅ **Working Demo:** 40%
✅ **Code Quality:** 20%
✅ **Git Workflow:** 15%
✅ **Documentation:** 15%
✅ **Presentation:** 10%

**Tips:**
- Make it work first (Day 1-3)
- Make it nice after (Day 4-5)
- Document everything
- Practice your demo

---

## 🚀 **Quick Start Recap**

```bash
# 1. Get API key: https://makersuite.google.com/app/apikey

# 2. Clone repo
git clone https://github.com/tlhololaiza/LMS-Ai-Chatbot.git
cd LMS-Ai-Chatbot

# 3. Create your branch
git checkout dev
git checkout -b feature/your-name-here

# 4. Setup backend
cd server
npm install @google/generative-ai dotenv express-rate-limit
echo "GOOGLE_GEMINI_API_KEY=your_key" > .env
echo "PORT=4000" >> .env

# 5. Setup frontend
cd ..
echo "VITE_API_URL=http://localhost:4000" > .env
npm install

# 6. Start coding!
# Check GEMINI_INTEGRATION_PLAN.md for your tasks
```

---

**Last Updated:** February 2, 2026
**Team Size:** 5 people
**Duration:** 5-6 days
**Difficulty:** Medium (Academic Level)
