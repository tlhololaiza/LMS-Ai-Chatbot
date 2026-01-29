import {
  ConversationFlow,
  FlowStep,
  FlowAction,
  FlowContext,
  FlowType,
  MultiStepExplanation
} from './conversationFlows';

/**
 * Predefined Flow Templates
 * Ready-to-use conversation flows for common scenarios
 */

// ============================================
// CONCEPT EXPLANATION FLOW
// ============================================

/**
 * Create Concept Explanation Flow
 * Multi-step flow for explaining concepts with progressive detail
 */
export function createConceptExplanationFlow(concept?: string): ConversationFlow {
  const steps = new Map<string, FlowStep>();

  // Step 1: Acknowledge highlighted text
  steps.set('acknowledge', {
    id: 'acknowledge',
    name: 'Acknowledge',
    message: (context: FlowContext) => {
      const highlightedText = context.userData.highlightedText as string || concept || 'this concept';
      return `I see you're interested in learning about **${highlightedText}**. Let me help you understand it! 📚`;
    },
    actions: [
      { id: 'continue', label: 'Continue', type: 'next', nextStep: 'simple_definition' }
    ],
    requiresInput: false
  });

  // Step 2: Provide simple definition
  steps.set('simple_definition', {
    id: 'simple_definition',
    name: 'Simple Definition',
    message: (context: FlowContext) => {
      const concept = context.userData.highlightedText as string || 'the concept';
      return `**Simple Definition:**\n\n${concept} is a fundamental concept in programming. Would you like to explore further?`;
    },
    actions: [
      { id: 'detailed', label: '📖 Yes, show me more details', type: 'detail', nextStep: 'detailed_explanation' },
      { id: 'example', label: '💡 Skip to practical example', type: 'example', nextStep: 'practical_example' },
      { id: 'understand', label: '✅ I understand, thanks!', type: 'exit', nextStep: 'check_understanding' }
    ],
    requiresInput: false
  });

  // Step 3: Detailed explanation
  steps.set('detailed_explanation', {
    id: 'detailed_explanation',
    name: 'Detailed Explanation',
    message: (context: FlowContext) => {
      return `**Detailed Explanation:**\n\nLet me break this down in more depth...\n\n` +
        `This concept works by... [detailed technical explanation]\n\n` +
        `Key points to remember:\n` +
        `• Point 1\n` +
        `• Point 2\n` +
        `• Point 3`;
    },
    actions: [
      { id: 'example', label: '💡 Show me a practical example', type: 'example', nextStep: 'practical_example' },
      { id: 'related', label: '🔗 Show related concepts', type: 'next', nextStep: 'related_concepts' },
      { id: 'check', label: '✅ I think I understand', type: 'next', nextStep: 'check_understanding' }
    ],
    requiresInput: false
  });

  // Step 4: Practical example
  steps.set('practical_example', {
    id: 'practical_example',
    name: 'Practical Example',
    message: (context: FlowContext) => {
      return `**Practical Example:**\n\n` +
        `\`\`\`typescript\n` +
        `// Here's how you would use this in real code:\n` +
        `const example = {\n` +
        `  // Implementation details\n` +
        `};\n` +
        `\`\`\`\n\n` +
        `This example shows how the concept is applied in practice.`;
    },
    actions: [
      { id: 'more_examples', label: '🔄 Show another example', type: 'next', nextStep: 'practical_example' },
      { id: 'related', label: '🔗 Show related concepts', type: 'next', nextStep: 'related_concepts' },
      { id: 'check', label: '✅ I understand now', type: 'next', nextStep: 'check_understanding' }
    ],
    requiresInput: false
  });

  // Step 5: Related concepts
  steps.set('related_concepts', {
    id: 'related_concepts',
    name: 'Related Concepts',
    message: () => {
      return `**Related Concepts You Might Find Useful:**\n\n` +
        `🔹 **Concept A** - Brief description\n` +
        `🔹 **Concept B** - Brief description\n` +
        `🔹 **Concept C** - Brief description\n\n` +
        `Would you like to explore any of these?`;
    },
    actions: [
      { id: 'explore', label: 'Yes, explain one', type: 'detail', nextStep: 'acknowledge' },
      { id: 'no', label: 'No, I\'m good', type: 'next', nextStep: 'check_understanding' }
    ],
    requiresInput: false
  });

  // Step 6: Check understanding
  steps.set('check_understanding', {
    id: 'check_understanding',
    name: 'Check Understanding',
    message: () => {
      return `**Quick Check:**\n\nDo you feel you understand this concept now? 🤔\n\n` +
        `If not, I can:\n` +
        `• Explain it differently\n` +
        `• Show more examples\n` +
        `• Break it down further`;
    },
    actions: [
      { id: 'yes', label: '✅ Yes, I understand!', type: 'exit', nextStep: 'completion' },
      { id: 'retry', label: '🔄 Explain it differently', type: 'restart', nextStep: 'simple_definition' },
      { id: 'examples', label: '💡 Show more examples', type: 'example', nextStep: 'practical_example' }
    ],
    requiresInput: false
  });

  // Step 7: Completion
  steps.set('completion', {
    id: 'completion',
    name: 'Completion',
    message: () => {
      return `Great! I'm glad I could help you understand this concept. 🎉\n\n` +
        `Feel free to highlight any other text if you need more explanations!`;
    },
    actions: [],
    requiresInput: false
  });

  return {
    id: 'concept_explanation',
    name: 'Concept Explanation Flow',
    type: 'concept_explanation',
    description: 'Multi-step flow for explaining concepts with progressive detail levels',
    startStep: 'acknowledge',
    steps,
    metadata: {
      estimatedDuration: 180,
      difficulty: 'beginner',
      tags: ['explanation', 'learning', 'concept']
    }
  };
}

