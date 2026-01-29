import { ChatContextType, ChatMessage } from '../types/lms';

/**
 * Conversation Flow System
 * Manages predefined response flows for different scenarios
 */

// ============================================
// FLOW STATE TYPES
// ============================================

/**
 * State of a conversation flow
 */
export type FlowState = 
  | 'idle'
  | 'started'
  | 'in_progress'
  | 'awaiting_response'
  | 'completed'
  | 'interrupted'
  | 'failed';

/**
 * Type of conversation flow
 */
export type FlowType = 
  | 'concept_explanation'
  | 'task_help'
  | 'navigation_help'
  | 'progress_check'
  | 'troubleshooting'
  | 'resource_suggestion';

/**
 * Action that can be taken at a flow step
 */
export interface FlowAction {
  /** Unique action identifier */
  id: string;
  /** Display label for the action */
  label: string;
  /** Type of action */
  type: 'next' | 'skip' | 'detail' | 'example' | 'restart' | 'exit';
  /** Next step to navigate to */
  nextStep?: string;
  /** Payload data for the action */
  payload?: Record<string, unknown>;
}

/**
 * A single step in a conversation flow
 */
export interface FlowStep {
  /** Unique step identifier */
  id: string;
  /** Step title/name */
  name: string;
  /** Message or question to present */
  message: string | ((context: FlowContext) => string);
  /** Available actions for this step */
  actions: FlowAction[];
  /** Whether this step requires user input */
  requiresInput: boolean;
  /** Validation function for user input */
  validator?: (input: string, context: FlowContext) => boolean;
  /** Function to execute when step is entered */
  onEnter?: (context: FlowContext) => void;
  /** Function to execute when leaving step */
  onExit?: (context: FlowContext) => void;
  /** Condition to determine if step should be shown */
  condition?: (context: FlowContext) => boolean;
}

/**
 * Complete conversation flow definition
 */
export interface ConversationFlow {
  /** Unique flow identifier */
  id: string;
  /** Flow name */
  name: string;
  /** Flow type */
  type: FlowType;
  /** Description of what this flow does */
  description: string;
  /** Initial step ID */
  startStep: string;
  /** All steps in the flow */
  steps: Map<string, FlowStep>;
  /** Metadata about the flow */
  metadata?: {
    estimatedDuration?: number; // in seconds
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  };
}

/**
 * Context data for flow execution
 */
export interface FlowContext {
  /** Flow instance ID */
  flowInstanceId: string;
  /** Current flow being executed */
  flow: ConversationFlow;
  /** Current step ID */
  currentStepId: string;
  /** Flow state */
  state: FlowState;
  /** User data/variables collected during flow */
  userData: Record<string, unknown>;
  /** Flow execution history */
  history: Array<{
    stepId: string;
    timestamp: string;
    userInput?: string;
    actionTaken?: string;
  }>;
  /** Original user query/trigger */
  trigger: {
    text: string;
    contextType: ChatContextType;
    metadata?: Record<string, unknown>;
  };
  /** Start timestamp */
  startedAt: string;
  /** Completion timestamp */
  completedAt?: string;
}

/**
 * Decision tree node for routing
 */
export interface DecisionNode {
  /** Node identifier */
  id: string;
  /** Question or condition to evaluate */
  question: string;
  /** Type of decision */
  type: 'boolean' | 'multiple_choice' | 'keyword_match' | 'sentiment';
  /** Possible branches */
  branches: Array<{
    condition: string | RegExp | ((input: string) => boolean);
    nextNodeId: string;
    label?: string;
  }>;
  /** Default branch if no condition matches */
  defaultBranch: string;
}

/**
 * Decision tree for routing complex conversations
 */
export interface DecisionTree {
  /** Tree identifier */
  id: string;
  /** Tree name */
  name: string;
  /** Root node ID */
  rootNodeId: string;
  /** All nodes in the tree */
  nodes: Map<string, DecisionNode>;
  /** Terminal node IDs that lead to flow execution */
  terminalNodes: Map<string, string>; // nodeId -> flowId
}

// ============================================
// FLOW TRANSITIONS
// ============================================

/**
 * Transition between flow steps
 */
export interface FlowTransition {
  /** From step ID */
  from: string;
  /** To step ID */
  to: string;
  /** Condition for transition */
  condition?: (context: FlowContext) => boolean;
  /** Action that triggers this transition */
  action?: string;
}

/**
 * Manages flow state transitions
 */
export class FlowTransitionManager {
  private transitions: Map<string, FlowTransition[]> = new Map();

  /**
   * Register a transition
   */
  addTransition(flowId: string, transition: FlowTransition): void {
    const key = `${flowId}:${transition.from}`;
    const existing = this.transitions.get(key) || [];
    existing.push(transition);
    this.transitions.set(key, existing);
  }

  /**
   * Get available transitions from current step
   */
  getTransitions(flowId: string, fromStepId: string, context: FlowContext): FlowTransition[] {
    const key = `${flowId}:${fromStepId}`;
    const transitions = this.transitions.get(key) || [];
    
    return transitions.filter(t => !t.condition || t.condition(context));
  }

  /**
   * Find transition by action
   */
  findTransitionByAction(
    flowId: string,
    fromStepId: string,
    action: string,
    context: FlowContext
  ): FlowTransition | undefined {
    const transitions = this.getTransitions(flowId, fromStepId, context);
    return transitions.find(t => t.action === action);
  }
}

// ============================================
// MULTI-STEP EXPLANATION HANDLING
// ============================================

/**
 * Multi-step explanation builder
 */
