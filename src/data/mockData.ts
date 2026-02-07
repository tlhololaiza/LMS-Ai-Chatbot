import { User, Course, Task, Announcement } from '@/types/lms';

export const currentUser: User = {
  id: '1',
  name: 'Tlholo Tshwane',
  email: 'tlholo.tshwane@gmail.com',
  role: 'learner',
  avatar: undefined,
  enrolledCourses: ['1', '2', '3', '4', '5'],
};

// Lesson Content
const lessonContent = {
  // React Course - Describing the UI
  'react-l1': `## Your First Component

Components are one of the core concepts of React. They are the foundation upon which you build user interfaces (UI), which makes them the perfect place to start your React journey!

### What is a Component?

A React component is a JavaScript function that returns markup. Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

> React components are regular JavaScript functions, but their names must start with a capital letter or they won't work!

### Defining a Component

Here's how you define a simple React component:

\`\`\`jsx
function Profile() {
  return (
    <img
      src="https://example.com/avatar.jpg"
      alt="User Profile"
    />
  );
}
\`\`\`

### Key Concepts

- **Components are functions** - A React component is a JavaScript function that returns JSX markup
- **Capital letter naming** - Component names must start with a capital letter (e.g., \`Profile\`, not \`profile\`)
- **Return JSX** - Components return JSX, which looks like HTML but is actually JavaScript
- **Reusability** - Once defined, you can use a component anywhere in your app

### Nesting Components

You can nest components inside other components:

\`\`\`jsx
function Gallery() {
  return (
    <section>
      <h1>Amazing Scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
\`\`\`

### Best Practices

1. Keep components focused on a single responsibility
2. Use descriptive names that explain what the component does
3. Start simple and break down into smaller components as needed
4. Never define a component inside another component`,

  'react-l2': `## Importing and Exporting Components

As your application grows, you'll want to split your components across different files. This keeps your codebase organized and makes components easier to reuse.

### The Root Component

In most React apps, there's a root component file (often called \`App.js\` or \`App.tsx\`) that contains your top-level component.

### Default vs Named Exports

JavaScript has two ways to export values: **default exports** and **named exports**.

#### Default Export

\`\`\`jsx
// Button.jsx
export default function Button() {
  return <button>Click me</button>;
}

// App.jsx
import Button from './Button';
\`\`\`

#### Named Export

\`\`\`jsx
// Button.jsx
export function Button() {
  return <button>Click me</button>;
}

// App.jsx
import { Button } from './Button';
\`\`\`

### Key Differences

| Syntax | Export Statement | Import Statement |
|--------|-----------------|------------------|
| Default | \`export default function Button() {}\` | \`import Button from './Button'\` |
| Named | \`export function Button() {}\` | \`import { Button } from './Button'\` |

### Best Practices

- Use **default exports** for the main component of a file
- Use **named exports** when a file exports multiple components
- Be consistent within your project
- A file can have only one default export, but multiple named exports

### Organizing Your Components

\`\`\`
src/
  components/
    Button.jsx
    Card.jsx
    Header/
      Header.jsx
      Logo.jsx
      Navigation.jsx
\`\`\``,

  'react-l3': `## Writing Markup with JSX

JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. It's the most popular way to write React components.

### Why JSX?

- Keeps rendering logic and markup together in the same place (components)
- Makes it easier to visualize the UI structure
- Provides helpful error messages during development

### The Rules of JSX

#### 1. Return a Single Root Element

Every JSX expression must have exactly one root element:

\`\`\`jsx
// ✅ Correct - wrapped in a div
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}

// ✅ Also correct - using Fragment
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
\`\`\`

#### 2. Close All Tags

JSX requires all tags to be explicitly closed:

\`\`\`jsx
// ✅ Correct
<img src="photo.jpg" alt="Photo" />
<br />

// ❌ Wrong
<img src="photo.jpg">
\`\`\`

#### 3. Use camelCase for Attributes

Most HTML attributes become camelCase in JSX:

\`\`\`jsx
// HTML: class, onclick, tabindex
// JSX: className, onClick, tabIndex

<div className="container" onClick={handleClick}>
  Content
</div>
\`\`\`

### Common JSX Attributes

- \`className\` instead of \`class\`
- \`htmlFor\` instead of \`for\`
- \`onClick\`, \`onChange\`, \`onSubmit\` for events
- \`style\` takes an object, not a string`,

  'react-l4': `## JavaScript in JSX with Curly Braces

JSX lets you write HTML-like markup inside JavaScript. Sometimes you'll want to add JavaScript logic or reference dynamic properties inside that markup. You can do this using curly braces.

### Using Curly Braces

Curly braces \`{}\` let you "escape back" into JavaScript from JSX:

\`\`\`jsx
function Avatar() {
  const name = "Sarah";
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

### Where to Use Curly Braces

You can use curly braces in two places inside JSX:

#### 1. As Text Inside a Tag

\`\`\`jsx
<h1>{user.name}</h1>
\`\`\`

#### 2. As Attributes

\`\`\`jsx
<img src={user.imageUrl} alt={user.name} />
\`\`\`

### What You Can Put Inside Curly Braces

- Variables: \`{name}\`
- Expressions: \`{1 + 2}\`
- Function calls: \`{formatDate(date)}\`
- Object properties: \`{user.name}\`
- Ternary expressions: \`{isLoggedIn ? 'Welcome' : 'Please log in'}\`

### Double Curlies for Objects

When passing an object (like inline styles), you need double curly braces:

\`\`\`jsx
<div style={{ backgroundColor: 'blue', padding: '10px' }}>
  Styled content
</div>
\`\`\`

The outer curlies say "this is JavaScript", and the inner curlies define the object.

### Example: Dynamic List

\`\`\`jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\``,

  'react-l5': `## Passing Props to a Component

React components use props to communicate with each other. Every parent component can pass some information to its child components by giving them props.

### What Are Props?

Props are the information you pass to a JSX tag. They're like function arguments for your components.

### Passing Props

You pass props to a component just like HTML attributes:

\`\`\`jsx
function App() {
  return (
    <Profile
      name="Sarah"
      imageUrl="https://example.com/sarah.jpg"
      age={25}
    />
  );
}
\`\`\`

### Reading Props

Inside the component, read props from the function parameter:

\`\`\`jsx
function Profile({ name, imageUrl, age }) {
  return (
    <div>
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}
\`\`\`

### Default Values

You can give props default values:

\`\`\`jsx
function Button({ text = "Click me", color = "blue" }) {
  return (
    <button style={{ backgroundColor: color }}>
      {text}
    </button>
  );
}
\`\`\`

### Spreading Props

If you have many props, you can spread them:

\`\`\`jsx
function Profile(props) {
  return <Avatar {...props} />;
}
\`\`\`

### Children Prop

Content between opening and closing tags becomes the \`children\` prop:

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>
\`\`\`

### Key Points

- Props are read-only - never modify props directly
- Props let you think about parent and child components independently
- Props can be any JavaScript value`,

  'react-l6': `## Conditional Rendering

Your components will often need to display different things depending on different conditions. In React, you can conditionally render JSX using JavaScript syntax like \`if\` statements, \`&&\`, and \`? :\` operators.

### Using if Statements

\`\`\`jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}
\`\`\`

### Conditional (Ternary) Operator

The ternary operator is great for inline conditions:

\`\`\`jsx
function Greeting({ isLoggedIn }) {
  return (
    <h1>
      {isLoggedIn ? 'Welcome back!' : 'Please sign in.'}
    </h1>
  );
}
\`\`\`

### Logical AND Operator (&&)

Use \`&&\` when you want to render something or nothing:

\`\`\`jsx
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <p>You have {unreadMessages.length} unread messages.</p>
      )}
    </div>
  );
}
\`\`\`

> Warning: Don't put numbers on the left side of \`&&\`. Use \`count > 0 &&\` instead of \`count &&\`.

### Conditionally Returning null

Sometimes you don't want to render anything. Return \`null\`:

\`\`\`jsx
function WarningBanner({ warning }) {
  if (!warning) {
    return null;
  }
  return <div className="warning">{warning}</div>;
}
\`\`\`

### Storing JSX in Variables

You can assign JSX to variables for complex conditions:

\`\`\`jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return <li>{itemContent}</li>;
}
\`\`\``,

  'react-l7': `## Rendering Lists

You will often want to display multiple similar components from a collection of data. You can use JavaScript's array methods to manipulate an array of data.

### Rendering Data from Arrays

Use \`map()\` to transform an array of data into an array of components:

\`\`\`jsx
const people = [
  { id: 1, name: 'Sarah' },
  { id: 2, name: 'Thabo' },
  { id: 3, name: 'Lerato' }
];

function PeopleList() {
  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>{person.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### The Key Prop

Each item in a list needs a unique \`key\` prop:

- Keys tell React which item is which
- Use database IDs, not array indexes
- Keys must be unique among siblings

\`\`\`jsx
// ✅ Good - using unique ID
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ Avoid - using index as key
{items.map((item, index) => <Item key={index} {...item} />)}
\`\`\`

### Filtering Arrays

Use \`filter()\` to filter items before mapping:

\`\`\`jsx
const scientists = [
  { id: 1, name: 'Marie Curie', profession: 'physicist' },
  { id: 2, name: 'Albert Einstein', profession: 'physicist' },
  { id: 3, name: 'Charles Darwin', profession: 'biologist' }
];

function PhysicistsList() {
  const physicists = scientists.filter(
    person => person.profession === 'physicist'
  );
  
  return (
    <ul>
      {physicists.map(person => (
        <li key={person.id}>{person.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Rules for Keys

1. Keys must be unique among siblings
2. Keys must not change - don't generate them while rendering
3. Don't use array indexes as keys if the list can be reordered`,

  // React - Adding Interactivity
  'react-l10': `## Responding to Events

React lets you add event handlers to your JSX. Event handlers are your own functions that will be triggered in response to interactions like clicking, hovering, focusing, and more.

### Adding Event Handlers

Define a function inside your component and pass it as a prop:

\`\`\`jsx
function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
\`\`\`

### Event Handler Conventions

- Usually defined inside your component
- Names start with \`handle\` followed by the event name
- Example: \`handleClick\`, \`handleMouseEnter\`

### Inline Event Handlers

For short handlers, you can define them inline:

\`\`\`jsx
<button onClick={() => alert('Clicked!')}>
  Click me
</button>
\`\`\`

### Passing Event Handlers as Props

Parent components can pass event handlers to children:

\`\`\`jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  return (
    <Button onClick={() => alert('Playing!')}>
      Play Movie
    </Button>
  );
}
\`\`\`

### Event Propagation

Events propagate up the component tree. Use \`e.stopPropagation()\` to stop it:

\`\`\`jsx
function Button({ onClick }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      Click me
    </button>
  );
}
\`\`\`

### Preventing Default Behavior

Some events have default browser behavior. Use \`e.preventDefault()\`:

\`\`\`jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    alert('Form submitted!');
  }
  
  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\``,

  'react-l11': `## State: A Component's Memory

Components often need to change what's on the screen as a result of an interaction. State is a component's memory that persists between renders.

### Why Regular Variables Don't Work

\`\`\`jsx
// ❌ This won't work!
function Counter() {
  let count = 0;
  
  function handleClick() {
    count = count + 1; // This changes, but UI doesn't update
  }
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
\`\`\`

### The useState Hook

Use the \`useState\` Hook to add state to your component:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    setCount(count + 1);
  }
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
\`\`\`

### How useState Works

1. \`useState(0)\` - The argument is the initial value
2. Returns an array with exactly two items:
   - The current state value (\`count\`)
   - A function to update it (\`setCount\`)

### State is Isolated and Private

- State is local to a component instance
- If you render the same component twice, each has its own state
- Parent components can't see or change child state

### Multiple State Variables

You can have multiple state variables in one component:

\`\`\`jsx
function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isValid, setIsValid] = useState(false);
  
  // ...
}
\`\`\`

### Rules of Hooks

1. Only call Hooks at the top level of your component
2. Only call Hooks from React function components
3. Don't call Hooks inside loops, conditions, or nested functions`,

  // TypeScript Course
  'ts-l1': `## TypeScript for JavaScript Programmers

TypeScript stands in an unusual relationship to JavaScript. TypeScript offers all of JavaScript's features, and an additional layer on top: TypeScript's type system.

### What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing and class-based object-oriented programming.

### Key Benefits

- **Catch errors early** - Find bugs at compile time, not runtime
- **Better IDE support** - Autocompletion, navigation, and refactoring
- **Self-documenting code** - Types serve as documentation
- **Safer refactoring** - The compiler catches breaking changes

### Types by Inference

TypeScript knows JavaScript and will generate types automatically:

\`\`\`typescript
// TypeScript infers this is a string
let message = "Hello, World!";

// TypeScript infers this is a number
let count = 42;
\`\`\`

### Defining Types

You can explicitly define types:

\`\`\`typescript
// Explicit type annotation
let name: string = "Sarah";
let age: number = 25;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Sarah", "Thabo"];

// Objects
let user: { name: string; age: number } = {
  name: "Sarah",
  age: 25
};
\`\`\`

### Interfaces

Interfaces define the shape of objects:

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}

const user: User = {
  name: "Sarah",
  age: 25
};
\`\`\`

### Why Adopt TypeScript?

1. Reduces bugs in production
2. Makes large codebases manageable
3. Improves team collaboration
4. Great tooling and editor support`,

  'ts-l4': `## Static Type Checking

TypeScript performs static type analysis to catch potential errors before your code runs.

### What is Static Type Checking?

Static type checking means analyzing your code without running it. TypeScript checks types at compile time.

\`\`\`typescript
// TypeScript catches this error at compile time
const message = "hello";
message(); // Error: This expression is not callable.
\`\`\`

### Type Errors vs Runtime Errors

| Type Error (Compile Time) | Runtime Error |
|--------------------------|---------------|
| Caught before deployment | Crashes in production |
| Fast feedback in IDE | Only found during testing |
| Easy to fix | May be hard to reproduce |

### Examples of Static Type Checking

#### Typos in Property Names

\`\`\`typescript
interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "Sarah",
  emial: "sarah@example.com" // Error: 'emial' does not exist
};
\`\`\`

#### Calling Functions Incorrectly

\`\`\`typescript
function greet(name: string) {
  console.log("Hello, " + name);
}

greet(); // Error: Expected 1 argument, but got 0.
greet(42); // Error: Argument of type 'number' is not assignable.
\`\`\`

#### Logic Errors

\`\`\`typescript
const value = Math.random() < 0.5 ? "hello" : 100;

if (value !== "hello") {
  value.toUpperCase(); // Error: 'toUpperCase' doesn't exist on number
}
\`\`\`

### The TypeScript Compiler

The \`tsc\` command compiles TypeScript to JavaScript:

\`\`\`bash
# Compile a single file
tsc index.ts

# Watch mode - recompile on changes
tsc --watch
\`\`\``,

  'ts-l5': `## Everyday Types

TypeScript has many types, but you'll use a few core types in most situations.

### Primitive Types

The most common primitive types:

\`\`\`typescript
// String
let name: string = "Sarah";

// Number (integers and floats)
let age: number = 25;
let price: number = 19.99;

// Boolean
let isActive: boolean = true;
\`\`\`

### Arrays

Two ways to define array types:

\`\`\`typescript
// Using brackets
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Sarah", "Thabo"];

// Using generic syntax
let ids: Array<number> = [1, 2, 3];
\`\`\`

### Any

Use \`any\` when you don't want type checking (use sparingly!):

\`\`\`typescript
let value: any = 42;
value = "now I'm a string";
value = true;
\`\`\`

### Functions

Type annotations for function parameters and return values:

\`\`\`typescript
// Parameter and return type annotations
function greet(name: string): string {
  return "Hello, " + name;
}

// Arrow function
const add = (a: number, b: number): number => a + b;

// Function with optional parameter
function log(message: string, userId?: string) {
  console.log(message, userId);
}
\`\`\`

### Object Types

\`\`\`typescript
// Inline object type
function printCoord(pt: { x: number; y: number }) {
  console.log("x:", pt.x);
  console.log("y:", pt.y);
}

// Optional properties
function printName(obj: { first: string; last?: string }) {
  console.log(obj.first + " " + (obj.last ?? ""));
}
\`\`\`

### Union Types

A value that can be one of several types:

\`\`\`typescript
function printId(id: number | string) {
  console.log("Your ID is:", id);
}

printId(101);     // OK
printId("202");   // OK
\`\`\``,

  // Node.js Course
  'node-l1': `## Introduction to Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side.

### What is Node.js?

- **JavaScript runtime** - Executes JavaScript outside the browser
- **Built on V8** - Uses Chrome's fast JavaScript engine
- **Event-driven** - Non-blocking I/O model
- **Single-threaded** - But handles many connections efficiently

### Why Use Node.js?

1. **JavaScript everywhere** - Same language for frontend and backend
2. **Fast and scalable** - Non-blocking, event-driven architecture
3. **Large ecosystem** - npm has over 1 million packages
4. **Great for APIs** - Perfect for REST APIs and real-time apps

### Your First Node.js Script

Create a file called \`hello.js\`:

\`\`\`javascript
console.log("Hello from Node.js!");

// Node.js provides global objects
console.log("Current directory:", __dirname);
console.log("Current file:", __filename);
\`\`\`

Run it with:

\`\`\`bash
node hello.js
\`\`\`

### Node.js vs Browser JavaScript

| Feature | Browser | Node.js |
|---------|---------|---------|
| DOM | Yes | No |
| Window object | Yes | No |
| File system | No | Yes |
| HTTP server | No | Yes |
| process object | No | Yes |

### Core Modules

Node.js comes with built-in modules:

\`\`\`javascript
const fs = require('fs');      // File system
const http = require('http');  // HTTP server
const path = require('path');  // Path utilities
const os = require('os');      // Operating system info
\`\`\`

### The Node.js REPL

Start an interactive session:

\`\`\`bash
node
> 2 + 2
4
> "Hello".toUpperCase()
'HELLO'
\`\`\``,

  'node-l4': `## Node.js Modules

Modules are the building blocks of Node.js applications. They help you organize code into reusable pieces.

### CommonJS Modules

Node.js uses CommonJS by default:

\`\`\`javascript
// math.js - Exporting
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// app.js - Importing
const { add, subtract } = require('./math');
console.log(add(5, 3)); // 8
\`\`\`

### ES Modules

Modern Node.js also supports ES modules:

\`\`\`javascript
// math.mjs - Exporting
export function add(a, b) {
  return a + b;
}

export default function multiply(a, b) {
  return a * b;
}

// app.mjs - Importing
import multiply, { add } from './math.mjs';
\`\`\`

### Types of Modules

1. **Core modules** - Built into Node.js (\`fs\`, \`http\`, \`path\`)
2. **Local modules** - Your own files (\`./myModule\`)
3. **Third-party modules** - From npm (\`express\`, \`lodash\`)

### The require Function

\`\`\`javascript
// Core module - no path needed
const fs = require('fs');

// Local module - use relative path
const myModule = require('./myModule');

// npm module - just the name
const express = require('express');
\`\`\`

### module.exports vs exports

\`\`\`javascript
// These are equivalent for objects
module.exports = { add, subtract };
exports.add = add;
exports.subtract = subtract;

// For a single value, use module.exports
module.exports = function() { ... };
\`\`\`

### Creating a Simple Module

\`\`\`javascript
// logger.js
const colors = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(level, message) {
  console.log(colors[level] + message + colors.reset);
}

module.exports = {
  info: (msg) => log('info', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg)
};
\`\`\``,

  'node-l5': `## An Introduction to npm

npm (Node Package Manager) is the world's largest software registry. It's used to discover, install, and publish packages.

### What is npm?

- **Package manager** - Install and manage dependencies
- **Registry** - Over 1 million packages available
- **CLI tool** - Comes with Node.js installation

### Initializing a Project

Create a new project with \`package.json\`:

\`\`\`bash
# Interactive setup
npm init

# Quick setup with defaults
npm init -y
\`\`\`

### The package.json File

\`\`\`json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
\`\`\`

### Installing Packages

\`\`\`bash
# Install a package (adds to dependencies)
npm install express

# Install as dev dependency
npm install --save-dev nodemon

# Install globally
npm install -g typescript

# Install all dependencies from package.json
npm install
\`\`\`

### Version Syntax

- \`^4.18.2\` - Compatible with 4.x.x (minor updates)
- \`~4.18.2\` - Patch updates only (4.18.x)
- \`4.18.2\` - Exact version
- \`*\` or \`latest\` - Latest version

### Useful npm Commands

\`\`\`bash
# List installed packages
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update

# Remove a package
npm uninstall express

# Run a script
npm run dev
npm start  # shorthand for npm run start
\`\`\``,

  // React Native Course
  'rn-l1': `## Introduction to React Native

React Native is a framework for building native mobile apps using JavaScript and React. Write once, run on iOS and Android.

### What is React Native?

- **Cross-platform** - One codebase for iOS and Android
- **Native performance** - Renders native components
- **React-based** - Uses the same design as React
- **Hot reloading** - See changes instantly

### React Native vs React

| React (Web) | React Native (Mobile) |
|-------------|----------------------|
| \`<div>\` | \`<View>\` |
| \`<p>\` | \`<Text>\` |
| \`<img>\` | \`<Image>\` |
| \`<input>\` | \`<TextInput>\` |
| CSS | StyleSheet |

### Hello World in React Native

\`\`\`jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
\`\`\`

### Core Concepts

1. **Components** - Building blocks of the UI
2. **Props** - Data passed to components
3. **State** - Internal component data
4. **Styles** - Flexbox-based styling

### Development Tools

- **Expo** - Easier setup, managed workflow
- **React Native CLI** - Full native code access
- **Metro** - JavaScript bundler
- **Flipper** - Debugging tool

### Why Choose React Native?

1. Code reuse between platforms
2. Large community and ecosystem
3. Fast development with hot reloading
4. Access to native APIs when needed`,

  'rn-l4': `## Core Components and Native Components

React Native provides a set of essential, ready-to-use components for building your app's interface.

### Views and Containers

The \`View\` component is the fundamental building block:

\`\`\`jsx
import { View, Text, StyleSheet } from 'react-native';

function Card() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Card Title</Text>
      <Text>Card content goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
\`\`\`

### Text Component

All text must be wrapped in \`Text\`:

\`\`\`jsx
<Text style={{ fontSize: 16 }}>
  Regular text
  <Text style={{ fontWeight: 'bold' }}> Bold text</Text>
</Text>
\`\`\`

### Image Component

Display images from various sources:

\`\`\`jsx
import { Image } from 'react-native';

// Local image
<Image source={require('./assets/logo.png')} />

// Network image (must specify dimensions)
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>
\`\`\`

### ScrollView

For scrollable content:

\`\`\`jsx
import { ScrollView, Text } from 'react-native';

<ScrollView>
  <Text>Lots of content here...</Text>
</ScrollView>
\`\`\`

### FlatList for Long Lists

Efficient list rendering:

\`\`\`jsx
import { FlatList, Text, View } from 'react-native';

const DATA = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
];

<FlatList
  data={DATA}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  keyExtractor={item => item.id}
/>
\`\`\`

### Touchables and Pressable

Handle touch interactions:

\`\`\`jsx
import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('Pressed!')}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.pressed
  ]}
>
  <Text>Press Me</Text>
</Pressable>
\`\`\``,

  // MongoDB Course
  'mongo-l1': `## What is MongoDB?

MongoDB is a document database designed for ease of development and scaling. It stores data in flexible, JSON-like documents.

### Document Database

Unlike traditional relational databases, MongoDB stores data in documents:

\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Sarah Molefe",
  "email": "sarah@example.com",
  "age": 25,
  "courses": ["React", "Node.js", "MongoDB"],
  "address": {
    "city": "Johannesburg",
    "country": "South Africa"
  }
}
\`\`\`

### Key Concepts

| Term | Description |
|------|-------------|
| **Database** | Container for collections |
| **Collection** | Group of documents (like a table) |
| **Document** | A single record (JSON object) |
| **Field** | A key-value pair in a document |

### Why MongoDB?

1. **Flexible schema** - Documents can have different fields
2. **Scalability** - Horizontal scaling with sharding
3. **Developer-friendly** - Works with JSON natively
4. **Rich queries** - Powerful query language

### MongoDB vs SQL

| SQL | MongoDB |
|-----|---------|
| Table | Collection |
| Row | Document |
| Column | Field |
| JOIN | Embedded documents / $lookup |
| Primary key | _id field |

### Basic Commands

\`\`\`javascript
// Show all databases
show dbs

// Switch to a database
use myDatabase

// Show all collections
show collections

// Insert a document
db.users.insertOne({
  name: "Sarah",
  email: "sarah@example.com"
})

// Find documents
db.users.find({ name: "Sarah" })
\`\`\`

### The _id Field

Every document has a unique \`_id\` field:
- Automatically generated if not provided
- Type: ObjectId (12-byte identifier)
- Indexed by default`,

  'mongo-l4': `## Creating Documents

Learn how to insert documents into MongoDB collections.

### insertOne()

Insert a single document:

\`\`\`javascript
db.users.insertOne({
  name: "Sarah Molefe",
  email: "sarah@example.com",
  age: 25,
  createdAt: new Date()
})
\`\`\`

Response:

\`\`\`json
{
  "acknowledged": true,
  "insertedId": ObjectId("507f1f77bcf86cd799439011")
}
\`\`\`

### insertMany()

Insert multiple documents at once:

\`\`\`javascript
db.users.insertMany([
  {
    name: "Thabo Ndlovu",
    email: "thabo@example.com",
    age: 28
  },
  {
    name: "Lerato Khumalo",
    email: "lerato@example.com",
    age: 24
  }
])
\`\`\`

### Document Structure

Documents can contain:

\`\`\`javascript
db.products.insertOne({
  // Strings
  name: "Laptop",
  
  // Numbers
  price: 15999.99,
  quantity: 50,
  
  // Booleans
  inStock: true,
  
  // Arrays
  tags: ["electronics", "computers"],
  
  // Embedded documents
  specifications: {
    cpu: "Intel i7",
    ram: "16GB",
    storage: "512GB SSD"
  },
  
  // Dates
  createdAt: new Date(),
  
  // Null
  discount: null
})
\`\`\`

### Ordered vs Unordered Inserts

\`\`\`javascript
// Ordered (default) - stops on first error
db.users.insertMany(docs, { ordered: true })

// Unordered - continues after errors
db.users.insertMany(docs, { ordered: false })
\`\`\`

### Write Concern

Control write acknowledgment:

\`\`\`javascript
db.users.insertOne(
  { name: "Sarah" },
  { writeConcern: { w: "majority" } }
)
\`\`\`

### Best Practices

1. Design documents based on how you'll query them
2. Keep related data together in embedded documents
3. Use appropriate field names (camelCase is common)
4. Consider document size limits (16MB max)`,

  'mongo-l5': `## Reading Documents

Learn how to query and retrieve documents from MongoDB collections.

### find() - Basic Queries

\`\`\`javascript
// Find all documents
db.users.find()

// Find with filter
db.users.find({ name: "Sarah" })

// Find one document
db.users.findOne({ email: "sarah@example.com" })
\`\`\`

### Comparison Operators

\`\`\`javascript
// Equal to
db.users.find({ age: 25 })

// Greater than
db.users.find({ age: { $gt: 25 } })

// Less than
db.users.find({ age: { $lt: 30 } })

// Greater than or equal
db.users.find({ age: { $gte: 25 } })

// Not equal
db.users.find({ status: { $ne: "inactive" } })

// In array of values
db.users.find({ role: { $in: ["admin", "moderator"] } })
\`\`\`

### Logical Operators

\`\`\`javascript
// AND (implicit)
db.users.find({ age: 25, status: "active" })

// AND (explicit)
db.users.find({
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } }
  ]
})

// OR
db.users.find({
  $or: [
    { role: "admin" },
    { role: "moderator" }
  ]
})
\`\`\`

### Projection

Select specific fields to return:

\`\`\`javascript
// Include only name and email
db.users.find({}, { name: 1, email: 1 })

// Exclude password field
db.users.find({}, { password: 0 })
\`\`\`

### Sorting, Limiting, Skipping

\`\`\`javascript
// Sort by age (1 = ascending, -1 = descending)
db.users.find().sort({ age: -1 })

// Limit results
db.users.find().limit(10)

// Skip for pagination
db.users.find().skip(20).limit(10)

// Combine all
db.users.find()
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(10)
\`\`\`

### Querying Arrays

\`\`\`javascript
// Contains a value
db.users.find({ courses: "React" })

// Contains all values
db.users.find({ courses: { $all: ["React", "Node.js"] } })

// Array size
db.users.find({ courses: { $size: 3 } })
\`\`\``,
};

