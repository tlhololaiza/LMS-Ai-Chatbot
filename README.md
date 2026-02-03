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
- Context-aware responses
- Platform navigation help
- Technical concept explanations
- Deadline and task assistance

#### ✨ Text Highlight Explanation *(NEW)*
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

# 3. Start dev server
npm run dev

# 4. Open browser
# http://localhost:5173
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

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

#### 📋 Phase 3: AI Backend Integration (PLANNED)
**Branch:** `feature/ai-backend-integration`

**Tasks:**
- [ ] Task 3.1: Setup AI Service Configuration
- [ ] Task 3.2: Create AI API Client
- [ ] Task 3.3: Response Processing & Formatting

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


#### 📋 Phase 8-10: Future Phases
- Phase 8: Analytics & Feedback
- Phase 9: Advanced Features
- Phase 10: Testing & Documentation

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

## 🧪 Backend Logging – Task 1 & Task 2 (Implemented)

This project now includes a lightweight backend to log chatbot interactions for analytics and troubleshooting.

### Task 1: Log query text and category

- Endpoint: `POST http://localhost:4000/api/log-query`
- Purpose: Records the raw user query and the category (e.g., `general`, `explanation`).
- Payload example:

```json
{
  "query": "What is a React component?",
  "category": "general"
}
```

- Persistence: Appends JSON Lines to `server/query_logs.jsonl`.

### Task 2: Log response outcome

- Endpoint: `POST http://localhost:4000/api/log-response`
- Purpose: Records whether a chatbot reply succeeded or failed, plus optional metadata.
- Fields:
  - `category`: string (required) – e.g., `general` or `explanation`
  - `outcome`: `"success" | "failure"` (required)
  - `queryId`: string (optional)
  - `responseTimeMs`: number (optional)
  - `model`: string (optional)
  - `error`: string (optional)

- Payload example (success):

```json
{
  "queryId": "123",
  "category": "faq",
  "outcome": "success",
  "responseTimeMs": 250,
  "model": "gpt-4o-mini"
}
```

- Payload example (failure):

```json
{
  "category": "general",
  "outcome": "failure",
  "error": "timeout contacting model provider"
}
```

- Persistence: Appends JSON Lines to `server/response_logs.jsonl`.

### How to run the backend (Windows PowerShell)

```powershell
# From the server folder
cd S:\CodeTribe\FINAL_PROJECTS\Project\LMS-Ai-Chatbot\server

# Start the server
npm run dev
```

Expected output:

```
Logger server running on port 4000
```

### Test with Postman

1. Start the server (see above).
2. In Postman, set `Content-Type: application/json`.
3. Send requests:
   - `POST http://localhost:4000/api/log-query` with body `{ "query": "...", "category": "general" }`
   - `POST http://localhost:4000/api/log-response` with a valid payload (see examples above)
4. Verify logs:
   - Queries: `server/query_logs.jsonl`
   - Responses: `server/response_logs.jsonl`

### Quick test via PowerShell (without Postman)

```powershell
# Query log
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/log-query -ContentType 'application/json' -Body '{ "query":"What is React?", "category":"general" }'

# Response outcome (success)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/log-response -ContentType 'application/json' -Body '{ "queryId":"123", "category":"faq", "outcome":"success", "responseTimeMs": 250, "model":"gpt-4o-mini" }'

# Response outcome (failure)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/log-response -ContentType 'application/json' -Body '{ "category":"general", "outcome":"failure", "error":"timeout contacting model provider" }'
```

### Frontend wiring

- The chatbot UI in `src/components/features/AIChatbot.tsx` sends logs to the backend:
  - Calls `/api/log-query` when the user asks a question.
  - Calls `/api/log-response` after the bot replies (measures `responseTimeMs`).

### Automated tests (server)

- Test runner: **Vitest**
- HTTP testing: **Supertest**
- Run from the server folder:

```powershell
cd S:\CodeTribe\FINAL_PROJECTS\Project\LMS-Ai-Chatbot\server
npm test
```

- What’s covered:
  - Valid `POST /api/log-response` returns `200 { success: true }`
  - Invalid `outcome` returns `400 { error: ... }`
  - Missing `category` returns `400 { error: ... }`

### Status

- Task 1: Log query text and category – **Completed**
- Task 2: Log response outcome – **Completed**

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