export class MultiStepExplanation {
  private steps: Array<{
    level: 'simple' | 'intermediate' | 'detailed' | 'technical';
    content: string;
    examples?: string[];
    relatedConcepts?: string[];
  }> = [];

  /**
   * Add explanation step
   */
  addStep(
    level: 'simple' | 'intermediate' | 'detailed' | 'technical',
    content: string,
    examples?: string[],
    relatedConcepts?: string[]
  ): void {
    this.steps.push({ level, content, examples, relatedConcepts });
  }

  /**
   * Get step by level
   */
  getStep(level: 'simple' | 'intermediate' | 'detailed' | 'technical'): typeof this.steps[0] | undefined {
    return this.steps.find(s => s.level === level);
  }

  /**
   * Get all steps in order
   */
  getAllSteps(): typeof this.steps {
    const order = ['simple', 'intermediate', 'detailed', 'technical'];
    return this.steps.sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
  }

  /**
   * Get next step from current level
   */
  getNextStep(currentLevel: string): typeof this.steps[0] | undefined {
    const order: Array<'simple' | 'intermediate' | 'detailed' | 'technical'> = 
      ['simple', 'intermediate', 'detailed', 'technical'];
    const currentIndex = order.indexOf(currentLevel as 'simple' | 'intermediate' | 'detailed' | 'technical');
    if (currentIndex < 0 || currentIndex >= order.length - 1) return undefined;
    
    const nextLevel = order[currentIndex + 1];
    return this.getStep(nextLevel);
  }
}

// ============================================
// COMMON QUESTIONS DECISION TREE
// ============================================

/**
 * Build decision tree for common questions
 */
export function buildCommonQuestionsTree(): DecisionTree {
  const tree: DecisionTree = {
    id: 'common_questions',
    name: 'Common Questions Router',
    rootNodeId: 'root',
    nodes: new Map(),
    terminalNodes: new Map()
  };

  // Root node - categorize question type
  tree.nodes.set('root', {
    id: 'root',
    question: 'What type of help do you need?',
    type: 'keyword_match',
    branches: [
      {
        condition: /what is|define|explain|meaning/i,
        nextNodeId: 'concept_check',
        label: 'Concept Explanation'
      },
      {
        condition: /how to|how do i|steps|guide/i,
        nextNodeId: 'task_check',
        label: 'Task Help'
      },
      {
        condition: /where is|find|navigate|go to/i,
        nextNodeId: 'navigation_check',
        label: 'Navigation Help'
      },
      {
        condition: /error|bug|not working|problem/i,
        nextNodeId: 'troubleshooting_check',
        label: 'Troubleshooting'
      }
    ],
    defaultBranch: 'general_help'
  });

  // Concept explanation branch
  tree.nodes.set('concept_check', {
    id: 'concept_check',
    question: 'Do you want a simple or detailed explanation?',
    type: 'keyword_match',
    branches: [
      {
        condition: /simple|basic|quick|brief/i,
        nextNodeId: 'concept_simple',
        label: 'Simple Explanation'
      },
      {
        condition: /detailed|in-depth|comprehensive|thorough/i,
        nextNodeId: 'concept_detailed',
        label: 'Detailed Explanation'
      }
    ],
    defaultBranch: 'concept_simple'
  });

  tree.terminalNodes.set('concept_simple', 'concept_explanation_simple');
  tree.terminalNodes.set('concept_detailed', 'concept_explanation_detailed');

  // Task help branch
  tree.nodes.set('task_check', {
    id: 'task_check',
    question: 'What do you need help with?',
    type: 'keyword_match',
    branches: [
      {
        condition: /code|coding|programming|implement/i,
        nextNodeId: 'task_code',
        label: 'Code Help'
      },
      {
        condition: /understand|requirements|what does/i,
        nextNodeId: 'task_requirements',
        label: 'Understanding Requirements'
      }
    ],
    defaultBranch: 'task_general'
  });

  tree.terminalNodes.set('task_code', 'task_help_code');
  tree.terminalNodes.set('task_requirements', 'task_help_requirements');
  tree.terminalNodes.set('task_general', 'task_help_general');

  // Navigation branch
  tree.terminalNodes.set('navigation_check', 'navigation_help');

  // Troubleshooting branch
  tree.terminalNodes.set('troubleshooting_check', 'troubleshooting_flow');

  // General help
  tree.terminalNodes.set('general_help', 'general_conversation');

  return tree;
}

/**
 * Navigate decision tree with user input
 */
export function navigateDecisionTree(
  tree: DecisionTree,
  userInput: string,
  currentNodeId: string = tree.rootNodeId
): { flowId: string | null; nextNodeId: string | null } {
  const node = tree.nodes.get(currentNodeId);
  if (!node) {
    return { flowId: null, nextNodeId: null };
  }

  // Check if this is a terminal node
  const flowId = tree.terminalNodes.get(currentNodeId);
  if (flowId) {
    return { flowId, nextNodeId: null };
  }

  // Find matching branch
  for (const branch of node.branches) {
    let matches = false;

    if (typeof branch.condition === 'string') {
      matches = userInput.toLowerCase().includes(branch.condition.toLowerCase());
    } else if (branch.condition instanceof RegExp) {
      matches = branch.condition.test(userInput);
    } else if (typeof branch.condition === 'function') {
      matches = branch.condition(userInput);
    }

    if (matches) {
      return { flowId: null, nextNodeId: branch.nextNodeId };
    }
  }

  // Use default branch
  return { flowId: null, nextNodeId: node.defaultBranch };
}

/**
 * Generate unique ID for flow instances
 */
export function generateFlowInstanceId(): string {
  return `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