// ============================================
// TASK HELP FLOW
// ============================================

/**
 * Create Task Help Flow
 * Guides users through understanding and completing tasks
 */
export function createTaskHelpFlow(): ConversationFlow {
  const steps = new Map<string, FlowStep>();

  // Step 1: Understand requirements
  steps.set('understand_requirements', {
    id: 'understand_requirements',
    name: 'Understand Requirements',
    message: (context: FlowContext) => {
      const taskName = context.userData.taskName as string || 'this task';
      return `Let me help you with **${taskName}**! 📝\n\n` +
        `First, let's make sure we understand what's being asked.\n\n` +
        `**Task Requirements:**\n` +
        `• Requirement 1\n` +
        `• Requirement 2\n` +
        `• Requirement 3\n\n` +
        `Do these requirements make sense to you?`;
    },
    actions: [
      { id: 'yes', label: 'Yes, let\'s continue', type: 'next', nextStep: 'break_down_steps' },
      { id: 'clarify', label: 'I need clarification', type: 'detail', nextStep: 'clarify_requirements' },
      { id: 'skip', label: 'Skip to solution', type: 'skip', nextStep: 'code_examples' }
    ],
    requiresInput: false
  });

  // Step 2: Clarify requirements
  steps.set('clarify_requirements', {
    id: 'clarify_requirements',
    name: 'Clarify Requirements',
    message: () => {
      return `**Let me clarify the requirements:**\n\n` +
        `The task is asking you to...\n\n` +
        `In simpler terms, you need to accomplish these things:\n` +
        `1. First objective\n` +
        `2. Second objective\n` +
        `3. Final goal\n\n` +
        `Does this help?`;
    },
    actions: [
      { id: 'yes', label: 'Yes, that\'s clear now', type: 'next', nextStep: 'break_down_steps' },
      { id: 'more', label: 'I need more explanation', type: 'detail', nextStep: 'clarify_requirements' }
    ],
    requiresInput: false
  });

  // Step 3: Break down into steps
  steps.set('break_down_steps', {
    id: 'break_down_steps',
    name: 'Break Down Steps',
    message: () => {
      return `**Step-by-Step Approach:**\n\n` +
        `Here's how to tackle this task:\n\n` +
        `**Step 1:** Set up your environment\n` +
        `• What you need to do first\n\n` +
        `**Step 2:** Implement core functionality\n` +
        `• Main implementation details\n\n` +
        `**Step 3:** Test and validate\n` +
        `• How to verify your work\n\n` +
        `**Step 4:** Polish and submit\n` +
        `• Final touches\n\n` +
        `Ready to see some code examples?`;
    },
    actions: [
      { id: 'code', label: '💻 Yes, show me code!', type: 'next', nextStep: 'code_examples' },
      { id: 'explain', label: '📖 Explain a step in detail', type: 'detail', nextStep: 'explain_step' },
      { id: 'resources', label: '📚 Show me resources', type: 'next', nextStep: 'suggest_resources' }
    ],
    requiresInput: false
  });

  // Step 4: Explain specific step
  steps.set('explain_step', {
    id: 'explain_step',
    name: 'Explain Step',
    message: () => {
      return `**Detailed Step Explanation:**\n\n` +
        `Let me break down this step further...\n\n` +
        `What you need to do:\n` +
        `• Action 1\n` +
        `• Action 2\n` +
        `• Action 3\n\n` +
        `Why this matters:\n` +
        `This step is important because...`;
    },
    actions: [
      { id: 'next', label: 'Next step please', type: 'next', nextStep: 'break_down_steps' },
      { id: 'code', label: 'Show me the code', type: 'example', nextStep: 'code_examples' }
    ],
    requiresInput: false
  });

  // Step 5: Code examples
  steps.set('code_examples', {
    id: 'code_examples',
    name: 'Code Examples',
    message: () => {
      return `**Code Example:**\n\n` +
        `\`\`\`typescript\n` +
        `// Here's a working implementation:\n\n` +
        `function solveProblem() {\n` +
        `  // Step 1: Initialize\n` +
        `  const setup = initializeSetup();\n\n` +
        `  // Step 2: Process\n` +
        `  const result = processData(setup);\n\n` +
        `  // Step 3: Return\n` +
        `  return result;\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `**Key Points:**\n` +
        `• Explanation of important parts\n` +
        `• Why we did it this way\n` +
        `• Common pitfalls to avoid`;
    },
    actions: [
      { id: 'more', label: '🔄 Show another approach', type: 'example', nextStep: 'code_examples' },
      { id: 'resources', label: '📚 Show me resources', type: 'next', nextStep: 'suggest_resources' },
      { id: 'debug', label: '🐛 Debugging tips', type: 'next', nextStep: 'debugging_tips' }
    ],
    requiresInput: false
  });

  // Step 6: Suggest resources
  steps.set('suggest_resources', {
    id: 'suggest_resources',
    name: 'Suggest Resources',
    message: () => {
      return `**Helpful Resources:**\n\n` +
        `📖 **Documentation:**\n` +
        `• Official docs for this topic\n` +
        `• API reference guide\n\n` +
        `🎥 **Video Tutorials:**\n` +
        `• Tutorial 1: Basic concepts\n` +
        `• Tutorial 2: Advanced techniques\n\n` +
        `📝 **Articles:**\n` +
        `• Best practices guide\n` +
        `• Common mistakes to avoid\n\n` +
        `💡 **Practice:**\n` +
        `• Interactive coding challenges\n` +
        `• Similar example projects`;
    },
    actions: [
      { id: 'debug', label: '🐛 Show debugging tips', type: 'next', nextStep: 'debugging_tips' },
      { id: 'check', label: '✅ Check my understanding', type: 'next', nextStep: 'check_comprehension' }
    ],
    requiresInput: false
  });

  // Step 7: Debugging tips
  steps.set('debugging_tips', {
    id: 'debugging_tips',
    name: 'Debugging Tips',
    message: () => {
      return `**Debugging Tips for This Task:**\n\n` +
        `🔍 **Common Issues:**\n` +
        `1. **Issue 1:** Description and fix\n` +
        `2. **Issue 2:** Description and fix\n` +
        `3. **Issue 3:** Description and fix\n\n` +
        `🛠️ **Testing Strategy:**\n` +
        `• Test this first\n` +
        `• Then verify this\n` +
        `• Finally check this\n\n` +
        `💡 **Pro Tips:**\n` +
        `• Use console.log to debug\n` +
        `• Check browser DevTools\n` +
        `• Read error messages carefully`;
    },
    actions: [
      { id: 'check', label: '✅ Check my understanding', type: 'next', nextStep: 'check_comprehension' },
      { id: 'restart', label: '🔄 Start over', type: 'restart', nextStep: 'understand_requirements' }
    ],
    requiresInput: false
  });

  // Step 8: Check comprehension
  steps.set('check_comprehension', {
    id: 'check_comprehension',
    name: 'Check Comprehension',
    message: () => {
      return `**Comprehension Check:**\n\n` +
        `Do you feel ready to tackle this task now? 🚀\n\n` +
        `You should be able to:\n` +
        `✅ Understand the requirements\n` +
        `✅ Know the steps to take\n` +
        `✅ Have code examples to reference\n` +
        `✅ Know how to debug issues\n\n` +
        `How are you feeling about it?`;
    },
    actions: [
      { id: 'ready', label: '🎯 I\'m ready to start!', type: 'exit', nextStep: 'completion' },
      { id: 'review', label: '🔄 Review something again', type: 'restart', nextStep: 'understand_requirements' },
      { id: 'help', label: '❓ I still need help', type: 'detail', nextStep: 'break_down_steps' }
    ],
    requiresInput: false
  });

  // Step 9: Completion
  steps.set('completion', {
    id: 'completion',
    name: 'Completion',
    message: () => {
      return `Excellent! You've got all the tools you need to complete this task. 🎉\n\n` +
        `Remember:\n` +
        `• Take it step by step\n` +
        `• Test as you go\n` +
        `• Don't hesitate to ask for help\n\n` +
        `Good luck! You've got this! 💪`;
    },
    actions: [],
    requiresInput: false
  });

  return {
    id: 'task_help',
    name: 'Task Help Flow',
    type: 'task_help',
    description: 'Comprehensive guide for understanding and completing tasks',
    startStep: 'understand_requirements',
    steps,
    metadata: {
      estimatedDuration: 300,
      difficulty: 'intermediate',
      tags: ['task', 'help', 'guide', 'code']
    }
  };
}

