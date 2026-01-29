import {
  ConversationFlow,
  FlowContext,
  FlowState,
  FlowStep,
  FlowAction,
  generateFlowInstanceId
} from './conversationFlows';
import { ChatContextType } from '../types/lms';

/**
 * Flow Engine
 * Manages flow execution with state machine implementation
 */

// ============================================
// FLOW ENGINE
// ============================================

export class FlowEngine {
  private activeFlows: Map<string, FlowContext> = new Map();
  private flowHistory: Map<string, FlowContext[]> = new Map();

  /**
   * Start a new conversation flow
   */
  startFlow(
    flow: ConversationFlow,
    trigger: {
      text: string;
      contextType: ChatContextType;
      metadata?: Record<string, unknown>;
    },
    initialUserData: Record<string, unknown> = {}
  ): FlowContext {
    const flowInstanceId = generateFlowInstanceId();
    
    const context: FlowContext = {
      flowInstanceId,
      flow,
      currentStepId: flow.startStep,
      state: 'started',
      userData: initialUserData,
      history: [{
        stepId: flow.startStep,
        timestamp: new Date().toISOString(),
        actionTaken: 'flow_started'
      }],
      trigger,
      startedAt: new Date().toISOString()
    };

    this.activeFlows.set(flowInstanceId, context);
    
    // Execute onEnter for first step
    const firstStep = flow.steps.get(flow.startStep);
    if (firstStep?.onEnter) {
      firstStep.onEnter(context);
    }

    return context;
  }

  /**
   * Get current step for a flow
   */
  getCurrentStep(flowInstanceId: string): FlowStep | null {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) return null;

