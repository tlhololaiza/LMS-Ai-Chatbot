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