// ============================================
// NAVIGATION HELP FLOW
// ============================================

/**
 * Create Navigation Help Flow
 * Helps users find their way around the LMS
 */
export function createNavigationHelpFlow(): ConversationFlow {
  const steps = new Map<string, FlowStep>();

  // Step 1: Identify goal
  steps.set('identify_goal', {
    id: 'identify_goal',
    name: 'Identify Goal',
    message: () => {
      return `I can help you navigate the LMS! 🧭\n\n` +
        `What are you looking for?\n\n` +
        `**Common destinations:**\n` +
        `📚 Courses and lessons\n` +
        `📝 Tasks and assignments\n` +
        `📊 Progress tracking\n` +
        `📢 Announcements\n` +
        `⚙️ Settings`;
    },
    actions: [
      { id: 'courses', label: '📚 Courses', type: 'next', nextStep: 'navigate_courses' },
      { id: 'tasks', label: '📝 Tasks', type: 'next', nextStep: 'navigate_tasks' },
      { id: 'progress', label: '📊 Progress', type: 'next', nextStep: 'navigate_progress' },
      { id: 'other', label: '❓ Something else', type: 'detail', nextStep: 'custom_navigation' }
    ],
    requiresInput: false
  });

  // Step 2: Navigate to courses
  steps.set('navigate_courses', {
    id: 'navigate_courses',
    name: 'Navigate Courses',
    message: () => {
      return `**Finding Your Courses:**\n\n` +
        `📍 **Step 1:** Click on "Courses" in the sidebar\n` +
        `📍 **Step 2:** Browse available courses\n` +
        `📍 **Step 3:** Click on a course to see its modules\n` +
        `📍 **Step 4:** Select a lesson to start learning\n\n` +
        `🔍 **Visual Indicator:** Look for the 📚 icon in the left menu`;
    },
    actions: [
      { id: 'alternative', label: '🔄 Show alternative path', type: 'next', nextStep: 'alternative_path' },
      { id: 'found', label: '✅ I found it!', type: 'exit', nextStep: 'confirm_found' }
    ],
    requiresInput: false
  });

  // Step 3: Navigate to tasks
  steps.set('navigate_tasks', {
    id: 'navigate_tasks',
    name: 'Navigate Tasks',
    message: () => {
      return `**Finding Your Tasks:**\n\n` +
        `📍 **Step 1:** Look for "Tasks" in the main navigation\n` +
        `📍 **Step 2:** You'll see all your assignments\n` +
        `📍 **Step 3:** Tasks are organized by due date\n` +
        `📍 **Step 4:** Click on a task to view details\n\n` +
        `🔍 **Quick Tip:** Pending tasks show with a 🔴 indicator`;
    },
    actions: [
      { id: 'alternative', label: '🔄 Show alternative path', type: 'next', nextStep: 'alternative_path' },
      { id: 'found', label: '✅ I found it!', type: 'exit', nextStep: 'confirm_found' }
    ],
    requiresInput: false
  });

  // Step 4: Navigate to progress
  steps.set('navigate_progress', {
    id: 'navigate_progress',
    name: 'Navigate Progress',
    message: () => {
      return `**Viewing Your Progress:**\n\n` +
        `📍 **Step 1:** Click "Progress" in the sidebar\n` +
        `📍 **Step 2:** See your overall completion percentage\n` +
        `📍 **Step 3:** View progress by course\n` +
        `📍 **Step 4:** Check completed vs pending items\n\n` +
        `📊 **Dashboard Tip:** Progress summary is also on the main dashboard`;
    },
    actions: [
      { id: 'alternative', label: '🔄 Show alternative path', type: 'next', nextStep: 'alternative_path' },
      { id: 'found', label: '✅ I found it!', type: 'exit', nextStep: 'confirm_found' }
    ],
    requiresInput: false
  });

  // Step 5: Custom navigation
  steps.set('custom_navigation', {
    id: 'custom_navigation',
    name: 'Custom Navigation',
    message: () => {
      return `**Let me help you find that!**\n\n` +
        `Could you describe what you're looking for?\n` +
        `For example:\n` +
        `• "Where can I see my grades?"\n` +
        `• "How do I submit an assignment?"\n` +
        `• "Where are the course materials?"`;
    },
    actions: [
      { id: 'continue', label: 'I\'ll describe it', type: 'next', nextStep: 'identify_goal' }
    ],
    requiresInput: true
  });

  // Step 6: Alternative path
  steps.set('alternative_path', {
    id: 'alternative_path',
    name: 'Alternative Path',
    message: () => {
      return `**Alternative Way:**\n\n` +
        `You can also access this through:\n` +
        `• Dashboard quick links\n` +
        `• Search bar (top right)\n` +
        `• Recent activity section\n\n` +
        `Try whichever feels most comfortable!`;
    },
    actions: [
      { id: 'found', label: '✅ Got it, thanks!', type: 'exit', nextStep: 'confirm_found' },
      { id: 'help', label: '❓ Still need help', type: 'restart', nextStep: 'identify_goal' }
    ],
    requiresInput: false
  });

  // Step 7: Confirm found
  steps.set('confirm_found', {
    id: 'confirm_found',
    name: 'Confirm Found',
    message: () => {
      return `Great! I'm glad you found what you were looking for! 🎯\n\n` +
        `**Pro Tip:** You can bookmark frequently used pages or use keyboard shortcuts for faster navigation.\n\n` +
        `Need help finding anything else?`;
    },
    actions: [
      { id: 'yes', label: 'Yes, help me find something else', type: 'restart', nextStep: 'identify_goal' },
      { id: 'no', label: 'No, I\'m all set', type: 'exit', nextStep: 'completion' }
    ],
    requiresInput: false
  });

  // Step 8: Completion
  steps.set('completion', {
    id: 'completion',
    name: 'Completion',
    message: () => {
      return `Perfect! Happy learning! 🚀\n\n` +
        `If you get lost again, just ask me for directions!`;
    },
    actions: [],
    requiresInput: false
  });

  return {
    id: 'navigation_help',
    name: 'Navigation Help Flow',
    type: 'navigation_help',
    description: 'Helps users navigate and find features in the LMS',
    startStep: 'identify_goal',
    steps,
    metadata: {
      estimatedDuration: 120,
      difficulty: 'beginner',
      tags: ['navigation', 'ui', 'help']
    }
  };
}

/**
 * Get all predefined flow templates
 */
export function getAllFlowTemplates(): Map<string, () => ConversationFlow> {
  const templates = new Map<string, () => ConversationFlow>();
  
  templates.set('concept_explanation', () => createConceptExplanationFlow());
  templates.set('task_help', () => createTaskHelpFlow());
  templates.set('navigation_help', () => createNavigationHelpFlow());
  
  return templates;
}

/**
 * Get flow template by ID
 */
export function getFlowTemplate(flowId: string): ConversationFlow | null {
  const templates = getAllFlowTemplates();
  const factory = templates.get(flowId);
  return factory ? factory() : null;
}