    return context.flow.steps.get(context.currentStepId) || null;
  }

  /**
   * Get current flow context
   */
  getFlowContext(flowInstanceId: string): FlowContext | null {
    return this.activeFlows.get(flowInstanceId) || null;
  }

  /**
   * Check if step should be shown based on condition
   */
  private shouldShowStep(step: FlowStep, context: FlowContext): boolean {
    if (!step.condition) return true;
    return step.condition(context);
  }

  /**
   * Find next valid step (skip steps with false conditions)
   */
  private findNextValidStep(startStepId: string, context: FlowContext): string | null {
    let currentStepId = startStepId;
    const visited = new Set<string>();

    while (currentStepId && !visited.has(currentStepId)) {
      visited.add(currentStepId);
      
      const step = context.flow.steps.get(currentStepId);
      if (!step) return null;

      if (this.shouldShowStep(step, context)) {
        return currentStepId;
      }

      // If step should be skipped, try to find next step
      const nextAction = step.actions.find(a => a.type === 'next');
      if (nextAction?.nextStep) {
        currentStepId = nextAction.nextStep;
      } else {
        return null; // No valid next step
      }
    }

    return null; // Circular reference detected
  }

  /**
   * Execute action and transition to next step
   */
  executeAction(
    flowInstanceId: string,
    action: FlowAction,
    userInput?: string
  ): {
    success: boolean;
    context: FlowContext | null;
    message?: string;
    error?: string;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        success: false,
        context: null,
        error: 'Flow not found'
      };
    }

    const currentStep = context.flow.steps.get(context.currentStepId);
    if (!currentStep) {
      return {
        success: false,
        context,
        error: 'Current step not found'
      };
    }

    // Validate user input if required
    if (currentStep.requiresInput && currentStep.validator) {
      if (!userInput || !currentStep.validator(userInput, context)) {
        return {
          success: false,
          context,
          error: 'Invalid input. Please try again.'
        };
      }
    }

    // Execute onExit for current step
    if (currentStep.onExit) {
      currentStep.onExit(context);
    }

    // Update context based on action
    context.userData.lastAction = action.id;
    if (userInput) {
      context.userData.lastInput = userInput;
    }

    // Add to history
    context.history.push({
      stepId: context.currentStepId,
      timestamp: new Date().toISOString(),
      userInput,
      actionTaken: action.id
    });

    // Handle different action types
    switch (action.type) {
      case 'exit':
        return this.completeFlow(flowInstanceId);
      
      case 'restart':
        return this.restartFlow(flowInstanceId, action.nextStep);
      
      default:
        // Move to next step
        if (action.nextStep) {
          return this.transitionToStep(flowInstanceId, action.nextStep);
        } else {
          return {
            success: false,
            context,
            error: 'No next step defined for this action'
          };
        }
    }
  }

  /**
   * Transition to a specific step
   */
  private transitionToStep(
    flowInstanceId: string,
    nextStepId: string
  ): {
    success: boolean;
    context: FlowContext;
    message?: string;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        success: false,
        context: null as unknown as FlowContext,
        message: 'Flow not found'
      };
    }

    // Find next valid step (skip conditional steps)
    const validStepId = this.findNextValidStep(nextStepId, context);
    if (!validStepId) {
      return {
        success: false,
        context,
        message: 'No valid next step found'
      };
    }

    const nextStep = context.flow.steps.get(validStepId);
    if (!nextStep) {
      return {
        success: false,
        context,
        message: 'Next step not found in flow'
      };
    }

    // Update context
    context.currentStepId = validStepId;
    context.state = 'in_progress';

    // Execute onEnter for new step
    if (nextStep.onEnter) {
      nextStep.onEnter(context);
    }

    return {
      success: true,
      context,
      message: this.getStepMessage(nextStep, context)
    };
  }

  /**
   * Get message for a step (evaluate if function)
   */
  private getStepMessage(step: FlowStep, context: FlowContext): string {
    if (typeof step.message === 'function') {
      return step.message(context);
    }
    return step.message;
  }

  /**
   * Handle user interruption (user sends message during flow)
   */
  handleInterruption(
    flowInstanceId: string,
    userMessage: string
  ): {
    shouldContinueFlow: boolean;
    shouldPauseFlow: boolean;
    shouldCancelFlow: boolean;
    interpretation: string;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        shouldContinueFlow: false,
        shouldPauseFlow: false,
        shouldCancelFlow: false,
        interpretation: 'Flow not found'
      };
    }

    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for explicit flow control commands
    if (lowerMessage.match(/^(stop|cancel|exit|quit)$/)) {
      return {
        shouldContinueFlow: false,
        shouldPauseFlow: false,
        shouldCancelFlow: true,
        interpretation: 'User requested to cancel the flow'
      };
    }

    if (lowerMessage.match(/^(pause|wait|hold)$/)) {
      context.state = 'interrupted';
      return {
        shouldContinueFlow: false,
        shouldPauseFlow: true,
        shouldCancelFlow: false,
        interpretation: 'User requested to pause the flow'
      };
    }

    if (lowerMessage.match(/^(restart|reset|start over)$/)) {
      this.restartFlow(flowInstanceId);
      return {
        shouldContinueFlow: true,
        shouldPauseFlow: false,
        shouldCancelFlow: false,
        interpretation: 'User requested to restart the flow'
      };
    }

    // If message seems like a question, pause flow and answer
    if (lowerMessage.includes('?') || lowerMessage.match(/^(what|why|how|when|where|who)/)) {
      context.state = 'interrupted';
      return {
        shouldContinueFlow: false,
        shouldPauseFlow: true,
        shouldCancelFlow: false,
        interpretation: 'User asked a question - pausing flow'
      };
    }

    // Otherwise, treat as response to current step
    return {
      shouldContinueFlow: true,
      shouldPauseFlow: false,
      shouldCancelFlow: false,
      interpretation: 'Treating message as response to current step'
    };
  }

  /**
   * Resume a paused flow
   */
  resumeFlow(flowInstanceId: string): {
    success: boolean;
    context: FlowContext | null;
    message?: string;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        success: false,
        context: null,
        message: 'Flow not found'
      };
    }

    if (context.state !== 'interrupted') {
      return {
        success: false,
        context,
        message: 'Flow is not in interrupted state'
      };
    }

    context.state = 'in_progress';
    const currentStep = context.flow.steps.get(context.currentStepId);
    
    return {
      success: true,
      context,
      message: currentStep ? this.getStepMessage(currentStep, context) : 'Resuming flow...'
    };
  }

  /**
   * Restart flow from beginning or specific step
   */
  restartFlow(
    flowInstanceId: string,
    fromStepId?: string
  ): {
    success: boolean;
    context: FlowContext;
    message?: string;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        success: false,
        context: null as unknown as FlowContext,
        message: 'Flow not found'
      };
    }

    // Save to history before restarting
    const historyList = this.flowHistory.get(flowInstanceId) || [];
    historyList.push({ ...context });
    this.flowHistory.set(flowInstanceId, historyList);

    // Reset to start or specified step
    const startStepId = fromStepId || context.flow.startStep;
    context.currentStepId = startStepId;
    context.state = 'started';
    context.history.push({
      stepId: startStepId,
      timestamp: new Date().toISOString(),
      actionTaken: 'flow_restarted'
    });

    const step = context.flow.steps.get(startStepId);
    if (step?.onEnter) {
      step.onEnter(context);
    }

    return {
      success: true,
      context,
      message: step ? this.getStepMessage(step, context) : 'Flow restarted'
    };
  }

  /**
   * Complete the flow
   */
  private completeFlow(flowInstanceId: string): {
    success: boolean;
    context: FlowContext | null;
    message?: string;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        success: false,
        context: null,
        message: 'Flow not found'
      };
    }

    context.state = 'completed';
    context.completedAt = new Date().toISOString();

    // Move to history
    const historyList = this.flowHistory.get(flowInstanceId) || [];
    historyList.push({ ...context });
    this.flowHistory.set(flowInstanceId, historyList);

    // Remove from active flows
    this.activeFlows.delete(flowInstanceId);

    return {
      success: true,
      context,
      message: 'Flow completed successfully'
    };
  }

  /**
   * Cancel/abort a flow
   */
  cancelFlow(flowInstanceId: string): {
    success: boolean;
    context: FlowContext | null;
  } {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) {
      return {
        success: false,
        context: null
      };
    }

    context.state = 'interrupted';
    
    // Move to history
    const historyList = this.flowHistory.get(flowInstanceId) || [];
    historyList.push({ ...context });
    this.flowHistory.set(flowInstanceId, historyList);

    // Remove from active flows
    this.activeFlows.delete(flowInstanceId);

    return {
      success: true,
      context
    };
  }

  /**
   * Get flow progress (percentage)
   */
  getFlowProgress(flowInstanceId: string): number {
    const context = this.activeFlows.get(flowInstanceId);
    if (!context) return 0;

    const totalSteps = context.flow.steps.size;
    const completedSteps = context.history.length;
    
    return Math.min(100, Math.round((completedSteps / totalSteps) * 100));
  }

  /**
   * Get all active flows
   */
  getActiveFlows(): FlowContext[] {
    return Array.from(this.activeFlows.values());
  }

  /**
   * Get flow history
   */
  getFlowHistory(flowInstanceId: string): FlowContext[] {
    return this.flowHistory.get(flowInstanceId) || [];
  }

  /**
   * Check if there's an active flow
   */
  hasActiveFlow(): boolean {
    return this.activeFlows.size > 0;
  }

  /**
   * Get current active flow context (if only one active)
   */
  getCurrentActiveFlow(): FlowContext | null {
    if (this.activeFlows.size === 1) {
      return Array.from(this.activeFlows.values())[0];
    }
    return null;
  }
}

