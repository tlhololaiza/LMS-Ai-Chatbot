/**
 * ═══════════════════════════════════════════════════════════════════
 *  UNIFIED AI CONTEXT — Single Source of Truth
 * ═══════════════════════════════════════════════════════════════════
 *
 * This file consolidates ALL knowledge the AI assistant needs into ONE
 * document that is injected wholesale into every prompt. This eliminates
 * scattered data across multiple files and ensures the AI can reason
 * over the complete picture — mLab organisation, CodeTribe Academy,
 * the LMS platform, all 5 courses, all tasks, all team members,
 * announcements, and programming concepts.
 *
 * DATA SOURCES:
 *   • https://mlab.co.za/ (all pages, fetched Feb 2026)
 *   • https://codetribelanding.netlify.app/
 *   • LMS platform data (src/data/mockData.ts)
 *   • Programming curriculum content
 *
 * IMPORTANT: "mLab" refers ONLY to mLab Southern Africa (mlab.co.za),
 * a South African not-for-profit. It is NOT the MongoDB mLab (mLab Inc.)
 * that was acquired by MongoDB in 2018. Never confuse the two.
 *
 * Last updated: February 2026
 */

// ─────────────────────────────────────────────────────────────────
// Structured data exports (for programmatic lookups)
// ─────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  role: string;
}

export const MLAB_TEAM: TeamMember[] = [
  { name: 'Nicki Koorbanally', role: 'CEO' },
  { name: 'Tendai Mazhude', role: 'COO' },
  { name: 'Melvin Musehani', role: 'Technical Lead' },
  { name: 'Palesa Antony', role: 'Technology Ecosystem Lead' },
  { name: 'Sina Legong', role: 'Head of Regional Innovation and Partnerships' },
  { name: 'Antoinette Crafford', role: 'HR Consultant' },
  { name: 'Ivan Johnson', role: 'Junior Coordinator' },
  { name: 'Kabelo Gaotlhaelwe', role: 'Skills Facilitator' },
  { name: 'Keketso Matsuma', role: 'UI/UX Designer' },
  { name: 'Nokwanda Maranjane', role: 'Skills Facilitator' },
  { name: 'Sizwe Masemola', role: 'Full Stack Developer' },
  { name: 'Veronica Mahlangu', role: 'Skills Accelerator Coordinator' },
  { name: 'Zack Tinga', role: 'Skills Facilitator / Quality Assurance' },
  { name: 'Zukanye Madakana', role: 'Marketing and Communications Admin' },
];

// ─────────────────────────────────────────────────────────────────
// THE UNIFIED CONTEXT DOCUMENT
// ─────────────────────────────────────────────────────────────────
// This single string is injected into every AI prompt so the model
// always has full context to reason from.
// ─────────────────────────────────────────────────────────────────

