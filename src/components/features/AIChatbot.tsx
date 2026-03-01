import React, { useReducer, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Layers, Copy, RefreshCcw, Search, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChatMessage, ChatMessageMetadata } from '@/types/lms';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import {
  buildExplanationPrompt,
  buildGeneralPrompt,
  buildContextAwarePrompt,
  formatPromptForLogging,
} from '@/utils/promptBuilder';
import { enhanceResponseWithCitations } from '@/utils/ragService';
import { sendMessage, APIError, sendEscalationEmail } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';

const PERSONAL_DATA_PATTERNS = [
  /\b\d{13}\b/, // SA ID-like pattern
  /\b(?:\d[ -]*?){13,19}\b/, // card-like number sequence
  /\b\d{10,}\b/, // long numeric identifiers
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // email
];

const hasPotentialPersonalData = (text: string): boolean =>
  PERSONAL_DATA_PATTERNS.some((pattern) => pattern.test(text));

// Logs only minimal metadata for analytics.
function logQuery(query: string, category: string) {
  fetch('http://localhost:4000/api/log-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category,
      textLength: query.length,
      containsPotentialPersonalData: hasPotentialPersonalData(query),
      loggedAt: new Date().toISOString(),
    }),
  }).catch(() => {/* ignore errors for now */});
}

export interface AIChatbotRef {
  explainText: (text: string, context?: string, metadata?: Partial<ChatMessageMetadata>) => void;
  openChat: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content:
      "Hi, I am your learning assistant. Ask me in simple words and I will help step by step. Please do not share private personal information in chat.",
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const botResponses: Record<string, string> = {
  default:
    "I'm here to help! You can ask me about your courses, deadlines, or any technical questions. Try asking about React, JavaScript, or how to submit your tasks.",
  react:
    "React is a JavaScript library for building user interfaces. In your current module, you're learning about components, props, and hooks. Would you like me to explain any of these concepts in more detail?",
  deadline:
    'Your upcoming deadlines:\n• React Todo App - Feb 15\n• Data Visualization Dashboard - Feb 20\n\nWould you like help getting started on any of these?',
  submit:
    "To submit a task:\n1. Go to the Tasks section\n2. Find your assignment\n3. Click 'Submit Task'\n4. Paste your GitHub repository link\n5. Click Submit\n\nMake sure your repo is public so facilitators can review it!",
  help:
    'Here are some things I can help with:\n• Explain technical concepts\n• Guide you through the platform\n• Answer questions about your courses\n• Provide study tips and resources\n\nWhat would you like to know?',
};

const generateExplanation = (text: string, context?: string): string => {
  const contextPreview = context && context.length > 100 ? context.substring(0, 100) + '...' : context;
  return `Great question! Let me explain "${text}".\n\n🎯 **Quick Overview:**\nThis concept is an important part of your learning journey. Let me break it down for you.\n\n📖 **Detailed Explanation:**\n"${text}" refers to a fundamental concept in programming. ${
    contextPreview ? `\n\nI can see this appears in the context: "${contextPreview}"\n\n` : ''
  }Understanding this will help you progress through your course materials.\n\n💡 **Practical Example:**\n\n\`\`\`ts\n// Example usage\nconst example = "${text}";\nconsole.log(example);\n\`\`\`\n\n🔗 **Related Topics:**\n• Make sure you understand the basics first\n• Practice with the examples in your lessons\n• Try implementing it in your assignments\n\n❓ Would you like me to elaborate on any specific aspect?`;
};

interface HighlightSourceInfo {
  text: string;
  context?: string;
  source?: ChatMessageMetadata['source'];
  lessonId?: string;
  moduleId?: string;
}

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  input: string;
  isTyping: boolean;
  lastHighlight?: HighlightSourceInfo;
  pendingEscalation?: { escalationId: string; subject: string; body: string; recipients: string[] };
  suggestedEscalation?: { escalationId: string; subject: string; body: string; recipients: string[] };
  searchQuery: string;
  sourceSuggestions: Array<{ id: string; title: string; type: string }>;
}

type ChatAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'setInput'; value: string }
  | { type: 'addMessage'; message: ChatMessage }
  | { type: 'replaceMessage'; messageId: string; message: ChatMessage }
  | { type: 'setTyping'; value: boolean }
  | { type: 'setHighlight'; value?: HighlightSourceInfo }
  | { type: 'setSearchQuery'; value: string }
  | { type: 'setPendingEscalation'; draft?: { escalationId: string; subject: string; body: string; recipients: string[] } }
  | { type: 'setSuggestedEscalation'; draft?: { escalationId: string; subject: string; body: string; recipients: string[] } }
  | { type: 'clearPendingEscalation' }
  | { type: 'clearSuggestedEscalation' }
  | { type: 'clearMessages' }
  | { type: 'setSources'; sources: Array<{ id: string; title: string; type: string }> };

const initialState: ChatState = {
  isOpen: false,
  messages: initialMessages,
  input: '',
  isTyping: false,
  lastHighlight: undefined,
  searchQuery: '',
  sourceSuggestions: [],
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'open':
      return { ...state, isOpen: true };
    case 'close':
      return { ...state, isOpen: false };
    case 'setInput':
      return { ...state, input: action.value };
    case 'addMessage':
      return { ...state, messages: [...state.messages, action.message] };
    case 'replaceMessage':
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.messageId ? action.message : message
        ),
      };
    case 'setTyping':
      return { ...state, isTyping: action.value };
    case 'setHighlight':
      return { ...state, lastHighlight: action.value };
    case 'setSearchQuery':
      return { ...state, searchQuery: action.value };
      case 'setPendingEscalation':
        return { ...state, pendingEscalation: action.draft };
      case 'setSuggestedEscalation':
        return { ...state, suggestedEscalation: action.draft };
      case 'clearPendingEscalation':
        return { ...state, pendingEscalation: undefined };
      case 'clearSuggestedEscalation':
        return { ...state, suggestedEscalation: undefined };
    case 'setSources':
      return { ...state, sourceSuggestions: action.sources };
    case 'clearMessages':
      return {
        ...state,
        messages: initialMessages,
        lastHighlight: undefined,
        sourceSuggestions: [],
      };
    default:
      return state;
  }
};

