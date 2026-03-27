/**
 * Knowledge Base System for the AI Chatbot
 * Provides indexed content, terminology, FAQs, and concept mappings
 * for quick retrieval and enhanced response generation
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface LessonContent {
  lessonId: string;
  courseId: string;
  moduleId: string;
  title: string;
  content: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ConceptExplanation {
  id: string;
  term: string;
  category: string;
  explanation: string;
  example?: string;
  relatedConcepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedConcepts: string[];
  views: number;
  helpful: number;
}

export interface ConceptMap {
  conceptId: string;
  concept: string;
  prerequisites: string[];
  relatedConcepts: string[];
  lessons: string[];
  tasks: string[];
}

export interface SearchResult {
  type: 'concept' | 'faq' | 'lesson' | 'definition';
  id: string;
  title: string;
  content: string;
  relevance: number;
}

// ============================================
// CONCEPT TERMINOLOGY DATABASE
// ============================================

export const terminology: ConceptExplanation[] = [
  // React Core Concepts
  {
    id: 'concept-component',
    term: 'Component',
    category: 'React',
    explanation:
      'A React component is a JavaScript function that returns JSX markup. Components are reusable UI pieces that encapsulate structure, styling, and behavior.',
    example: 'function Button() { return <button>Click me</button>; }',
    relatedConcepts: ['jsx', 'props', 'state'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-jsx',
    term: 'JSX',
    category: 'React',
    explanation:
      'JSX is a syntax extension for JavaScript that lets you write HTML-like code inside JavaScript. It makes React components more readable and intuitive.',
    example: '<div className="container"><h1>Hello</h1></div>',
    relatedConcepts: ['component', 'markup', 'babel'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-props',
    term: 'Props',
    category: 'React',
    explanation:
      'Props (properties) are the way to pass data from a parent component to a child component. Props are read-only and help make components reusable.',
    example: '<Profile name="Sarah" age={25} />',
    relatedConcepts: ['component', 'state', 'children'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-state',
    term: 'State',
    category: 'React',
    explanation:
      'State is data that a component manages internally and can change over time. When state changes, React re-renders the component to reflect the new state.',
    example: 'const [count, setCount] = useState(0);',
    relatedConcepts: ['useState', 'hooks', 'props'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-hooks',
    term: 'Hooks',
    category: 'React',
    explanation:
      'Hooks are special functions that let you "hook into" React state and lifecycle features in functional components. They enable state management without class components.',
    example: 'useState, useEffect, useContext, useReducer, useMemo',
    relatedConcepts: ['state', 'useEffect', 'useState', 'custom-hooks'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-useEffect',
    term: 'useEffect Hook',
    category: 'React',
    explanation:
      'useEffect is a hook that lets you perform side effects in function components like data fetching, subscriptions, or manual DOM manipulation after rendering.',
    example: 'useEffect(() => { /* side effect code */ }, [dependencies])',
    relatedConcepts: ['hooks', 'lifecycle', 'dependencies'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-useState',
    term: 'useState Hook',
    category: 'React',
    explanation:
      'useState is a hook that adds state to functional components. It returns an array with the current state value and a function to update that state.',
    example: 'const [value, setValue] = useState(initialValue);',
    relatedConcepts: ['state', 'hooks', 'setState'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-rendering',
    term: 'Rendering',
    category: 'React',
    explanation:
      'Rendering is the process of React determining what UI to display on the screen. React renders based on the current state and props of components.',
    example: 'Component renders when state/props change or parent re-renders',
    relatedConcepts: ['state', 'props', 're-render', 'virtual-dom'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-virtual-dom',
    term: 'Virtual DOM',
    category: 'React',
    explanation:
      'The Virtual DOM is an in-memory representation of the actual DOM. React uses it to efficiently determine what changed and only update those parts in the real DOM.',
    example: 'React compares old and new Virtual DOM to find differences (diffing)',
    relatedConcepts: ['rendering', 'dom', 'performance'],
    difficulty: 'advanced',
  },
  {
    id: 'concept-conditional-rendering',
    term: 'Conditional Rendering',
    category: 'React',
    explanation:
      'Conditional rendering is showing different UI based on conditions. In React, you can use if statements, ternary operators, or && to conditionally render JSX.',
    example: '{isLoggedIn ? <Dashboard /> : <Login />}',
    relatedConcepts: ['jsx', 'logic', 'ternary'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-list-rendering',
    term: 'List Rendering',
    category: 'React',
    explanation:
      'List rendering is displaying multiple items from an array. Use the map() method to transform array data into components. Always use unique keys for list items.',
    example: 'items.map(item => <Item key={item.id} {...item} />)',
    relatedConcepts: ['arrays', 'map', 'keys', 'rendering'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-key-prop',
    term: 'Key Prop',
    category: 'React',
    explanation:
      'The key prop helps React identify which items have changed. Use unique IDs (not array indexes) as keys to maintain component state properly during list updates.',
    example: '<li key={item.id}>{item.name}</li>',
    relatedConcepts: ['list-rendering', 'props', 'identity'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-event-handling',
    term: 'Event Handling',
    category: 'React',
    explanation:
      'Event handling is responding to user interactions like clicks or form submissions. React uses camelCase event names (onClick, onChange) and passes a synthetic event object.',
    example: '<button onClick={handleClick}>Click</button>',
    relatedConcepts: ['jsx', 'handlers', 'synthetic-events'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-form-handling',
    term: 'Form Handling',
    category: 'React',
    explanation:
      'Form handling in React involves managing form state with useState and handling form submission. Controlled components use state to manage input values.',
    example: '<input value={name} onChange={(e) => setName(e.target.value)} />',
    relatedConcepts: ['state', 'controlled-components', 'events'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-export-import',
    term: 'Default and Named Exports',
    category: 'JavaScript/React',
    explanation:
      'Exports let you share code between files. Default exports (export default) are used for main components, while named exports (export function) are for multiple exports per file.',
    example: 'export default App; OR export { Button, Card };',
    relatedConcepts: ['modules', 'imports', 'code-organization'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-fragment',
    term: 'Fragment',
    category: 'React',
    explanation:
      'A Fragment is a lightweight wrapper that lets you group multiple elements without adding an extra DOM node. Use <> </> or <React.Fragment> </React.Fragment>.',
    example: '<><h1>Title</h1><p>Content</p></>',
    relatedConcepts: ['jsx', 'rendering', 'dom'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-camelCase',
    term: 'camelCase',
    category: 'JavaScript/React',
    explanation:
      'camelCase is a naming convention where the first word is lowercase and subsequent words are capitalized without spaces. JSX uses camelCase for attributes like className, onClick.',
    example: 'className, onClick, onChange, onSubmit, htmlFor',
    relatedConcepts: ['jsx', 'naming-conventions'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-closure',
    term: 'Closure',
    category: 'JavaScript',
    explanation:
      'A closure is a function that has access to variables from its outer scope even after the outer function has returned. This is essential for React state and hooks.',
    example: 'function outer() { let x = 1; return () => console.log(x); }',
    relatedConcepts: ['scope', 'functions', 'state'],
    difficulty: 'advanced',
  },
  {
    id: 'concept-reducer',
    term: 'Reducer Function',
    category: 'React',
    explanation:
      'A reducer function takes the current state and an action, and returns a new state. Used with useReducer hook for managing complex state logic.',
    example: 'const [state, dispatch] = useReducer(reducer, initialState);',
    relatedConcepts: ['state', 'useReducer', 'actions'],
    difficulty: 'advanced',
  },
  // TypeScript Concepts
  {
    id: 'concept-typescript',
    term: 'TypeScript',
    category: 'TypeScript',
    explanation: 'TypeScript is a typed superset of JavaScript that adds static type checking. It catches errors early and provides better IDE support.',
    example: 'let name: string = "Sarah";',
    relatedConcepts: ['types', 'interface', 'generics'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-interface',
    term: 'Interface',
    category: 'TypeScript',
    explanation: 'An interface defines the shape/structure of an object. It specifies required and optional properties.',
    example: 'interface User { name: string; age?: number; }',
    relatedConcepts: ['typescript', 'types', 'generics'],
    difficulty: 'intermediate',
  },
  {
    id: 'concept-generics',
    term: 'Generics',
    category: 'TypeScript',
    explanation: 'Generics create reusable components that work with multiple types while maintaining type safety. Uses <T> syntax.',
    example: 'function identity<T>(arg: T): T { return arg; }',
    relatedConcepts: ['typescript', 'interface', 'types'],
    difficulty: 'advanced',
  },
  // Node.js Concepts
  {
    id: 'concept-nodejs',
    term: 'Node.js',
    category: 'Node.js',
    explanation: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It's event-driven with non-blocking I/O for server-side applications.",
    example: 'const http = require("http"); http.createServer(...)',
    relatedConcepts: ['express', 'npm', 'rest-api'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-express',
    term: 'Express.js',
    category: 'Node.js',
    explanation: 'Express.js is a minimal Node.js web framework providing routing, middleware, and templating.',
    example: 'const app = express(); app.get("/", handler);',
    relatedConcepts: ['nodejs', 'rest-api', 'middleware'],
    difficulty: 'intermediate',
  },
  // React Native Concepts
  {
    id: 'concept-react-native',
    term: 'React Native',
    category: 'React Native',
    explanation: 'React Native lets you build native mobile apps for iOS and Android using JavaScript and React.',
    example: '<View><Text>Hello Mobile!</Text></View>',
    relatedConcepts: ['react', 'navigation', 'mobile'],
    difficulty: 'beginner',
  },
  // MongoDB Concepts
  {
    id: 'concept-mongodb',
    term: 'MongoDB',
    category: 'MongoDB',
    explanation: 'MongoDB is a document database storing flexible JSON-like documents (BSON). It is NoSQL and scalable.',
    example: 'db.users.insertOne({ name: "Sarah", age: 25 })',
    relatedConcepts: ['mongoose', 'crud', 'database'],
    difficulty: 'beginner',
  },
  {
    id: 'concept-mongoose',
    term: 'Mongoose',
    category: 'MongoDB',
    explanation: 'Mongoose is an ODM library for MongoDB + Node.js providing schemas, validation, and query building.',
    example: 'const userSchema = new Schema({ name: String });',
    relatedConcepts: ['mongodb', 'nodejs', 'schema'],
    difficulty: 'intermediate',
  },
];

// ============================================
// FAQ DATABASE
// ============================================

export const faqDatabase: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is the difference between props and state?',
    answer:
      'Props are passed from parent to child component and are read-only. State is managed within a component and can change. Props flow down, while state is isolated to the component that owns it. When you need to update data from parent component, use props. When a component manages its own data that changes over time, use state.',
    category: 'React Basics',
    relatedConcepts: ['props', 'state'],
    views: 1250,
    helpful: 892,
  },
  {
    id: 'faq-2',
    question: 'Why does my component render multiple times?',
    answer:
      'Components render when: 1) State changes, 2) Props change, 3) Parent component renders, 4) Context value changes. To prevent unnecessary renders, use useMemo, useCallback, or React.memo. Check for missing dependencies in useEffect to avoid infinite loops. Use DevTools to identify what triggered a render.',
    category: 'Performance',
    relatedConcepts: ['rendering', 'performance', 'useEffect'],
    views: 956,
    helpful: 734,
  },
  {
    id: 'faq-3',
    question: 'What is the purpose of the key prop in lists?',
    answer:
      'The key prop helps React identify which items have changed in a list. It allows React to preserve component state when list items are reordered, added, or removed. Always use stable, unique identifiers (like database IDs) as keys, not array indexes. Without proper keys, you may encounter bugs with form inputs and component state.',
    category: 'Lists',
    relatedConcepts: ['key-prop', 'list-rendering'],
    views: 1456,
    helpful: 1203,
  },
  {
    id: 'faq-4',
    question: 'How do I prevent a component from rendering?',
    answer:
      'Use React.memo() to wrap your component and prevent re-renders when props haven\'t changed. For complex comparisons, pass a custom comparison function. Use useMemo() to memoize expensive calculations. Use useCallback() to ensure functions don\'t change between renders. These tools help optimize performance by skipping unnecessary renders.',
    category: 'Performance',
    relatedConcepts: ['rendering', 'memo', 'useCallback', 'useMemo'],
    views: 845,
    helpful: 623,
  },
  {
    id: 'faq-5',
    question: 'What is the Virtual DOM and why does it matter?',
    answer:
      'The Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to compare old and new versions (diffing), and then efficiently updates only the changed parts in the real DOM. This approach is faster than directly manipulating the DOM and makes React performant. Understanding the Virtual DOM helps explain why React renders efficiently.',
    category: 'React Concepts',
    relatedConcepts: ['virtual-dom', 'rendering', 'performance'],
    views: 1123,
    helpful: 891,
  },
  {
    id: 'faq-6',
    question: 'When should I use useReducer instead of useState?',
    answer:
      'Use useState for simple state (single value or small related values). Use useReducer when: 1) You have multiple related state variables, 2) Next state depends on previous state, 3) You want to pass dispatch to child components, 4) You have complex state logic. useReducer makes it easier to test and manage state transitions.',
    category: 'State Management',
    relatedConcepts: ['state', 'useReducer', 'useState'],
    views: 678,
    helpful: 521,
  },
  {
    id: 'faq-7',
    question: 'How do I fetch data in React components?',
    answer:
      'Use useEffect hook with an async function to fetch data. Put the fetch logic in the effect, and use a cleanup function to avoid memory leaks. Use useState to store loading, error, and data states. Always include proper error handling and set a dependency array to control when the effect runs. Consider using a data fetching library like React Query for production apps.',
    category: 'Data Management',
    relatedConcepts: ['useEffect', 'async', 'state'],
    views: 2145,
    helpful: 1756,
  },
  {
    id: 'faq-8',
    question: 'What is the difference between controlled and uncontrolled components?',
    answer:
      'Controlled components have their state managed by React (form values come from state). Uncontrolled components manage their own state (values come from DOM). Use controlled components for most cases because they give React full control. Uncontrolled components are sometimes useful for integrating with non-React code or file inputs.',
    category: 'Forms',
    relatedConcepts: ['state', 'form-handling', 'controlled-components'],
    views: 934,
    helpful: 712,
  },
  {
    id: 'faq-9',
    question: 'How do I pass data from child to parent component?',
    answer:
      'You cannot pass data directly from child to parent. Instead, pass a callback function from parent to child via props. The child calls this callback with data as an argument. The parent receives the data in the callback and updates its state. This unidirectional data flow keeps React predictable and maintainable.',
    category: 'Component Communication',
    relatedConcepts: ['props', 'callbacks', 'state'],
    views: 1567,
    helpful: 1203,
  },
  {
    id: 'faq-10',
    question: 'What is the difference between defaultProps and required props?',
    answer:
      'defaultProps sets default values for props if they are not provided by the parent component. Required props (often indicated by TypeScript interfaces or PropTypes) must be provided. Use defaultProps for optional props with sensible defaults. Use TypeScript or PropTypes to enforce required props and catch missing props during development.',
    category: 'Props',
    relatedConcepts: ['props', 'defaultProps', 'typescript'],
    views: 456,
    helpful: 342,
  },
  // Platform FAQs
  {
    id: 'faq-submit-task',
    question: 'How do I submit a task or assignment?',
    answer: 'Go to the Tasks page, find your assignment, click "Submit Task", paste your GitHub repository link, then click Submit. Make sure your repo is public so your facilitator can review it.',
    category: 'Platform',
    relatedConcepts: ['tasks', 'submission', 'github'],
    views: 2500,
    helpful: 2100,
  },
  {
    id: 'faq-deadlines',
    question: 'What are the upcoming task deadlines?',
    answer: 'Current pending tasks: React State Management Project (Feb 15), Node.js REST API (Feb 20), MongoDB Database Application (Feb 28). TypeScript Type-Safe App was submitted. React Native Multi-Screen App was graded with 88%.',
    category: 'Platform',
    relatedConcepts: ['tasks', 'deadlines', 'schedule'],
    views: 3000,
    helpful: 2800,
  },
  {
    id: 'faq-courses-available',
    question: 'What courses are available on the platform?',
    answer: 'There are 5 courses: React (45% progress), TypeScript (30%), Node.js (15%), React Native (10%), and MongoDB (5%). Each course has 3 modules with multiple lessons.',
    category: 'Platform',
    relatedConcepts: ['courses', 'curriculum'],
    views: 2000,
    helpful: 1800,
  },
  // mLab FAQs
  {
    id: 'faq-mlab',
    question: 'What is mLab?',
    answer: 'mLab (Mobile Applications Laboratory NPC) is a tech-centred not-for-profit company that prepares innovators and entrepreneurs for the digital economy. Established in 2011, it has offices in Limpopo, Gauteng, and Northern Cape. It is a Level 1 B-BBEE service provider. Phone: +27 012 844 0240.',
    category: 'mLab',
    relatedConcepts: ['organization', 'codetribe'],
    views: 1800,
    helpful: 1600,
  },
  {
    id: 'faq-ceo',
    question: 'Who is the CEO of mLab?',
    answer: 'The CEO of mLab is Nicki Koorbanally. The COO is Tendai Mazhude. The Technical Lead is Melvin Musehani.',
    category: 'mLab',
    relatedConcepts: ['leadership', 'team'],
    views: 1500,
    helpful: 1400,
  },
  {
    id: 'faq-codetribe',
    question: 'What is CodeTribe Academy?',
    answer: 'CodeTribe Academy (launched September 1, 2014) is a 6-12 month programme by The Innovation Hub and mLab to develop software developers. Technologies taught include ReactJS, Angular, Ionic, Node.js, React Native, MongoDB, and TypeScript. Locations: Soweto, Tembisa, Tshwane.',
    category: 'mLab',
    relatedConcepts: ['codetribe', 'programme', 'training'],
    views: 2200,
    helpful: 2000,
  },
  {
    id: 'faq-mlab-pillars',
    question: 'What does mLab do?',
    answer: 'mLab has four pillars: (1) Tech Skills — coding training and upskilling; (2) Tech Start-Ups — accelerators like BoostUp and Launch League; (3) Tech Ecosystems — workshops, bootcamps, and events; (4) Tech Solutions — digital solutions with social impact.',
    category: 'mLab',
    relatedConcepts: ['pillars', 'services'],
    views: 1400,
    helpful: 1200,
  },
  {
    id: 'faq-mlab-contact',
    question: 'How do I contact mLab?',
    answer: 'Phone: +27 012 844 0240. Address: U8, Enterprise Building, The Innovation Hub, Mark Shuttleworth Street, Tshwane, Pretoria, 0087. Website: mlab.co.za/contact. Social: @mlabsa on Twitter, Facebook, LinkedIn, YouTube.',
    category: 'mLab',
    relatedConcepts: ['contact', 'phone', 'address'],
    views: 1600,
    helpful: 1500,
  },
  {
    id: 'faq-mlab-partners',
    question: "Who are mLab's partners?",
    answer: 'Founding partners: World Bank (InfoDev), DSI, CSIR, The Innovation Hub. Accreditation: IITPSA. Recent partner: GIZ — Digital Skills for Jobs and Income II. mLab also works with the Ahmed Kathrada Foundation, Agricultural Research Council, and government departments.',
    category: 'mLab',
    relatedConcepts: ['partners', 'organizations'],
    views: 1300,
    helpful: 1100,
  },
  // ─── Additional mLab Programme FAQs ────────────────────────────
  {
    id: 'faq-mlab-what-is',
    question: 'What is mLab?',
    answer: 'mLab is a youth tech-centred organisation that provides digital skills training for youth and supports innovators and entrepreneurs to grow and succeed in the digital economy. It is a South African not-for-profit (NPC) with public benefit organisation (PBO) status, founded in 2011.',
    category: 'mLab',
    relatedConcepts: ['organization', 'mission'],
    views: 2000,
    helpful: 1800,
  },
  {
    id: 'faq-mlab-what-provides',
    question: 'What does mLab provide?',
    answer: 'mLab provides: (1) Digital skills training through CodeTribe and other programmes; (2) Support for tech start-ups through BoostUp and Launch League accelerators; (3) Technology development services; (4) Digital solutions with social impact through its Innovation Lab.',
    category: 'mLab',
    relatedConcepts: ['services', 'offerings'],
    views: 1700,
    helpful: 1500,
  },
  {
    id: 'faq-mlab-target-audience',
    question: 'Who does mLab focus on?',
    answer: 'mLab focuses on youth, women, and previously disadvantaged communities. The programmes are designed to empower these groups through digital skills training and enterprise support.',
    category: 'mLab',
    relatedConcepts: ['audience', 'impact'],
    views: 1400,
    helpful: 1200,
  },
  {
    id: 'faq-mlab-founded',
    question: 'When was mLab founded and who founded it?',
    answer: 'mLab was founded in 2011 by a consortium including the World Bank (InfoDev), Department of Science and Innovation (DSTI), Council for Scientific and Industrial Research (CSIR), and The Innovation Hub (TIH). The goal was to grow the mobile applications industry in South Africa.',
    category: 'mLab',
    relatedConcepts: ['history', 'founding'],
    views: 1200,
    helpful: 1000,
  },
  {
    id: 'faq-mlab-offices',
    question: 'Where are mLab offices located?',
    answer: 'mLab has offices in: Limpopo (Polokwane), Gauteng (Tshwane/Soweto/Tembisa), KwaZulu-Natal (Pietermaritzburg), and Northern Cape (Kimberley).',
    category: 'mLab',
    relatedConcepts: ['locations', 'facilities'],
    views: 1300,
    helpful: 1100,
  },
  {
    id: 'faq-mlab-offerings',
    question: 'What are mLab\'s main programmes?',
    answer: 'mLab\'s main offerings are: (1) CodeTribe - software development training (QCTO, Traditional in-person, and Virtual online); (2) Step Up - systems administration and digital marketing training (virtual); (3) IoT Programme - Internet of Things skills; (4) Enterprise Development Programme - start-up support.',
    category: 'mLab',
    relatedConcepts: ['programmes', 'training'],
    views: 1600,
    helpful: 1400,
  },
  // ─── CodeTribe Subprogramme FAQs ─────────────────────────────
  {
    id: 'faq-codetribe-what',
    question: 'What is CodeTribe?',
    answer: 'CodeTribe (mLab CodeTribe) is an ICT programme that focuses on training youth in software development. It comes in three setups: (1) QCTO CodeTribe - foundational training; (2) Traditional CodeTribe - in-person training for those with development background; (3) Virtual CodeTribe - online version of Traditional CodeTribe.',
    category: 'CodeTribe',
    relatedConcepts: ['training', 'software'],
    views: 2200,
    helpful: 2000,
  },
  {
    id: 'faq-qcto-codetribe',
    question: 'What is QCTO CodeTribe?',
    answer: 'QCTO CodeTribe is a foundational training sub-programme for those not well versed in software development. It is aligned with QCTO requirements and the Software Developer SAQA ID 118707. Duration: 12 months. Location: Kimberley, Northern Cape.',
    category: 'CodeTribe',
    relatedConcepts: ['qcto', 'foundational'],
    views: 1500,
    helpful: 1300,
  },
  {
    id: 'faq-qcto-outcomes',
    question: 'What skills will I gain from QCTO CodeTribe?',
    answer: 'QCTO CodeTribe trainees will: (1) Develop a foundation in programming fundamentals; (2) Master Object-Oriented Programming; (3) Work with APIs; (4) Become proficient in database modelling and ORM; (5) Understand MVC patterns; (6) Execute application deployment.',
    category: 'CodeTribe',
    relatedConcepts: ['outcomes', 'skills'],
    views: 1400,
    helpful: 1200,
  },
  {
    id: 'faq-qcto-requirements',
    question: 'What are the requirements for QCTO CodeTribe?',
    answer: 'To qualify for QCTO CodeTribe, you need: (1) A South African ID; (2) A Matric certificate. Applications usually open around April/May, and are posted on mLab\'s social media (LinkedIn, Facebook, Twitter).',
    category: 'CodeTribe',
    relatedConcepts: ['requirements', 'application'],
    views: 1300,
    helpful: 1100,
  },
  {
    id: 'faq-traditional-codetribe',
    question: 'What is Traditional CodeTribe?',
    answer: 'Traditional CodeTribe is an in-person sub-programme for software development graduates or self-taught developers. It introduces in-demand industry technologies to prepare trainees for the job market. Locations: Polokwane (Limpopo) and Pietermaritzburg (KZN). Duration: 9-12 months.',
    category: 'CodeTribe',
    relatedConcepts: ['traditional', 'in-person'],
    views: 1700,
    helpful: 1500,
  },
  {
    id: 'faq-traditional-tech-stack',
    question: 'What technologies are taught in Traditional CodeTribe?',
    answer: 'Traditional CodeTribe teaches: React/TypeScript, React Native, Node.js, and PostgreSQL. Trainees learn to implement UI/UX designs, build web and mobile applications, collaborate on projects, plan database structures, and debug code.',
    category: 'CodeTribe',
    relatedConcepts: ['technologies', 'tech-stack'],
    views: 1800,
    helpful: 1600,
  },
  {
    id: 'faq-traditional-requirements',
    question: 'What are the requirements for Traditional CodeTribe?',
    answer: 'To qualify for Traditional CodeTribe, you need: (1) A South African ID; (2) A Matric certificate; (3) Prior exposure to software development (formal training like diploma/degree or informal like self-taught/bootcamps). Applications open around April/May, posted on mLab\'s social media.',
    category: 'CodeTribe',
    relatedConcepts: ['requirements', 'experience'],
    views: 1400,
    helpful: 1200,
  },
  {
    id: 'faq-traditional-careers',
    question: 'What career paths are available after Traditional CodeTribe?',
    answer: 'Graduates can pursue: (1) Fullstack JavaScript Developer; (2) React Developer; (3) Frontend Developer; (4) UI/UX Designer; (5) React Native Developer.',
    category: 'CodeTribe',
    relatedConcepts: ['careers', 'employment'],
    views: 1500,
    helpful: 1300,
  },
  {
    id: 'faq-virtual-codetribe',
    question: 'What is Virtual CodeTribe?',
    answer: 'Virtual CodeTribe is an online version of Traditional CodeTribe. It targets software development graduates or self-taught developers and introduces in-demand industry technologies. Since it\'s virtual/online, trainees can attend from anywhere, enabling a bigger reach than in-person programmes.',
    category: 'CodeTribe',
    relatedConcepts: ['virtual', 'online'],
    views: 1600,
    helpful: 1400,
  },
  {
    id: 'faq-virtual-tech-stack',
    question: 'What technologies are covered in Virtual CodeTribe?',
    answer: 'Virtual CodeTribe covers: React/TypeScript, React Native, Node.js, and PostgreSQL. Outcomes include implementing UI/UX designs, building web and mobile applications, collaborating on projects, planning database structures, and debugging code.',
    category: 'CodeTribe',
    relatedConcepts: ['technologies', 'virtual'],
    views: 1500,
    helpful: 1300,
  },
  // ─── Step Up Programme FAQs ────────────────────────────────────
  {
    id: 'faq-step-up',
    question: 'What is the Step Up programme?',
    answer: 'Step Up is a virtual 12-month programme (6 months training + 6 months placements) for youth with a Matric qualification. It trains trainees to become system administrators and digital marketing professionals. Taught content: HTML, CSS, Word, Excel, PowerPoint, Wix, Cyber Safety, Digital Marketing, 4IR, Zoho, and Azure Administrator.',
    category: 'mLab',
    relatedConcepts: ['step-up', 'programme'],
    views: 1400,
    helpful: 1200,
  },
  {
    id: 'faq-step-up-requirements',
    question: 'What are the requirements for Step Up?',
    answer: 'To qualify for Step Up, you need: (1) A South African ID; (2) A Matric certificate. The programme is virtual, so you can attend from anywhere in South Africa.',
    category: 'mLab',
    relatedConcepts: ['step-up', 'requirements'],
    views: 1200,
    helpful: 1000,
  },
  {
    id: 'faq-step-up-outcomes',
    question: 'What will I learn in Step Up?',
    answer: 'Step Up trainees will learn to: (1) Plan and create basic websites using HTML/CSS or Wix; (2) Utilise Zoho for Systems Administration; (3) Protect themselves from cyber threats; (4) Create and publish marketing content; (5) Create and manage social media content.',
    category: 'mLab',
    relatedConcepts: ['step-up', 'outcomes'],
    views: 1300,
    helpful: 1100,
  },
  {
    id: 'faq-step-up-careers',
    question: 'What careers can I pursue after Step Up?',
    answer: 'After Step Up, you can work as: (1) System Administrator; (2) Web Developer; (3) Digital Marketer; (4) Content Creator.',
    category: 'mLab',
    relatedConcepts: ['step-up', 'careers'],
    views: 1200,
    helpful: 1000,
  },
];

// ============================================
// CONCEPT MAP
// ============================================

export const conceptMaps: ConceptMap[] = [
  {
    conceptId: 'map-1',
    concept: 'React Components',
    prerequisites: ['javascript-basics', 'jsx-syntax'],
    relatedConcepts: ['props', 'state', 'hooks', 'lifecycle'],
    lessons: ['react-l1', 'react-l2', 'react-l5'],
    tasks: ['task-component-1', 'task-component-2'],
  },
  {
    conceptId: 'map-2',
    concept: 'State Management',
    prerequisites: ['react-components', 'hooks'],
    relatedConcepts: ['useState', 'useReducer', 'useContext', 'state-patterns'],
    lessons: ['react-l8', 'react-l9'],
    tasks: ['task-state-1', 'task-state-2', 'task-state-3'],
  },
  {
    conceptId: 'map-3',
    concept: 'Side Effects',
    prerequisites: ['react-components', 'hooks'],
    relatedConcepts: ['useEffect', 'cleanup', 'dependencies', 'async'],
    lessons: ['react-l10', 'react-l11'],
    tasks: ['task-effects-1', 'task-effects-2'],
  },
  {
    conceptId: 'map-4',
    concept: 'Conditional & List Rendering',
    prerequisites: ['jsx-syntax', 'javascript-basics'],
    relatedConcepts: ['ternary', 'conditional', 'map', 'filter', 'keys'],
    lessons: ['react-l6', 'react-l7'],
    tasks: ['task-rendering-1', 'task-rendering-2'],
  },
  {
    conceptId: 'map-5',
    concept: 'Props & Component Communication',
    prerequisites: ['react-components'],
    relatedConcepts: ['props', 'callbacks', 'children', 'composition'],
    lessons: ['react-l5'],
    tasks: ['task-props-1', 'task-props-2', 'task-props-3'],
  },
  {
    conceptId: 'map-6',
    concept: 'Performance Optimization',
    prerequisites: ['state-management', 'side-effects'],
    relatedConcepts: ['useMemo', 'useCallback', 'memo', 'lazy-loading'],
    lessons: ['react-l12', 'react-l13'],
    tasks: ['task-performance-1'],
  },
];

// ============================================
// LESSON CONTENT INDEX
// ============================================

export const lessonContentIndex: LessonContent[] = [
  {
    lessonId: 'react-l1',
    courseId: 'course-react',
    moduleId: 'module-1',
    title: 'Your First Component',
    content:
      'Components are one of the core concepts of React. They are the foundation upon which you build user interfaces, making them the perfect place to start your React journey!',
    keywords: [
      'component',
      'jsx',
      'function',
      'reusable',
      'capital-letter',
      'markup',
    ],
    difficulty: 'beginner',
  },
  {
    lessonId: 'react-l2',
    courseId: 'course-react',
    moduleId: 'module-1',
    title: 'Importing and Exporting Components',
    content:
      'As your application grows, you will want to split your components across different files. This keeps your codebase organized and makes components easier to reuse.',
    keywords: [
      'export',
      'import',
      'modules',
      'default-export',
      'named-export',
      'organization',
    ],
    difficulty: 'beginner',
  },
  {
    lessonId: 'react-l3',
    courseId: 'course-react',
    moduleId: 'module-1',
    title: 'Writing Markup with JSX',
    content:
      'JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. It is the most popular way to write React components.',
    keywords: [
      'jsx',
      'markup',
      'html',
      'syntax',
      'curly-braces',
      'camelCase',
      'className',
    ],
    difficulty: 'beginner',
  },
  {
    lessonId: 'react-l4',
    courseId: 'course-react',
    moduleId: 'module-1',
    title: 'JavaScript in JSX with Curly Braces',
    content:
      'Curly braces let you escape back into JavaScript from JSX. You can use them in two places: as text inside a tag and as attributes.',
    keywords: [
      'curly-braces',
      'jsx',
      'javascript',
      'expressions',
      'variables',
      'objects',
    ],
    difficulty: 'beginner',
  },
  {
    lessonId: 'react-l5',
    courseId: 'course-react',
    moduleId: 'module-2',
    title: 'Passing Props to a Component',
    content:
      'React components use props to communicate with each other. Every parent component can pass some information to its child components by giving them props.',
    keywords: [
      'props',
      'passing',
      'parent',
      'child',
      'arguments',
      'children',
      'spreading',
    ],
    difficulty: 'beginner',
  },
  {
    lessonId: 'react-l6',
    courseId: 'course-react',
    moduleId: 'module-2',
    title: 'Conditional Rendering',
    content:
      'Your components will often need to display different things depending on different conditions. In React, you can conditionally render JSX using if statements, &&, and ?: operators.',
    keywords: [
      'conditional',
      'rendering',
      'if',
      'ternary',
      'logical-and',
      'null',
      'conditions',
    ],
    difficulty: 'beginner',
  },
  {
    lessonId: 'react-l7',
    courseId: 'course-react',
    moduleId: 'module-2',
    title: 'Rendering Lists',
    content:
      'You will often want to display multiple similar components from a collection of data. You can use JavaScript array methods to manipulate an array of data.',
    keywords: [
      'lists',
      'rendering',
      'array',
      'map',
      'filter',
      'keys',
      'identity',
      'indexes',
    ],
    difficulty: 'beginner',
  },
];

// ============================================
// KNOWLEDGE BASE SEARCH & INDEXING FUNCTIONS
// ============================================

/**
 * Search the knowledge base for concepts, FAQs, and lessons
 * Returns results ranked by relevance
 */
export function searchKnowledgeBase(query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search concepts/terminology
  terminology.forEach((term) => {
    const titleMatch = term.term.toLowerCase().includes(normalizedQuery);
    const explanationMatch = term.explanation.toLowerCase().includes(normalizedQuery);
    const exampleMatch = term.example
      ?.toLowerCase()
      .includes(normalizedQuery) || false;
    const keywordMatch = term.relatedConcepts.some((c) =>
      c.toLowerCase().includes(normalizedQuery),
    );

    if (titleMatch || explanationMatch || exampleMatch || keywordMatch) {
      results.push({
        type: 'concept',
        id: term.id,
        title: term.term,
        content: term.explanation,
        relevance: titleMatch ? 1.0 : explanationMatch ? 0.8 : 0.5,
      });
    }
  });

  // Search FAQs
  faqDatabase.forEach((faq) => {
    const questionMatch = faq.question.toLowerCase().includes(normalizedQuery);
    const answerMatch = faq.answer.toLowerCase().includes(normalizedQuery);
    const categoryMatch = faq.category.toLowerCase().includes(normalizedQuery);

    if (questionMatch || answerMatch || categoryMatch) {
      results.push({
        type: 'faq',
        id: faq.id,
        title: faq.question,
        content: faq.answer,
        relevance: questionMatch ? 1.0 : answerMatch ? 0.8 : 0.6,
      });
    }
  });

  // Search lesson content
  lessonContentIndex.forEach((lesson) => {
    const titleMatch = lesson.title.toLowerCase().includes(normalizedQuery);
    const contentMatch = lesson.content.toLowerCase().includes(normalizedQuery);
    const keywordMatch = lesson.keywords.some((k) =>
      k.toLowerCase().includes(normalizedQuery),
    );

    if (titleMatch || contentMatch || keywordMatch) {
      results.push({
        type: 'lesson',
        id: lesson.lessonId,
        title: lesson.title,
        content: lesson.content,
        relevance: titleMatch ? 1.0 : contentMatch ? 0.8 : 0.5,
      });
    }
  });

  // Sort by relevance (highest first) and return
  return results.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Get a specific concept by ID or term
 */
export function getConceptByTerm(
  term: string,
): ConceptExplanation | undefined {
  return terminology.find((c) => c.term.toLowerCase() === term.toLowerCase());
}

/**
 * Get related concepts for a given concept
 */
export function getRelatedConcepts(conceptId: string): ConceptExplanation[] {
  const concept = terminology.find((c) => c.id === conceptId);
  if (!concept) return [];

  return concept.relatedConcepts
    .map((relatedId) => terminology.find((c) => c.id === relatedId))
    .filter((c): c is ConceptExplanation => c !== undefined);
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: string): FAQItem[] {
  return faqDatabase.filter(
    (faq) => faq.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get concept map by concept name
 */
export function getConceptMap(conceptName: string): ConceptMap | undefined {
  return conceptMaps.find(
    (map) => map.concept.toLowerCase() === conceptName.toLowerCase(),
  );
}

/**
 * Get lessons by course ID
 */
export function getLessonsByCoursePath(courseId: string): LessonContent[] {
  return lessonContentIndex.filter((lesson) => lesson.courseId === courseId);
}

/**
 * Get lessons by difficulty level
 */
export function getLessonsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced',
): LessonContent[] {
  return lessonContentIndex.filter((lesson) => lesson.difficulty === difficulty);
}

/**
 * Index content by keywords for faster retrieval
 * Returns a map of keyword -> relevant items
 */
export function buildKeywordIndex(): Map<string, string[]> {
  const keywordIndex = new Map<string, string[]>();

  // Index concepts
  terminology.forEach((concept) => {
    const keywords = [concept.term.toLowerCase(), ...concept.relatedConcepts];
    keywords.forEach((keyword) => {
      if (!keywordIndex.has(keyword)) {
        keywordIndex.set(keyword, []);
      }
      keywordIndex.get(keyword)?.push(`concept:${concept.id}`);
    });
  });

  // Index FAQs
  faqDatabase.forEach((faq) => {
    const keywords = faq.question.toLowerCase().split(/\s+/).slice(0, 5); // First 5 words
    keywords.forEach((keyword) => {
      if (!keywordIndex.has(keyword)) {
        keywordIndex.set(keyword, []);
      }
      keywordIndex.get(keyword)?.push(`faq:${faq.id}`);
    });
  });

  // Index lessons
  lessonContentIndex.forEach((lesson) => {
    const keywords = [lesson.title.toLowerCase(), ...lesson.keywords];
    keywords.forEach((keyword) => {
      if (!keywordIndex.has(keyword)) {
        keywordIndex.set(keyword, []);
      }
      keywordIndex.get(keyword)?.push(`lesson:${lesson.lessonId}`);
    });
  });

  return keywordIndex;
}

/**
 * Get learning path for a concept
 * Returns prerequisite concepts and related lessons
 */
export function getLearningPath(conceptName: string): {
  prerequisites: ConceptExplanation[];
  relatedLessons: LessonContent[];
  relatedFAQs: FAQItem[];
} {
  const conceptMap = getConceptMap(conceptName);

  const prerequisites = conceptMap
    ? conceptMap.prerequisites
        .map((id) => terminology.find((c) => c.id === id))
        .filter((c): c is ConceptExplanation => c !== undefined)
    : [];

  const relatedLessons = conceptMap
    ? conceptMap.lessons
        .map((id) => lessonContentIndex.find((l) => l.lessonId === id))
        .filter((l): l is LessonContent => l !== undefined)
    : [];

  const relatedFAQs = conceptMap
    ? conceptMap.prerequisites
        .map((id) => faqDatabase.find((f) => f.relatedConcepts.includes(id)))
        .filter((f): f is FAQItem => f !== undefined)
    : [];

  return { prerequisites, relatedLessons, relatedFAQs };
}

/**
 * Get most helpful FAQs (sorted by helpful votes)
 */
export function getTopFAQs(limit: number = 5): FAQItem[] {
  return [...faqDatabase].sort((a, b) => b.helpful - a.helpful).slice(0, limit);
}

/**
 * Get popular FAQs (sorted by views)
 */
export function getPopularFAQs(limit: number = 5): FAQItem[] {
  return [...faqDatabase].sort((a, b) => b.views - a.views).slice(0, limit);
}

/**
 * Generate context-aware suggestions based on current lesson/concept
 */
export function getContextualSuggestions(
  currentLessonId?: string,
  currentConcept?: string,
): {
  nextLessons: LessonContent[];
  relatedConcepts: ConceptExplanation[];
  helpfulFAQs: FAQItem[];
} {
  const currentLesson = lessonContentIndex.find(
    (l) => l.lessonId === currentLessonId,
  );
  const nextLessons = currentLesson
    ? lessonContentIndex.filter(
        (l) =>
          l.courseId === currentLesson.courseId &&
          l.lessonId !== currentLessonId,
      )
    : [];

  const relatedConcepts = currentConcept
    ? getRelatedConcepts(`concept-${currentConcept}`)
    : [];

  const helpfulFAQs = currentLesson
    ? faqDatabase.filter((faq) =>
        currentLesson.keywords.some((keyword) =>
          faq.relatedConcepts.some(
            (concept) =>
              concept.toLowerCase().includes(keyword) ||
              keyword.includes(concept.toLowerCase()),
          ),
        ),
      )
    : [];

  return {
    nextLessons: nextLessons.slice(0, 3),
    relatedConcepts: relatedConcepts.slice(0, 3),
    helpfulFAQs: helpfulFAQs.slice(0, 3),
  };
}
