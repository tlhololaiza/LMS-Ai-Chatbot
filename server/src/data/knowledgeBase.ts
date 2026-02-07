/**
 * Simplified Knowledge Base for Backend AI Integration
 * Contains core concepts and FAQs for RAG enhancement
 */

export interface Concept {
  id: string;
  title: string;
  explanation: string;
  category: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Core React concepts
export const concepts: Concept[] = [
  {
    id: 'concept-component',
    title: 'Component',
    category: 'React',
    explanation: 'A React component is a JavaScript function that returns JSX markup. Components are reusable UI pieces that encapsulate structure, styling, and behavior.'
  },
  {
    id: 'concept-jsx',
    title: 'JSX',
    category: 'React',
    explanation: 'JSX is a syntax extension for JavaScript that lets you write HTML-like code inside JavaScript. It makes React components more readable and intuitive.'
  },
  {
    id: 'concept-props',
    title: 'Props',
    category: 'React',
    explanation: 'Props (properties) are the way to pass data from a parent component to a child component. Props are read-only and help make components reusable.'
  },
  {
    id: 'concept-state',
    title: 'State',
    category: 'React',
    explanation: 'State is data that a component manages internally and can change over time. When state changes, React re-renders the component to reflect the new state.'
  },
  {
    id: 'concept-hooks',
    title: 'Hooks',
    category: 'React',
    explanation: 'Hooks are special functions that let you use React features like state and lifecycle methods in functional components. Common hooks include useState, useEffect, and useContext.'
  },
  {
    id: 'concept-useeffect',
    title: 'useEffect',
    category: 'React',
    explanation: 'useEffect is a React Hook that lets you perform side effects in functional components, such as fetching data, setting up subscriptions, or manually changing the DOM.'
  },
  {
    id: 'concept-typescript',
    title: 'TypeScript',
    category: 'Programming',
    explanation: 'TypeScript is a typed superset of JavaScript that adds static type checking. It helps catch errors early and makes code more maintainable and self-documenting.'
  },
  {
    id: 'concept-async-await',
    title: 'Async/Await',
    category: 'JavaScript',
    explanation: 'Async/await is a modern JavaScript syntax for handling asynchronous operations. It makes asynchronous code look and behave more like synchronous code, improving readability.'
  },
  {
    id: 'concept-api',
    title: 'API',
    category: 'Web Development',
    explanation: 'API (Application Programming Interface) is a set of rules that allows different software applications to communicate with each other. REST APIs use HTTP methods to interact with data.'
  },
  {
    id: 'concept-rest',
    title: 'REST API',
    category: 'Web Development',
    explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications. REST APIs use standard HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations.'
  }
];

// Frequently Asked Questions
export const faqs: FAQ[] = [
  {
    id: 'faq-react-basics',
    question: 'What is React and why should I use it?',
    answer: 'React is a JavaScript library for building user interfaces. You should use it because it makes building interactive UIs easier through reusable components, efficient updates with the virtual DOM, and a large ecosystem of tools and libraries.',
    category: 'React'
  },
  {
    id: 'faq-jsx-vs-html',
    question: 'What is the difference between JSX and HTML?',
    answer: 'JSX is JavaScript XML that looks like HTML but has key differences: use className instead of class, camelCase for attributes, self-closing tags required, and you can embed JavaScript expressions using curly braces {}.',
    category: 'React'
  },
  {
    id: 'faq-state-vs-props',
    question: 'When should I use state vs props?',
    answer: 'Use props to pass data from parent to child (read-only). Use state for data that changes over time within a component. Props flow down, state lives within a component.',
    category: 'React'
  },
  {
    id: 'faq-hooks-why',
    question: 'Why were React Hooks introduced?',
    answer: 'Hooks were introduced to let you use state and other React features without writing classes. They make it easier to reuse stateful logic, organize code by concern, and avoid complex patterns like higher-order components.',
    category: 'React'
  },
  {
    id: 'faq-useeffect-when',
    question: 'When should I use useEffect?',
    answer: 'Use useEffect for side effects like fetching data, subscriptions, timers, manually changing the DOM, or logging. It runs after render and can optionally clean up before the next effect or unmount.',
    category: 'React'
  },
  {
    id: 'faq-typescript-benefits',
    question: 'What are the benefits of using TypeScript?',
    answer: 'TypeScript provides: early error detection through type checking, better IDE support with autocomplete, improved code documentation, easier refactoring, and better collaboration in team projects.',
    category: 'TypeScript'
  },
  {
    id: 'faq-async-programming',
    question: 'How do I handle asynchronous operations in JavaScript?',
    answer: 'Use Promises with .then()/.catch() or async/await syntax. Async/await is preferred for cleaner code: mark functions as async and use await to wait for Promises to resolve.',
    category: 'JavaScript'
  },
  {
    id: 'faq-fetch-data-react',
    question: 'How do I fetch data in React?',
    answer: 'Use useEffect to fetch data when component mounts. Use fetch() or axios with async/await, store data in state with useState, and handle loading/error states. Example: useEffect(() => { fetchData(); }, []);',
    category: 'React'
  },
  {
    id: 'faq-component-rerender',
    question: 'What causes a React component to re-render?',
    answer: 'Components re-render when: state changes (via setState/useState), props change, parent component re-renders, or context value changes. React optimizes re-renders but you can further optimize with React.memo or useMemo.',
    category: 'React'
  },
  {
    id: 'faq-key-prop',
    question: 'Why do I need a key prop when rendering lists?',
    answer: 'Keys help React identify which items changed, were added, or removed. Use unique, stable identifiers (like IDs) as keys, not array indexes, to ensure correct component behavior during re-renders.',
    category: 'React'
  }
];

// Simple knowledge base object
export const knowledgeBase = {
  concepts,
  faqs
};