export const AI_CONTEXT = `
╔══════════════════════════════════════════════════════════════════╗
║  CODETRIBE LMS AI ASSISTANT — COMPLETE KNOWLEDGE BASE          ║
║  Use ONLY this information to answer questions.                 ║
║  Do NOT make up or fabricate information.                       ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: ABOUT MLAB SOUTHERN AFRICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: "mLab" refers ONLY to mLab Southern Africa (mlab.co.za),
a South African not-for-profit. It is NOT the MongoDB mLab (mLab Inc.)
acquired by MongoDB in 2018. Never confuse the two.

Mobile Applications Laboratory NPC (mLab) is a tech-centred not-for-profit
company (NPC) with public benefit organisation (PBO) status that prepares
innovators and entrepreneurs to maximise opportunities in the digital economy.

mLab works alongside various partners to build a vibrant, robust innovation
ecosystem. It has a strong focus on empowering youth, women and previously
disadvantaged communities through digital skills training, enterprise support
and technology development services.

Founded: 2011
Founding consortium: World Bank (InfoDev), Department of Science and Innovation
(DSI), CSIR, The Innovation Hub (TIH).
B-BBEE Level: 1
Offices: Limpopo, Gauteng, Northern Cape

Website: https://mlab.co.za
Phone: +27 012 844 0240
Address: U8, Enterprise Building, The Innovation Hub, Mark Shuttleworth Street,
         Tshwane, Pretoria, South Africa, 0087

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: MLAB TEAM (source: https://mlab.co.za/who-we-are)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total staff: 14 people.

LEADERSHIP:
  • Nicki Koorbanally — CEO
  • Tendai Mazhude — COO
  • Melvin Musehani — Technical Lead
  • Palesa Antony — Technology Ecosystem Lead
  • Sina Legong — Head of Regional Innovation and Partnerships

TEAM MEMBERS:
  • Antoinette Crafford — HR Consultant
  • Ivan Johnson — Junior Coordinator
  • Kabelo Gaotlhaelwe — Skills Facilitator
  • Keketso Matsuma — UI/UX Designer
  • Nokwanda Maranjane — Skills Facilitator
  • Sizwe Masemola — Full Stack Developer
  • Veronica Mahlangu — Skills Accelerator Coordinator
  • Zack Tinga — Skills Facilitator / Quality Assurance
  • Zukanye Madakana — Marketing and Communications Admin

WHO TO CONSULT FOR HELP:
  • Software development → Melvin Musehani (Technical Lead) / Sizwe Masemola
    (Full Stack Developer) / your Skills Facilitator
  • React / React Native / Node.js / coding help → Your Skills Facilitator
    (Kabelo Gaotlhaelwe, Nokwanda Maranjane, or Zack Tinga)
  • UI/UX design → Keketso Matsuma (UI/UX Designer)
  • Programme coordination → Ivan Johnson (Junior Coordinator) or
    Veronica Mahlangu (Skills Accelerator Coordinator)
  • HR matters → Antoinette Crafford (HR Consultant)
  • Ecosystem events & partnerships → Palesa Antony or Sina Legong
  • Marketing / communications → Zukanye Madakana
  • General programme questions → Your facilitator or mLab via
    https://mlab.co.za/contact or +27 012 844 0240

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: CODETRIBE ACADEMY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CodeTribe Academy was launched on 1 September 2014 as a partnership between
The Innovation Hub and mLab Southern Africa to increase the skills of young
ICT enthusiasts through practical development of high-impact and market-
relevant solutions.

Duration: 6–12 month coding programme
Technologies taught: ReactJS, Angular, Ionic, Node.js, React Native, MongoDB,
  TypeScript, HTML5, CSS3, GitHub
Training locations: Soweto, Tembisa, and Tshwane (Gauteng)
Accreditation: IITPSA (Institute of Information Technology Professionals SA)
Login portal: https://codetribe.mlab.co.za
Landing page: https://codetribelanding.netlify.app

SELECTION CRITERIA (source: https://mlab.co.za/what-we-do/tech-skills):
  1. Be a South African citizen with a valid ID
  2. Be an unemployed youth/graduate between 18 to 35 years of age
  3. Reside within proximity of a CodeTribe Academy facility
  4. Not have a criminal record
  5. Minimum 12 months IT qualification / NQF level 5 with programming
     background (e.g. Diploma in IT, Degree/BTech/Honours in IT, BCom
     Informatics, or IT-related field)
  • Young South African females are encouraged to apply
  • People with disabilities are encouraged to apply
  • Final-year students doing work-integrated learning may apply
  NOTE: Candidates with only Matric/Grade 12/NQF level 4 are only considered
  under special circumstances with evidence of software development experience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: MLAB'S FOUR PILLARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 1 — TECH SKILLS
  Supports aspiring coders to develop Android, iOS and Web solutions.
  Training + work experience in ICT. Up-skilling in cloud technologies,
  Scrum agile project management, and 4IR technologies. Accredited by IITPSA.

PILLAR 2 — TECH ECOSYSTEMS
  Short ICT-led interventions for youth. Digital Literacy, Website
  Development, No Code Platforms, 4IR workshops. Targeted at school
  students (STEM) and NEETs (Not in Education, Employment, or Training).

PILLAR 3 — TECH START-UPS
  Early-stage start-up support through BoostUp accelerator, Launch League,
  TIA App Fund, Challenger Digital and Green Accelerator Programme.
  100+ start-ups supported across Transport, Education, Agriculture,
  e-Commerce, Health, Professional Services.

PILLAR 4 — TECH SOLUTIONS
  mLab's Innovation Lab co-creates digital solutions with social impact.
  Projects: MAFATS (livestock services), Zirra (racism reporting, Ahmed
  Kathrada Foundation), Farmru (Agri-Tech, rural Limpopo), ARC HUB
  (Agricultural Research Council), mPowa (SA Youth Network app for
  employment/education/entrepreneurship), cancer awareness, water
  quality monitoring, GBV solution, youth unemployment solution for
  SA Presidency through DSI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: MLAB IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • R50 million GDP contribution
  • 200 start-ups supported → 500+ jobs created, R150M+ funds raised
  • 6 custom digital solutions → 8,000+ users, 4-star avg rating
  • 500 developers trained → 100% Black, youth, South African, 45% female
  • 5,000 youth impacted through 150+ events

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: LAB LOCATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Gauteng — mLab Tshwane (mLab + The Innovation Hub + DSI). First mLab,
    launched 2012. CodeTribe also in Soweto and Tembisa.
  • Limpopo — mLab Polokwane (mLab + Limpopo Connexion + DSI)
  • Northern Cape — mLab Galeshewe (mLab + NC Dept of Economic Dev + Sol
    Plaatje Municipality + NC Community Education College + DSI)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: PARTNERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Founding: World Bank (InfoDev), DSI, CSIR, The Innovation Hub (TIH),
  Finnish Ministry of Foreign Affairs
Accreditation: IITPSA
Recent: GIZ — Digital Skills for Jobs and Income II (DS4JI II), cloud
  computing training for SA SMEs
Others: Ahmed Kathrada Foundation, Agricultural Research Council,
  NC Dept of Economic Dev and Tourism, Sol Plaatje Municipality,
  Limpopo Connexion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: SOCIAL MEDIA & CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  YouTube: @mLabSAStudio
  LinkedIn: mlab-south-africa
  Facebook: @mLabSA
  Twitter/X: @mlabsa
  Phone: +27 012 844 0240
  Website: https://mlab.co.za/contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9: RECENT NEWS (as of Feb 2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Jan 2026 — Hiring a Programme Manager: Digital Skills & Enterprise Dev
  • Oct 2025 — Call for Assessor & Moderator for CodeTribe QCTO Programme
  • Oct 2025 — Challenger Digital and Green Accelerator Programme call
  • Sep 2025 — mLab partners with GIZ (DS4JI II cloud computing training)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10: LMS PLATFORM — CURRENT USER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: Pule Matlhape
Email: tlholo.tshwane@gmail.com
Role: Learner
Enrolled in: All 5 courses (React, TypeScript, Node.js, React Native, MongoDB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11: LMS COURSES (5 courses, 15 modules, 67 lessons)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COURSE 1: REACT
  Instructor: Dr. Thabo Ndlovu | Duration: 8 weeks | Enrolled: 120 | Progress: 45%
  Module 1 — Describing the UI (completed ✓, 9 lessons):
    Your First Component, Importing and Exporting Components, Writing Markup
    with JSX, JavaScript in JSX with Curly Braces, Passing Props to a
    Component, Conditional Rendering, Rendering Lists, Keeping Components
    Pure, Your UI as a Tree
  Module 2 — Adding Interactivity (in progress, 7 lessons):
    Responding to Events, State: A Component's Memory, Render and Commit,
    State as a Snapshot, Queueing a Series of State Updates, Updating
    Objects in State, Updating Arrays in State
  Module 3 — Managing State (locked 🔒, 7 lessons):
    Reacting to Input with State, Choosing the State Structure, Sharing State
    Between Components, Preserving and Resetting State, Extracting State
    Logic into a Reducer, Passing Data Deeply with Context, Scaling Up with
    Reducer and Context

COURSE 2: TYPESCRIPT
  Instructor: Prof. Lerato Khumalo | Duration: 6 weeks | Enrolled: 95 | Progress: 30%
  Module 1 — Getting Started (completed ✓, 3 lessons):
    TypeScript for JavaScript Programmers, TypeScript Tooling in 5 minutes,
    Installing TypeScript
  Module 2 — The Basics (in progress, 4 lessons):
    Static Type Checking, Everyday Types, Narrowing, More on Functions
  Module 3 — Object Types (locked 🔒, 4 lessons):
    Object Types, Type vs Interface, Generics,
    Build a Type-Safe Application (task)

COURSE 3: NODE.JS
  Instructor: Mr. Sipho Dlamini | Duration: 8 weeks | Enrolled: 78 | Progress: 15%
  Module 1 — Introduction to Node.js (completed ✓, 3 lessons):
    Introduction to Node.js, How to Install Node.js, How to Run Node.js Scripts
  Module 2 — Core Concepts (in progress, 4 lessons):
    Node.js Modules, An introduction to npm, Asynchronous JavaScript,
    The Event Loop
  Module 3 — Building APIs with Express (locked 🔒, 4 lessons):
    Introduction to Express.js, Routing in Express, Middleware,
    Build a REST API (task)

COURSE 4: REACT NATIVE
  Instructor: Ms. Nomvula Zulu | Duration: 10 weeks | Enrolled: 65 | Progress: 10%
  Module 1 — Getting Started (completed ✓, 3 lessons):
    Introduction to React Native, Setting Up Development Environment,
    Create Your First App
  Module 2 — Core Components (in progress, 4 lessons):
    Core Components and Native Components, Using Views and Text,
    Style and Layout, Handling Touch Events
  Module 3 — Navigation (locked 🔒, 4 lessons):
    React Navigation Fundamentals, Stack Navigation, Tab Navigation,
    Build a Multi-Screen App (task)

COURSE 5: MONGODB
  Instructor: Dr. Kgomotso Mabaso | Duration: 6 weeks | Enrolled: 55 | Progress: 5%
  Module 1 — Introduction to MongoDB (in progress, 3 lessons):
    What is MongoDB?, Installing MongoDB, MongoDB vs SQL Databases
  Module 2 — CRUD Operations (not started, 4 lessons):
    Creating Documents, Reading Documents, Updating Documents,
    Deleting Documents
  Module 3 — MongoDB with Node.js (locked 🔒, 4 lessons):
    Introduction to Mongoose, Schemas and Models, Connecting to MongoDB,
    Build a Database-Driven App (task)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 12: LMS TASKS (5 tasks — 1 per course)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. React State Management Project
     Course: React | Module: Managing State
     Description: Build a React application that demonstrates your
       understanding of state management using Reducer and Context
     Due: 2026-02-15 | Status: PENDING
     Requirements: useReducer, Context API, state management patterns

  2. TypeScript Type-Safe Application
     Course: TypeScript | Module: Object Types
     Description: Create a type-safe application using interfaces,
       generics, and proper type annotations
     Due: 2026-02-10 | Status: SUBMITTED
     Submitted to: https://github.com/sarahmolefe/ts-project

  3. Node.js REST API
     Course: Node.js | Module: Building APIs with Express
     Description: Build a RESTful API using Express.js with routing,
       middleware, and error handling
     Due: 2026-02-20 | Status: PENDING
     Requirements: Express.js, RESTful routing, middleware, error handling

  4. React Native Multi-Screen App
     Course: React Native | Module: Navigation
     Description: Create a multi-screen mobile application using
       React Navigation with stack and tab navigation
     Due: 2026-01-25 | Status: GRADED — 88/100
     Submitted to: https://github.com/sarahmolefe/rn-navigation
     Feedback: "Excellent navigation implementation! Clean code structure
       and smooth transitions. Consider adding gesture navigation."

  5. MongoDB Database Application
     Course: MongoDB | Module: MongoDB with Node.js
     Description: Build a database-driven application using MongoDB and
       Mongoose with CRUD operations
     Due: 2026-02-28 | Status: PENDING
     Requirements: MongoDB, Mongoose, schemas, CRUD operations

TASK SUMMARY:
  Total tasks: 5
  Pending: 3 (React, Node.js, MongoDB)
  Submitted: 1 (TypeScript)
  Graded: 1 (React Native — 88/100)

HOW TO SUBMIT A TASK:
  1. Go to the Tasks page on the LMS
  2. Find your assignment
  3. Click "Submit Task"
  4. Paste your GitHub repository link
  5. Click Submit
  Make sure your repo is public so your facilitator can review it!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 13: LMS ANNOUNCEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. ⚠️ [URGENT] System Maintenance Notice — IT Support, Jan 18 2026
     "The LMS platform will undergo scheduled maintenance this Saturday
     from 10 PM to 2 AM. Please save your work before this time."

  2. ⭐ [IMPORTANT] Upcoming Career Workshop — Program Coordinator, Jan 20
     "Join us for a career development workshop this Friday. Industry
     professionals will share insights about the tech job market."

  3. React Course Module Update — Dr. Thabo Ndlovu, Jan 19
     "New supplementary materials have been added to Module 2: Adding
     Interactivity. Check the updated examples and practice exercises."

  4. New TypeScript Resources Added — Prof. Lerato Khumalo, Jan 17
     "Additional TypeScript exercises and reference materials are now
     available in the course resources section."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 14: LMS COURSE INSTRUCTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Dr. Thabo Ndlovu — React
  • Prof. Lerato Khumalo — TypeScript
  • Mr. Sipho Dlamini — Node.js
  • Ms. Nomvula Zulu — React Native
  • Dr. Kgomotso Mabaso — MongoDB

For coding help you can also consult your Skills Facilitator
(Kabelo Gaotlhaelwe, Nokwanda Maranjane, or Zack Tinga) or
the Technical Lead (Melvin Musehani).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 15: PROGRAMMING CONCEPTS (taught at CodeTribe)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REACT CONCEPTS:
  • Component — A JavaScript function that returns JSX markup. Components
    are reusable UI pieces that encapsulate structure, styling, and behavior.
    Example: function Button() { return <button>Click me</button>; }
  • JSX — Syntax extension for JavaScript letting you write HTML-like code
    inside JavaScript. Use className instead of class, camelCase for
    attributes, self-closing tags required, embed JS with curly braces {}.
  • Props — Pass data from parent to child component. Read-only.
    Example: <Profile name="Sarah" age={25} />
  • State — Data a component manages internally that changes over time.
    When state changes, React re-renders the component.
    Example: const [count, setCount] = useState(0);
  • Hooks — Special functions for using React features in functional
    components. Common: useState, useEffect, useContext, useReducer, useMemo.
  • useState — Hook that adds state to functional components. Returns
    [currentValue, setterFunction].
  • useEffect — Hook for side effects: fetching data, subscriptions,
    DOM manipulation. Runs after render.
    Example: useEffect(() => { fetchData(); }, [dependencies]);
  • useReducer — For complex state logic. Takes (state, action) → newState.
    Example: const [state, dispatch] = useReducer(reducer, initialState);
  • Virtual DOM — In-memory representation of the real DOM. React compares
    old and new Virtual DOM (diffing) to efficiently update only changed parts.
  • Conditional Rendering — Show different UI based on conditions.
    Example: {isLoggedIn ? <Dashboard /> : <Login />}
  • List Rendering — Display multiple items from an array using map().
    Always use unique keys: items.map(item => <Item key={item.id} />)
  • Key Prop — Helps React identify changed items in lists. Use unique IDs
    (not array indexes) for correct state preservation.
  • Event Handling — React uses camelCase (onClick, onChange) and passes
    synthetic event objects.
  • Fragment — Group elements without extra DOM node: <> </>
  • Controlled Components — Form values managed by React state.
    <input value={name} onChange={e => setName(e.target.value)} />
  • Default/Named Exports — export default App (one per file) vs
    export { Button, Card } (multiple per file)

TYPESCRIPT CONCEPTS:
  • TypeScript — Typed superset of JavaScript with static type checking.
    Catches errors early, better IDE support.
    Example: let name: string = "Sarah";
  • Interface — Defines shape/structure of an object with required and
    optional properties.
    Example: interface User { name: string; age?: number; }
  • Generics — Create reusable components working with multiple types
    while maintaining type safety. Uses <T> syntax.
    Example: function identity<T>(arg: T): T { return arg; }

NODE.JS CONCEPTS:
  • Node.js — JavaScript runtime built on Chrome's V8 engine. Event-driven,
    non-blocking I/O for server-side applications.
  • Express.js — Minimal Node.js web framework for routing, middleware,
    and templating.

REACT NATIVE CONCEPTS:
  • React Native — Build native mobile apps for iOS and Android using
    JavaScript and React. Uses <View>, <Text> instead of div, span.

MONGODB CONCEPTS:
  • MongoDB — Document database storing flexible JSON-like documents (BSON).
    NoSQL, horizontally scalable.
  • Mongoose — ODM library for MongoDB + Node.js. Provides schemas,
    validation, and query building.

GENERAL CONCEPTS:
  • Async/Await — Modern JS syntax for asynchronous operations. Mark
    functions as async, use await for Promises. Preferred over .then() chains.
  • API — Application Programming Interface. Set of rules for software
    communication. REST APIs use HTTP methods.
  • REST API — Representational State Transfer. Uses GET, POST, PUT, DELETE
    for CRUD operations.
  • Closure — Function with access to outer scope variables even after the
    outer function returned. Essential for React state and hooks.
  • camelCase — Naming convention: first word lowercase, subsequent words
    capitalised. Used in JSX for className, onClick, onChange, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 16: FREQUENTLY ASKED QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q: What is the difference between props and state?
A: Props are passed from parent to child (read-only). State is managed within
   a component and changes over time. Props flow down; state is isolated.

Q: Why does my component render multiple times?
A: Components render when: state changes, props change, parent re-renders,
   or context value changes. Use useMemo, useCallback, or React.memo to
   prevent unnecessary renders.

Q: How do I fetch data in React?
A: Use useEffect + async function. Store data with useState. Handle loading
   and error states. Include dependency array.
   Example: useEffect(() => { fetchData(); }, []);

Q: When should I use useReducer instead of useState?
A: Use useState for simple state. Use useReducer for: multiple related state
   variables, state depending on previous state, complex state logic, or
   when passing dispatch to children.

Q: How do I pass data from child to parent?
A: Pass a callback function from parent to child via props. Child calls the
   callback with data. Parent updates its state in the callback.

Q: What is the Virtual DOM?
A: A lightweight JS representation of the real DOM. React compares old and
   new Virtual DOM (diffing) and efficiently updates only the changed parts.

Q: What are the benefits of TypeScript?
A: Early error detection, better IDE support (autocomplete), improved code
   documentation, easier refactoring, better team collaboration.

Q: How do I handle async operations in JavaScript?
A: Use Promises (.then/.catch) or async/await. Async/await is preferred:
   mark functions as async, use await for Promises.

Q: How do I submit a task or assignment?
A: Go to Tasks page → Find assignment → Click "Submit Task" → Paste GitHub
   repo link → Click Submit. Make sure your repo is public.

Q: What courses are available?
A: 5 courses: React (45%), TypeScript (30%), Node.js (15%), React Native
   (10%), MongoDB (5%). Each has 3 modules with multiple lessons.

Q: What are the upcoming task deadlines?
A: Pending: React State Management (Feb 15), Node.js REST API (Feb 20),
   MongoDB Database App (Feb 28). TypeScript was submitted. React Native
   was graded 88/100.

Q: Who should I consult for software development help?
A: Skills Facilitators (Kabelo, Nokwanda, or Zack), Technical Lead (Melvin
   Musehani), Full Stack Developer (Sizwe Masemola), or your course instructor.

Q: Who should I consult for React Native help?
A: Ms. Nomvula Zulu (React Native instructor), your Skills Facilitator, or
   Melvin Musehani (Technical Lead).

Q: Who should I consult for UI/UX design help?
A: Keketso Matsuma — the UI/UX Designer at mLab.

Q: Who should I talk to about HR or admin matters?
A: Antoinette Crafford (HR Consultant), Ivan Johnson (Junior Coordinator),
   or Veronica Mahlangu (Skills Accelerator Coordinator).

Q: What is CodeTribe Academy?
A: A 6–12 month coding programme launched Sept 2014 by The Innovation Hub
   and mLab. Technologies: React, Angular, Ionic, Node.js, React Native,
   MongoDB, TypeScript. Locations: Soweto, Tembisa, Tshwane. IITPSA accredited.

Q: How do I contact mLab?
A: Phone: +27 012 844 0240. Address: U8, Enterprise Building, The Innovation
   Hub, Mark Shuttleworth Street, Tshwane, Pretoria, 0087.
   Web: https://mlab.co.za/contact

Q: What are the CodeTribe selection criteria?
A: SA citizen, aged 18-35, unemployed, near a CodeTribe facility, no criminal
   record, min 12-month IT qualification or NQF level 5 with programming.

Q: What does mLab do? / What are mLab's pillars?
A: Four pillars: (1) Tech Skills — coding training; (2) Tech Start-Ups —
   accelerators; (3) Tech Ecosystems — workshops and events; (4) Tech
   Solutions — digital solutions with social impact.

Q: What is mLab's impact?
A: R50M GDP contribution, 200 start-ups supported, 500+ jobs, R150M+ raised,
   500 developers trained (100% Black youth, 45% female), 5,000 youth impacted.

Q: Who are mLab's partners?
A: World Bank, DSI, CSIR, The Innovation Hub, IITPSA, GIZ, Ahmed Kathrada
   Foundation, Agricultural Research Council, and government departments.

Q: What tech solutions has mLab built?
A: MAFATS, Zirra (racism reporting), Farmru (Agri-Tech), ARC HUB, mPowa
   (SA Youth Network), cancer awareness, water quality monitoring, GBV
   solution, youth unemployment solution for SA Presidency.

Q: Where are the mLab labs?
A: Gauteng (Tshwane, Soweto, Tembisa), Limpopo (Polokwane),
   Northern Cape (Galeshewe).

╔══════════════════════════════════════════════════════════════════╗
║  END OF KNOWLEDGE BASE — Answer ONLY from the above content.   ║
║  If information is not here, say so and direct the student to   ║
║  mlab.co.za or their facilitator.                               ║
╚══════════════════════════════════════════════════════════════════╝
`;