const AIChatbot = forwardRef<AIChatbotRef>((props, ref) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show error toast with retry option
  const showErrorToast = (message: string, onRetry?: () => void) => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
      action: onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : undefined,
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useImperativeHandle(ref, () => ({
    explainText: (text: string, context?: string, metadata?: Partial<ChatMessageMetadata>) => {
  // Log the query text and category (always 'explanation' here)
  logQuery(text, 'explanation');
      dispatch({ type: 'open' });

      const highlightMetadata: ChatMessageMetadata = {
        highlightedText: text,
        textContext: context,
        source: metadata?.source || 'lesson',
        lessonId: metadata?.lessonId,
        moduleId: metadata?.moduleId,
        courseId: metadata?.courseId,
        taskId: metadata?.taskId,
      };

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Please explain: "${text}"`,
        sender: 'user',
        timestamp: new Date().toISOString(),
        contextType: 'explanation',
        metadata: highlightMetadata,
      };

      dispatch({ type: 'addMessage', message: userMessage });
      dispatch({ type: 'setTyping', value: true });
      dispatch({
        type: 'setHighlight',
        value: {
          text,
          context,
          source: highlightMetadata.source,
          lessonId: highlightMetadata.lessonId,
          moduleId: highlightMetadata.moduleId,
        },
      });

      // Call API for explanation
      (async () => {
        try {
          // Convert existing messages to conversation history
          const conversationHistory = state.messages
            .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
              content: msg.content,
            }));

          // Send to API with explanation context
          const apiResponse = await sendMessage({
            message: `Please explain: "${text}"`,
            conversationHistory,
            metadata: {
              highlightedText: text,
              textContext: context,
              source: highlightMetadata.source,
              lessonId: highlightMetadata.lessonId,
              moduleId: highlightMetadata.moduleId,
              courseId: highlightMetadata.courseId,
            },
          });

          // Enhance with local citations
          const prompt = buildExplanationPrompt(text, context, highlightMetadata);
          const response = enhanceResponseWithCitations(apiResponse.response, prompt.citations);
          
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: response,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            contextType: 'explanation',
            metadata: highlightMetadata,
          };
          dispatch({ type: 'addMessage', message: botMessage });
          dispatch({ type: 'setSources', sources: prompt.citations.map((c) => ({ id: c.sourceId, title: c.sourceTitle, type: c.sourceType })) });
        } catch (error) {
          console.error('Explanation API Error:', error);
          // Fallback error message
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: `⚠️ Sorry, I couldn't generate an explanation for "${text}". Please try again or rephrase your question.`,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            contextType: 'explanation',
            metadata: highlightMetadata,
          };
          dispatch({ type: 'addMessage', message: errorMessage });
        } finally {
          dispatch({ type: 'setTyping', value: false });
        }
      })();
    },
    openChat: () => {
      dispatch({ type: 'open' });
    },
  }));

  /**
   * Get bot response from backend API
   * Converts chat history to API format and handles errors gracefully
   */
  const getBotResponse = async (
    message: string,
    metadata?: Partial<ChatMessageMetadata>,
    historyMessages: ChatMessage[] = state.messages
  ): Promise<{ content: string; sources: string[] }> => {
    try {
      // Convert message history to API format (role + content)
      const conversationHistory = historyMessages
        .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content,
        }));

      // Prepare metadata for API
      const apiMetadata = metadata ? {
        courseId: metadata.courseId,
        moduleId: metadata.moduleId,
        lessonId: metadata.lessonId,
        highlightedText: metadata.highlightedText,
        textContext: metadata.textContext,
        source: metadata.source,
      } : undefined;

      // Send message to backend API
      const response = await sendMessage({
        message,
        conversationHistory,
        metadata: apiMetadata,
      });

      // If backend returned a draft:
      // - auto-escalated responses (response.escalated) still open the draft for review
      // - suggested escalations (response.escalationSuggested) only *suggest* escalation; show a confirmation option first
      if (response.draft) {
        try {
          const draft = { escalationId: response.draft.escalationId, subject: response.draft.subject, body: response.draft.body, recipients: response.draft.recipients || [] };
          if (response.escalated) {
            dispatch({ type: 'setPendingEscalation', draft });
          } else if (response.escalationSuggested) {
            dispatch({ type: 'setSuggestedEscalation', draft });
          }
        } catch {}
        const message = response.escalated
          ? '🔔 Your question has been escalated for human review. A draft email has been prepared for you to review and send.'
          : '🔔 This question may require human review. A draft email has been prepared — would you like to escalate it to a human reviewer?';
        return {
          content: message,
          sources: [],
        };
      }

      // Only attach sources when the query is genuinely knowledge-related
      // Skip sources for greetings, simple chat, and low-relevance matches
      const prompt = buildContextAwarePrompt(message, metadata);
      const isSimpleChat = /^(hi|hello|hey|yo|sup|thanks|thank you|ok|okay|bye|goodbye|good morning|good evening|good afternoon)[!?.\s]*$/i.test(message.trim());
      const hasRelevantSources = !isSimpleChat && prompt.context.relevanceScore > 0.5 && prompt.citations.length > 0;
      const enhancedResponse = hasRelevantSources
        ? enhanceResponseWithCitations(response.response, prompt.citations)
        : response.response;

      return {
        content: enhancedResponse,
        sources: hasRelevantSources ? prompt.citations.map((c) => c.sourceId) : [],
      };
    } catch (error) {
      // Graceful error handling with fallback message
      console.error('API Error:', error);
      
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error instanceof APIError) {
        if (error.statusCode === 429) {
          errorMessage = '⏳ I\'m getting too many requests right now. Please wait a moment and try again.';
        } else if (error.statusCode === 500) {
          errorMessage = '⚠️ The AI service is temporarily unavailable. Please try again in a moment.';
        } else if (error.statusCode === 400) {
          errorMessage = '❌ There was an issue with your request. Could you rephrase your question?';
        } else {
          errorMessage = `⚠️ Error: ${error.message}`;
        }
      } else if (error instanceof Error && error.message.includes('fetch')) {
        errorMessage = '🔌 Unable to connect to the AI service. Please check your connection and try again.';
      }

      return {
        content: errorMessage,
        sources: [],
      };
    }
  };

  const handleSend = async () => {
    if (!state.input.trim() || state.isTyping) return;

    if (hasPotentialPersonalData(state.input)) {
      const privacyWarning: ChatMessage = {
        id: Date.now().toString(),
        content:
          'For your privacy, please remove personal details (ID number, email, phone, account numbers) and try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };
      dispatch({ type: 'addMessage', message: privacyWarning });
      return;
    }

    // Log only minimal query metadata.
    logQuery(state.input, 'general');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: state.input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      contextType: 'general',
    };

    dispatch({ type: 'addMessage', message: userMessage });
    dispatch({ type: 'setInput', value: '' });
    dispatch({ type: 'setTyping', value: true });

    const userInput = state.input;
    
    try {
      // Call real API
      const { content, sources } = await getBotResponse(userInput, state.lastHighlight);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };
      dispatch({ type: 'addMessage', message: botMessage });
      dispatch({ type: 'setSources', sources: sources.map((s) => ({ id: s, title: s, type: 'reference' })) });
    } catch (error) {
      // Show error toast with retry option
      const errorMsg = error instanceof APIError 
        ? error.message 
        : 'Unable to connect to AI service';
      
      showErrorToast(errorMsg, () => {
        dispatch({ type: 'setInput', value: userInput });
        handleSend();
      });
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '⚠️ Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };
      dispatch({ type: 'addMessage', message: errorMessage });
    } finally {
      dispatch({ type: 'setTyping', value: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // no-op: clipboard may be unavailable
    }
  };

  const handleClearConversation = () => {
    dispatch({ type: 'clearMessages' });
  };

  const formatTimestampForUI = (isoTimestamp: string) =>
    new Date(isoTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatTimestampForFile = (date: Date) =>
    date.toISOString().replace(/[:.]/g, '-');

  const handleExportConversation = () => {
    const exportedAt = new Date();
    const exportPayload = {
      exportMeta: {
        version: '1.0',
        exportedAtUTC: exportedAt.toISOString(),
        exportedAtLocal: exportedAt.toLocaleString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        totalMessages: state.messages.length,
      },
      conversation: state.messages.map((message, index) => ({
        messageNumber: index + 1,
        id: message.id,
        sender: message.sender,
        contextType: message.contextType ?? 'general',
        content: message.content,
        timestampUTC: message.timestamp,
        timestampLocal: new Date(message.timestamp).toLocaleString(),
        metadata: message.metadata ?? null,
      })),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${formatTimestampForFile(exportedAt)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    if (state.isTyping) return;

    const lastUserIndex = [...state.messages]
      .map((message, index) => ({ message, index }))
      .reverse()
      .find(({ message }) => message.sender === 'user')?.index;

    if (lastUserIndex === undefined) return;

    const lastUserMessage = state.messages[lastUserIndex];
    const lastBotAfterUser = state.messages
      .map((message, index) => ({ message, index }))
      .reverse()
      .find(({ message, index }) => message.sender === 'bot' && index > lastUserIndex);

    const historyForRegeneration = state.messages.filter((_, index) => index !== lastBotAfterUser?.index);

    dispatch({ type: 'setTyping', value: true });

    try {
      let regeneratedData: { content: string; sources: string[] };
      
      if (lastUserMessage.metadata?.highlightedText) {
        // For highlighted text explanations, regenerate with API
        const conversationHistory = historyForRegeneration
          .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content,
          }));

        const apiResponse = await sendMessage({
          message: `Please explain: "${lastUserMessage.metadata.highlightedText}"`,
          conversationHistory,
          metadata: {
            highlightedText: lastUserMessage.metadata.highlightedText,
            textContext: lastUserMessage.metadata.textContext,
            source: lastUserMessage.metadata.source,
            lessonId: lastUserMessage.metadata.lessonId,
            moduleId: lastUserMessage.metadata.moduleId,
            courseId: lastUserMessage.metadata.courseId,
          },
        });

        const prompt = buildExplanationPrompt(
          lastUserMessage.metadata.highlightedText,
          lastUserMessage.metadata.textContext,
          lastUserMessage.metadata
        );
        const response = enhanceResponseWithCitations(apiResponse.response, prompt.citations);
        regeneratedData = { content: response, sources: prompt.citations.map((c) => c.sourceId) };
      } else {
        // For general messages
        regeneratedData = await getBotResponse(
          lastUserMessage.content,
          lastUserMessage.metadata,
          historyForRegeneration
        );
      }

      const regeneratedMessage: ChatMessage = {
        id: lastBotAfterUser?.message.id || Date.now().toString(),
        content: regeneratedData.content,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: lastUserMessage.contextType,
        metadata: lastUserMessage.metadata,
      };

      if (lastBotAfterUser) {
        dispatch({
          type: 'replaceMessage',
          messageId: lastBotAfterUser.message.id,
          message: regeneratedMessage,
        });
      } else {
        dispatch({ type: 'addMessage', message: regeneratedMessage });
      }

      dispatch({
        type: 'setSources',
        sources: regeneratedData.sources.map((s) => ({ id: s, title: s, type: 'reference' })),
      });
    } catch (error) {
      console.error('Regenerate API Error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: '⚠️ Sorry, I couldn\'t regenerate the response. Please try asking again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: lastUserMessage.contextType,
        metadata: lastUserMessage.metadata,
      };
      dispatch({ type: 'addMessage', message: errorMessage });
    } finally {
      dispatch({ type: 'setTyping', value: false });
    }
  };

  // Send escalation email after user review
  const handleSendEscalation = async () => {
    const draft = state.pendingEscalation;
    if (!draft) return;
    dispatch({ type: 'setTyping', value: true });
    try {
      await sendEscalationEmail({ escalationId: draft.escalationId, subject: draft.subject, body: draft.body, recipients: draft.recipients });
      // Show confirmation message in chat
      const confirmMsg: ChatMessage = {
        id: Date.now().toString(),
        content: `✅ Escalation email sent to ${draft.recipients.join(', ')}.`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'escalation',
      };
      dispatch({ type: 'addMessage', message: confirmMsg });
      dispatch({ type: 'clearPendingEscalation' });
    } catch (err) {
      toast({ title: 'Failed to send email', description: err instanceof Error ? err.message : String(err), variant: 'destructive' });
    } finally {
      dispatch({ type: 'setTyping', value: false });
    }
  };

  const handleConfirmSuggestedEscalation = () => {
    if (!state.suggestedEscalation) return;
    // Move suggested draft into pendingEscalation so the draft UI appears
    dispatch({ type: 'setPendingEscalation', draft: state.suggestedEscalation });
    dispatch({ type: 'clearSuggestedEscalation' });
  };

  const handleDeclineSuggestedEscalation = () => {
    dispatch({ type: 'clearSuggestedEscalation' });
    const declineMsg: ChatMessage = {
      id: Date.now().toString(),
      content: 'Okay — I will not escalate this question. Let me know if you want to escalate later.',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      contextType: 'escalation',
    };
    dispatch({ type: 'addMessage', message: declineMsg });
  };

  const handleUpdateDraftField = (field: 'subject' | 'body' | 'recipients', value: string) => {
    const current = state.pendingEscalation;
    if (!current) return;
    let updated = { ...current };
    if (field === 'recipients') {
      updated.recipients = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      (updated as any)[field] = value;
    }
    dispatch({ type: 'setPendingEscalation', draft: updated });
  };

  const filteredMessages = useMemo(() => {
    const query = state.searchQuery.trim().toLowerCase();
    if (!query) return state.messages;
    return state.messages.filter((message) => {
      const contentMatch = message.content.toLowerCase().includes(query);
      const highlightMatch = message.metadata?.highlightedText
        ? message.metadata.highlightedText.toLowerCase().includes(query)
        : false;
      return contentMatch || highlightMatch;
    });
  }, [state.messages, state.searchQuery]);

  const contextPills = useMemo(() => {
    const latest = state.lastHighlight;
    if (!latest) return [];

    const pills: Array<{ id: string; label: string; icon: React.ReactNode }> = [];
    if (latest.source === 'lesson' || latest.lessonId) {
      pills.push({
        id: 'lesson-context',
        label: latest.lessonId ? `Lesson: ${latest.lessonId}` : 'Lesson context',
        icon: <BookOpen className="w-3.5 h-3.5" />,
      });
    }
    if (latest.source === 'module' || latest.moduleId) {
      pills.push({
        id: 'module-context',
        label: latest.moduleId ? `Module: ${latest.moduleId}` : 'Module context',
        icon: <Layers className="w-3.5 h-3.5" />,
      });
    }
    return pills;
  }, [state.lastHighlight]);

  const canRegenerate = useMemo(
    () => state.messages.some((message) => message.sender === 'user') && !state.isTyping,
    [state.messages, state.isTyping]
  );

  const renderSource = (message: ChatMessage) => {
    if (!message.metadata?.highlightedText) return null;

    const sourceLabel = message.metadata.source
      ? `Source: ${message.metadata.source}`
      : 'Source: highlighted text';
    return (
      <div className="rounded-lg border border-border bg-background/60 p-2 mb-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          <span>{sourceLabel}</span>
        </div>
        <div className="mt-1 text-xs text-foreground">
          <span className="font-medium">"{message.metadata.highlightedText}"</span>
          {message.metadata.textContext && (
            <p className="mt-1 text-muted-foreground line-clamp-2">{message.metadata.textContext}</p>
          )}
        </div>
      </div>
    );
  };

  const renderMessageContent = (message: ChatMessage) => (
    <div className="space-y-2">
      {renderSource(message)}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className?.includes('language-');
            return isInline ? (
              <code
                className={cn('rounded bg-muted/70 px-1.5 py-0.5 text-[0.8rem] font-mono', className)}
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                <code className={cn('font-mono', className)} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 space-y-1">{children}</ol>;
          },
          p({ children }) {
            return <p className="leading-relaxed">{children}</p>;
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => dispatch({ type: 'open' })}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-float z-50 transition-transform hover:scale-105 bg-gradient-to-br from-primary to-primary/80 border border-primary/40',
          state.isOpen && 'hidden'
        )}
        title="Open learning assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <div
        className={cn(
          'fixed bottom-6 right-6 w-[390px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-88px)] bg-card/95 backdrop-blur rounded-2xl shadow-float border border-border z-50 flex flex-col overflow-hidden transition-all duration-300',
          state.isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-muted/45 to-muted/15 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Learning Assistant</h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Ready
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {contextPills.length > 0 ? (
                  contextPills.map((pill) => (
                    <span
                      key={pill.id}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                    >
                      {pill.icon}
                      {pill.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Use simple questions. I reply step by step.</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRegenerate}
                disabled={!canRegenerate}
                title="Regenerate latest AI response"
              >
                <RefreshCcw className={cn('w-4 h-4', state.isTyping && 'animate-spin')} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExportConversation} title="Download conversation JSON">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClearConversation}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatch({ type: 'close' })}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'setSearchQuery', value: e.target.value })}
                placeholder="Search chat"
                className="w-32 bg-transparent text-xs outline-none text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-background/95">
          {filteredMessages.length === 0 && state.searchQuery.trim() ? (
            <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground text-center">
              No messages match your search.
            </div>
          ) : (
            filteredMessages.map((message) => {
              return (
                <div
                  key={message.id}
                  className={cn('flex gap-3 animate-fade-in', message.sender === 'user' && 'flex-row-reverse')}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.sender === 'bot' ? 'bg-primary' : 'bg-secondary'
                    )}
                  >
                    {message.sender === 'bot' ? (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <User className="w-4 h-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[82%] rounded-2xl px-4 py-3 text-sm border shadow-sm',
                      message.sender === 'bot'
                        ? 'bg-muted/75 text-foreground border-border'
                        : 'bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-primary/40'
                    )}
                  >
                    <div className="mb-1 text-[11px] font-medium opacity-80">
                      {message.sender === 'bot' ? 'Assistant' : 'You'}
                    </div>
                    {renderMessageContent(message)}
                    <div
                      className={cn(
                        'mt-2 flex items-center gap-2 text-xs',
                        message.sender === 'bot' ? 'text-muted-foreground' : 'text-primary-foreground/80'
                      )}
                    >
                      <span className="font-medium">{formatTimestampForUI(message.timestamp)}</span>
                      {message.sender === 'bot' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-background/70"
                          onClick={() => handleCopy(message.content)}
                          title="Copy response"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {state.isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-primary-foreground animate-pulse" />
              </div>
              <div className="bg-muted/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-border/50 min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">Thinking...</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-background/95">
          {state.pendingEscalation && (
            <div className="mb-3 p-3 rounded-md border border-border bg-background">
              <div className="text-sm font-medium mb-1">Escalation draft — review before sending</div>
              <input
                className="w-full mb-2 px-2 py-1 border rounded"
                value={state.pendingEscalation.subject}
                onChange={(e) => handleUpdateDraftField('subject', e.target.value)}
                placeholder="Email subject"
              />
              <input
                className="w-full mb-2 px-2 py-1 border rounded"
                value={state.pendingEscalation.recipients.join(', ')}
                onChange={(e) => handleUpdateDraftField('recipients', e.target.value)}
                placeholder="Recipients (comma separated)"
              />
              <textarea
                className="w-full mb-2 px-2 py-1 border rounded min-h-[100px]"
                value={state.pendingEscalation.body}
                onChange={(e) => handleUpdateDraftField('body', e.target.value)}
                placeholder="Email body"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSendEscalation}>Send Escalation Email</Button>
                <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'clearPendingEscalation' })}>Cancel</Button>
              </div>
            </div>
          )}
          {/* Suggestion prompt shown when escalation is suggested but not yet confirmed */}
          {state.suggestedEscalation && !state.pendingEscalation && (
            <div className="mb-3 p-3 rounded-md border border-border bg-background flex items-center justify-between">
              <div className="text-sm">🔔 This question may require human review. Would you like to escalate it?</div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleConfirmSuggestedEscalation}>Yes</Button>
                <Button size="sm" variant="ghost" onClick={handleDeclineSuggestedEscalation}>No</Button>
              </div>
            </div>
          )}
          <p className="mb-2 text-xs text-muted-foreground">
            Keep chat safe: do not share personal details.
          </p>
          <div className="flex gap-2">
            <Input
              value={state.input}
              onChange={(e) => dispatch({ type: 'setInput', value: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Ask a simple learning question..."
              className="flex-1 rounded-xl"
              disabled={state.isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!state.input.trim() || state.isTyping}
              className="rounded-xl px-3"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
});

AIChatbot.displayName = 'AIChatbot';

export default AIChatbot;