// ============================================
// BRANCHING PATH SUPPORT
// ============================================

/**
 * Branch condition evaluator
 */
export class BranchEvaluator {
  /**
   * Evaluate condition and return branch to take
   */
  static evaluateBranch(
    condition: string | ((context: FlowContext) => boolean),
    context: FlowContext
  ): boolean {
    if (typeof condition === 'function') {
      return condition(context);
    }

    // Simple string condition evaluation
    // Format: "userData.key operator value"
    const match = condition.match(/userData\.(\w+)\s*(==|!=|>|<|>=|<=)\s*(.+)/);
    if (!match) return false;

    const [, key, operator, value] = match;
    const userValue = context.userData[key];
    const compareValue = value.trim().replace(/['"]/g, '');

    switch (operator) {
      case '==':
        return String(userValue) === compareValue;
      case '!=':
        return String(userValue) !== compareValue;
      case '>':
        return Number(userValue) > Number(compareValue);
      case '<':
        return Number(userValue) < Number(compareValue);
      case '>=':
        return Number(userValue) >= Number(compareValue);
      case '<=':
        return Number(userValue) <= Number(compareValue);
      default:
        return false;
    }
  }

  /**
   * Find matching branch from multiple options
   */
  static findMatchingBranch(
    branches: Array<{ condition: string | ((context: FlowContext) => boolean); stepId: string }>,
    context: FlowContext
  ): string | null {
    for (const branch of branches) {
      if (this.evaluateBranch(branch.condition, context)) {
        return branch.stepId;
      }
    }
    return null;
  }
}

/**
 * Export singleton instance
 */
export const flowEngine = new FlowEngine();