export const courses: Course[] = [
  {
    id: '1',
    title: 'React',
    description: 'Learn React - A JavaScript library for building user interfaces.',
    progress: 45,
    instructor: 'Dr. Thabo Ndlovu',
    duration: '8 weeks',
    enrolledCount: 120,
    modules: [
      {
        id: 'react-m1',
        title: 'Describing the UI',
        description: 'React is a JavaScript library for rendering user interfaces (UI). UI is built from small units like buttons, text, and images. React lets you combine them into reusable, nestable components.',
        isCompleted: true,
        isLocked: false,
        order: 1,
        lessons: [
          { id: 'react-l1', title: 'Your First Component', type: 'reading', duration: '15 min', isCompleted: true, content: lessonContent['react-l1'] },
          { id: 'react-l2', title: 'Importing and Exporting Components', type: 'reading', duration: '12 min', isCompleted: true, content: lessonContent['react-l2'] },
          { id: 'react-l3', title: 'Writing Markup with JSX', type: 'video', duration: '18 min', isCompleted: true, content: lessonContent['react-l3'] },
          { id: 'react-l4', title: 'JavaScript in JSX with Curly Braces', type: 'reading', duration: '15 min', isCompleted: true, content: lessonContent['react-l4'] },
          { id: 'react-l5', title: 'Passing Props to a Component', type: 'video', duration: '20 min', isCompleted: false, content: lessonContent['react-l5'] },
          { id: 'react-l6', title: 'Conditional Rendering', type: 'reading', duration: '14 min', isCompleted: false, content: lessonContent['react-l6'] },
          { id: 'react-l7', title: 'Rendering Lists', type: 'video', duration: '16 min', isCompleted: false, content: lessonContent['react-l7'] },
          { id: 'react-l8', title: 'Keeping Components Pure', type: 'reading', duration: '12 min', isCompleted: false },
          { id: 'react-l9', title: 'Your UI as a Tree', type: 'reading', duration: '10 min', isCompleted: false },
        ],
      },
      {
        id: 'react-m2',
        title: 'Adding Interactivity',
        description: 'Some things on the screen update in response to user input. React lets you add interactivity by responding to events and updating state.',
        isCompleted: false,
        isLocked: false,
        order: 2,
        lessons: [
          { id: 'react-l10', title: 'Responding to Events', type: 'video', duration: '18 min', isCompleted: false, content: lessonContent['react-l10'] },
          { id: 'react-l11', title: 'State: A Component\'s Memory', type: 'reading', duration: '20 min', isCompleted: false, content: lessonContent['react-l11'] },
          { id: 'react-l12', title: 'Render and Commit', type: 'reading', duration: '12 min', isCompleted: false },
          { id: 'react-l13', title: 'State as a Snapshot', type: 'video', duration: '15 min', isCompleted: false },
          { id: 'react-l14', title: 'Queueing a Series of State Updates', type: 'reading', duration: '14 min', isCompleted: false },
          { id: 'react-l15', title: 'Updating Objects in State', type: 'video', duration: '18 min', isCompleted: false },
          { id: 'react-l16', title: 'Updating Arrays in State', type: 'reading', duration: '16 min', isCompleted: false },
        ],
      },
      {
        id: 'react-m3',
        title: 'Managing State',
        description: 'As your application grows, it helps to be more intentional about how your state is organized and how the data flows between your components.',
        isCompleted: false,
        isLocked: true,
        order: 3,
        lessons: [
          { id: 'react-l17', title: 'Reacting to Input with State', type: 'reading', duration: '15 min', isCompleted: false },
          { id: 'react-l18', title: 'Choosing the State Structure', type: 'video', duration: '20 min', isCompleted: false },
          { id: 'react-l19', title: 'Sharing State Between Components', type: 'reading', duration: '18 min', isCompleted: false },
          { id: 'react-l20', title: 'Preserving and Resetting State', type: 'video', duration: '16 min', isCompleted: false },
          { id: 'react-l21', title: 'Extracting State Logic into a Reducer', type: 'reading', duration: '22 min', isCompleted: false },
          { id: 'react-l22', title: 'Passing Data Deeply with Context', type: 'video', duration: '20 min', isCompleted: false },
          { id: 'react-l23', title: 'Scaling Up with Reducer and Context', type: 'task', duration: '45 min', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'TypeScript',
    description: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    progress: 30,
    instructor: 'Prof. Lerato Khumalo',
    duration: '6 weeks',
    enrolledCount: 95,
    modules: [
      {
        id: 'ts-m1',
        title: 'Getting Started',
        description: 'Introduction to TypeScript and setting up your development environment.',
        isCompleted: true,
        isLocked: false,
        order: 1,
        lessons: [
          { id: 'ts-l1', title: 'TypeScript for JavaScript Programmers', type: 'reading', duration: '15 min', isCompleted: true, content: lessonContent['ts-l1'] },
          { id: 'ts-l2', title: 'TypeScript Tooling in 5 minutes', type: 'video', duration: '8 min', isCompleted: true },
          { id: 'ts-l3', title: 'Installing TypeScript', type: 'reading', duration: '10 min', isCompleted: true },
        ],
      },
      {
        id: 'ts-m2',
        title: 'The Basics',
        description: 'Learn the fundamental types and type annotations in TypeScript.',
        isCompleted: false,
        isLocked: false,
        order: 2,
        lessons: [
          { id: 'ts-l4', title: 'Static Type Checking', type: 'reading', duration: '12 min', isCompleted: true, content: lessonContent['ts-l4'] },
          { id: 'ts-l5', title: 'Everyday Types', type: 'video', duration: '25 min', isCompleted: false, content: lessonContent['ts-l5'] },
          { id: 'ts-l6', title: 'Narrowing', type: 'reading', duration: '18 min', isCompleted: false },
          { id: 'ts-l7', title: 'More on Functions', type: 'video', duration: '20 min', isCompleted: false },
        ],
      },
      {
        id: 'ts-m3',
        title: 'Object Types',
        description: 'Understanding object types, interfaces, and type aliases in TypeScript.',
        isCompleted: false,
        isLocked: true,
        order: 3,
        lessons: [
          { id: 'ts-l8', title: 'Object Types', type: 'reading', duration: '15 min', isCompleted: false },
          { id: 'ts-l9', title: 'Type vs Interface', type: 'video', duration: '18 min', isCompleted: false },
          { id: 'ts-l10', title: 'Generics', type: 'reading', duration: '22 min', isCompleted: false },
          { id: 'ts-l11', title: 'Build a Type-Safe Application', type: 'task', duration: '60 min', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Node.js',
    description: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. Learn to build scalable server-side applications.',
    progress: 15,
    instructor: 'Mr. Sipho Dlamini',
    duration: '8 weeks',
    enrolledCount: 78,
    modules: [
      {
        id: 'node-m1',
        title: 'Introduction to Node.js',
        description: 'Learn the fundamentals of Node.js and how it differs from browser JavaScript.',
        isCompleted: true,
        isLocked: false,
        order: 1,
        lessons: [
          { id: 'node-l1', title: 'Introduction to Node.js', type: 'video', duration: '15 min', isCompleted: true, content: lessonContent['node-l1'] },
          { id: 'node-l2', title: 'How to Install Node.js', type: 'reading', duration: '10 min', isCompleted: true },
          { id: 'node-l3', title: 'How to Run Node.js Scripts', type: 'video', duration: '12 min', isCompleted: false },
        ],
      },
      {
        id: 'node-m2',
        title: 'Core Concepts',
        description: 'Understand core Node.js concepts like modules, npm, and asynchronous programming.',
        isCompleted: false,
        isLocked: false,
        order: 2,
        lessons: [
          { id: 'node-l4', title: 'Node.js Modules', type: 'reading', duration: '18 min', isCompleted: false, content: lessonContent['node-l4'] },
          { id: 'node-l5', title: 'An introduction to npm', type: 'video', duration: '15 min', isCompleted: false, content: lessonContent['node-l5'] },
          { id: 'node-l6', title: 'Asynchronous JavaScript', type: 'reading', duration: '20 min', isCompleted: false },
          { id: 'node-l7', title: 'The Event Loop', type: 'video', duration: '22 min', isCompleted: false },
        ],
      },
      {
        id: 'node-m3',
        title: 'Building APIs with Express',
        description: 'Learn to create RESTful APIs using Express.js framework.',
        isCompleted: false,
        isLocked: true,
        order: 3,
        lessons: [
          { id: 'node-l8', title: 'Introduction to Express.js', type: 'reading', duration: '15 min', isCompleted: false },
          { id: 'node-l9', title: 'Routing in Express', type: 'video', duration: '18 min', isCompleted: false },
          { id: 'node-l10', title: 'Middleware', type: 'reading', duration: '16 min', isCompleted: false },
          { id: 'node-l11', title: 'Build a REST API', type: 'task', duration: '90 min', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'React Native',
    description: 'Build native mobile apps for iOS and Android using React. Learn once, write anywhere.',
    progress: 10,
    instructor: 'Ms. Nomvula Zulu',
    duration: '10 weeks',
    enrolledCount: 65,
    modules: [
      {
        id: 'rn-m1',
        title: 'Getting Started',
        description: 'Set up your React Native development environment and create your first app.',
        isCompleted: true,
        isLocked: false,
        order: 1,
        lessons: [
          { id: 'rn-l1', title: 'Introduction to React Native', type: 'video', duration: '12 min', isCompleted: true, content: lessonContent['rn-l1'] },
          { id: 'rn-l2', title: 'Setting Up Development Environment', type: 'reading', duration: '20 min', isCompleted: false },
          { id: 'rn-l3', title: 'Create Your First App', type: 'video', duration: '18 min', isCompleted: false },
        ],
      },
      {
        id: 'rn-m2',
        title: 'Core Components',
        description: 'Learn about React Native core components and APIs.',
        isCompleted: false,
        isLocked: false,
        order: 2,
        lessons: [
          { id: 'rn-l4', title: 'Core Components and Native Components', type: 'reading', duration: '15 min', isCompleted: false, content: lessonContent['rn-l4'] },
          { id: 'rn-l5', title: 'Using Views and Text', type: 'video', duration: '14 min', isCompleted: false },
          { id: 'rn-l6', title: 'Style and Layout', type: 'reading', duration: '18 min', isCompleted: false },
          { id: 'rn-l7', title: 'Handling Touch Events', type: 'video', duration: '16 min', isCompleted: false },
        ],
      },
      {
        id: 'rn-m3',
        title: 'Navigation',
        description: 'Implement navigation in your React Native app using React Navigation.',
        isCompleted: false,
        isLocked: true,
        order: 3,
        lessons: [
          { id: 'rn-l8', title: 'React Navigation Fundamentals', type: 'reading', duration: '18 min', isCompleted: false },
          { id: 'rn-l9', title: 'Stack Navigation', type: 'video', duration: '20 min', isCompleted: false },
          { id: 'rn-l10', title: 'Tab Navigation', type: 'reading', duration: '15 min', isCompleted: false },
          { id: 'rn-l11', title: 'Build a Multi-Screen App', type: 'task', duration: '75 min', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'MongoDB',
    description: 'MongoDB is a document database designed for ease of development and scaling. Learn to build data-driven applications.',
    progress: 5,
    instructor: 'Dr. Kgomotso Mabaso',
    duration: '6 weeks',
    enrolledCount: 55,
    modules: [
      {
        id: 'mongo-m1',
        title: 'Introduction to MongoDB',
        description: 'Learn the basics of MongoDB and document databases.',
        isCompleted: false,
        isLocked: false,
        order: 1,
        lessons: [
          { id: 'mongo-l1', title: 'What is MongoDB?', type: 'video', duration: '12 min', isCompleted: true, content: lessonContent['mongo-l1'] },
          { id: 'mongo-l2', title: 'Installing MongoDB', type: 'reading', duration: '15 min', isCompleted: false },
          { id: 'mongo-l3', title: 'MongoDB vs SQL Databases', type: 'video', duration: '18 min', isCompleted: false },
        ],
      },
      {
        id: 'mongo-m2',
        title: 'CRUD Operations',
        description: 'Master Create, Read, Update, and Delete operations in MongoDB.',
        isCompleted: false,
        isLocked: false,
        order: 2,
        lessons: [
          { id: 'mongo-l4', title: 'Creating Documents', type: 'reading', duration: '14 min', isCompleted: false, content: lessonContent['mongo-l4'] },
          { id: 'mongo-l5', title: 'Reading Documents', type: 'video', duration: '16 min', isCompleted: false, content: lessonContent['mongo-l5'] },
          { id: 'mongo-l6', title: 'Updating Documents', type: 'reading', duration: '15 min', isCompleted: false },
          { id: 'mongo-l7', title: 'Deleting Documents', type: 'video', duration: '12 min', isCompleted: false },
        ],
      },
      {
        id: 'mongo-m3',
        title: 'MongoDB with Node.js',
        description: 'Connect MongoDB with Node.js applications using Mongoose.',
        isCompleted: false,
        isLocked: true,
        order: 3,
        lessons: [
          { id: 'mongo-l8', title: 'Introduction to Mongoose', type: 'reading', duration: '16 min', isCompleted: false },
          { id: 'mongo-l9', title: 'Schemas and Models', type: 'video', duration: '20 min', isCompleted: false },
          { id: 'mongo-l10', title: 'Connecting to MongoDB', type: 'reading', duration: '12 min', isCompleted: false },
          { id: 'mongo-l11', title: 'Build a Database-Driven App', type: 'task', duration: '90 min', isCompleted: false },
        ],
      },
    ],
  },
];

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'React State Management Project',
    description: 'Build a React application demonstrating state management with Reducer and Context as covered in the Managing State module.',
    dueDate: '2026-02-15',
    status: 'pending',
    moduleId: 'react-m3',
  },
  {
    id: 't2',
    title: 'TypeScript Type-Safe Application',
    description: 'Create a type-safe application using TypeScript interfaces, generics, and proper type annotations.',
    dueDate: '2026-02-10',
    status: 'submitted',
    submissionUrl: 'https://github.com/sarahmolefe/ts-project',
    moduleId: 'ts-m3',
  },
  {
    id: 't3',
    title: 'Node.js REST API',
    description: 'Build a RESTful API using Express.js with proper routing, middleware, and error handling.',
    dueDate: '2026-02-20',
    status: 'pending',
    moduleId: 'node-m3',
  },
  {
    id: 't4',
    title: 'React Native Multi-Screen App',
    description: 'Create a mobile app with multiple screens using React Navigation, including stack and tab navigation.',
    dueDate: '2026-01-25',
    status: 'graded',
    submissionUrl: 'https://github.com/sarahmolefe/rn-navigation',
    grade: 88,
    feedback: 'Excellent navigation implementation! Clean code structure and smooth transitions. Consider adding gesture navigation.',
    moduleId: 'rn-m3',
  },
  {
    id: 't5',
    title: 'MongoDB Database Application',
    description: 'Build a database-driven application using MongoDB and Mongoose with Node.js backend.',
    dueDate: '2026-02-28',
    status: 'pending',
    moduleId: 'mongo-m3',
  },
];

export const announcements: Announcement[] = [
  {
    id: 'a1',
    title: 'Upcoming Career Workshop',
    content: 'Join us this Friday for a career preparation workshop with industry professionals. Learn about interview techniques, CV writing, and networking strategies.',
    author: 'Program Coordinator',
    createdAt: '2026-01-20T10:00:00Z',
    priority: 'important',
    isRead: false,
  },
  {
    id: 'a2',
    title: 'React Course Module Update',
    content: 'The Managing State module in the React course has been updated with new content on Reducer and Context patterns. Check it out!',
    author: 'Dr. Thabo Ndlovu',
    createdAt: '2026-01-19T14:30:00Z',
    priority: 'normal',
    isRead: true,
  },
  {
    id: 'a3',
    title: 'System Maintenance Notice',
    content: 'The LMS will undergo scheduled maintenance on Saturday from 2:00 AM to 6:00 AM. Please save your work before this time.',
    author: 'IT Support',
    createdAt: '2026-01-18T09:00:00Z',
    priority: 'urgent',
    isRead: false,
  },
  {
    id: 'a4',
    title: 'New TypeScript Resources Added',
    content: 'We have added supplementary video tutorials and documentation for the TypeScript Generics module. Check the resources section for more details.',
    author: 'Prof. Lerato Khumalo',
    createdAt: '2026-01-17T16:00:00Z',
    priority: 'normal',
    isRead: true,
  },
];
