import React, { useReducer, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Layers,
  Copy,
  RefreshCcw,
  Search,
  Trash2,
  Download,
  Pencil,
  Check,
  BookMarked,
  Link2,
} from 'lucide-react';
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

// Frontend logQuery: send to backend API
function logQuery(query: string, category: string) {
  fetch('http://localhost:4000/api/log-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, category }),
  }).catch(() => {/* ignore errors for now */});
}

// Frontend logResponseOutcome: send success/failure + metadata to backend API
function logResponseOutcome(
  category: 'explanation' | 'general',
  outcome: 'success' | 'failure',
  options?: { queryId?: string; responseTimeMs?: number; model?: string; error?: string }
) {
  fetch('http://localhost:4000/api/log-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, outcome, ...options }),
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
      "Hello! I'm your learning assistant. How can I help you today? I can answer questions about your courses, help with technical concepts, or guide you through the platform.",
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
  editingMessageId?: string;
  editingContent: string;
  searchQuery: string;
  sourceSuggestions: Array<{ id: string; title: string; type: string }>;
}

type ChatAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'setInput'; value: string }
  | { type: 'addMessage'; message: ChatMessage }
  | { type: 'updateMessage'; messageId: string; content: string }
  | { type: 'setTyping'; value: boolean }
  | { type: 'setHighlight'; value?: HighlightSourceInfo }
  | { type: 'startEdit'; messageId: string; content: string }
  | { type: 'cancelEdit' }
  | { type: 'setEditingContent'; value: string }
  | { type: 'setSearchQuery'; value: string }
  | { type: 'clearMessages' }
  | { type: 'setSources'; sources: Array<{ id: string; title: string; type: string }> };

const initialState: ChatState = {
  isOpen: false,
  messages: initialMessages,
  input: '',
  isTyping: false,
  lastHighlight: undefined,
  editingMessageId: undefined,
  editingContent: '',
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
    case 'updateMessage':
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.messageId ? { ...message, content: action.content } : message
        ),
      };
    case 'setTyping':
      return { ...state, isTyping: action.value };
    case 'setHighlight':
      return { ...state, lastHighlight: action.value };
    case 'startEdit':
      return { ...state, editingMessageId: action.messageId, editingContent: action.content };
    case 'cancelEdit':
      return { ...state, editingMessageId: undefined, editingContent: '' };
    case 'setEditingContent':
      return { ...state, editingContent: action.value };
    case 'setSearchQuery':
      return { ...state, searchQuery: action.value };
    case 'setSources':
      return { ...state, sourceSuggestions: action.sources };
    case 'clearMessages':
      return {
        ...state,
        messages: initialMessages,
        lastHighlight: undefined,
        editingMessageId: undefined,
        editingContent: '',
        sourceSuggestions: [],
      };
    default:
      return state;
  }
};

const AIChatbot = forwardRef<AIChatbotRef>((props, ref) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useImperativeHandle(ref, () => ({
    explainText: (text: string, context?: string, metadata?: Partial<ChatMessageMetadata>) => {
  // Log the query text and category (always 'explanation' here)
  logQuery(text, 'explanation');
      const startTs = performance.now();
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

      setTimeout(() => {
        const prompt = buildExplanationPrompt(text, context, highlightMetadata);
        let response = `Great question! Let me explain "${text}".\n\nQUICK OVERVIEW:\nThis is important to your learning journey.\n\nDETAILED EXPLANATION:\nUnderstanding "${text}" will help you progress.\n\nKEY TAKEAWAY:\n- Fundamental concept\n- Practice with materials\n- Apply in assignments\n\nWant me to elaborate?`;
        response = enhanceResponseWithCitations(response, prompt.citations);
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
        dispatch({ type: 'setTyping', value: false });

        const endTs = performance.now();
        logResponseOutcome('explanation', 'success', {
          responseTimeMs: Math.round(endTs - startTs),
          model: 'simulated-bot',
        });
      }, 1000);
    },
    openChat: () => {
      dispatch({ type: 'open' });
    },
  }));

  const getBotResponse = (message: string, metadata?: Partial<ChatMessageMetadata>): { content: string; sources: string[] } => {
    const prompt = buildContextAwarePrompt(message, metadata);
    let response = '';
    if (message.toLowerCase().includes('react') || message.toLowerCase().includes('component')) {
      response = 'React is a JavaScript library for building UIs. Ask about components, props, or hooks?';
    } else if (message.toLowerCase().includes('deadline')) {
      response = 'Upcoming deadlines:\n• React Todo App - Feb 15\n• Data Dashboard - Feb 20';
    } else {
      response = 'I am here to help! Ask about courses or technical questions.';
    }
    response = enhanceResponseWithCitations(response, prompt.citations);
    return { content: response, sources: prompt.citations.map((c) => c.sourceId) };
  };

  const handleSend = () => {
    if (!state.input.trim()) return;

  // Log the query text and category (general)
  logQuery(state.input, 'general');
    const startTs = performance.now();

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
    setTimeout(() => {
      const { content, sources } = getBotResponse(userInput, state.lastHighlight);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };
      dispatch({ type: 'addMessage', message: botMessage });
      dispatch({ type: 'setSources', sources: sources.map((s) => ({ id: s, title: s, type: 'reference' })) });
      dispatch({ type: 'setTyping', value: false });

      const endTs = performance.now();
      logResponseOutcome('general', 'success', {
        responseTimeMs: Math.round(endTs - startTs),
        model: 'simulated-bot',
      });
    }, 1000);
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

  const handleExportConversation = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      messages: state.messages,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...state.messages].reverse().find((message) => message.sender === 'user');
    if (!lastUserMessage) return;

    dispatch({ type: 'setTyping', value: true });

    setTimeout(() => {
      let regeneratedData: { content: string; sources: string[] };
      
      if (lastUserMessage.metadata?.highlightedText) {
        const prompt = buildExplanationPrompt(
          lastUserMessage.metadata.highlightedText,
          lastUserMessage.metadata.textContext,
          lastUserMessage.metadata
        );
        let response = `Great! Let me re-explain "${lastUserMessage.metadata.highlightedText}".\n\nHere is more detail on this concept.\n\nNeed clarification?`;
        response = enhanceResponseWithCitations(response, prompt.citations);
        regeneratedData = { content: response, sources: prompt.citations.map((c) => c.sourceId) };
      } else {
        regeneratedData = getBotResponse(lastUserMessage.content, lastUserMessage.metadata);
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        content: regeneratedData.content,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: lastUserMessage.contextType,
        metadata: lastUserMessage.metadata,
      };
      dispatch({ type: 'addMessage', message: botMessage });
      dispatch({
        type: 'setSources',
        sources: regeneratedData.sources.map((s) => ({ id: s, title: s, type: 'reference' })),
      });
      dispatch({ type: 'setTyping', value: false });

      logResponseOutcome((lastUserMessage.contextType as 'explanation'|'general') ?? 'general', 'success', {
        model: 'simulated-bot',
      });
    }, 1000);
  };

  const handleStartEdit = (message: ChatMessage) => {
    dispatch({ type: 'startEdit', messageId: message.id, content: message.content });
  };

  const handleSaveEdit = () => {
    if (!state.editingMessageId) return;
    dispatch({ type: 'updateMessage', messageId: state.editingMessageId, content: state.editingContent });
    dispatch({ type: 'cancelEdit' });
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
          code({ inline, className, children, ...props }) {
            return inline ? (
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
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-float z-50 transition-transform hover:scale-105',
          state.isOpen && 'hidden'
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <div
        className={cn(
          'fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-card rounded-xl shadow-float border border-border z-50 flex flex-col overflow-hidden transition-all duration-300',
          state.isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Learning Assistant</h3>
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
                  <span className="text-xs text-muted-foreground">Always here to help</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRegenerate}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExportConversation}>
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
                placeholder="Search"
                className="w-28 bg-transparent text-xs outline-none text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 && state.searchQuery.trim() ? (
            <div className="text-xs text-muted-foreground">No messages match your search.</div>
          ) : (
            filteredMessages.map((message) => {
              const isEditing = state.editingMessageId === message.id;
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
                      'max-w-[75%] rounded-xl px-4 py-2.5 text-sm',
                      message.sender === 'bot' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                    )}
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={state.editingContent}
                          onChange={(e) => dispatch({ type: 'setEditingContent', value: e.target.value })}
                          className="bg-background text-foreground"
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="secondary" onClick={handleSaveEdit}>
                            <Check className="w-4 h-4" />
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'cancelEdit' })}>
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      renderMessageContent(message)
                    )}
                    {!isEditing && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        {message.sender === 'bot' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopy(message.content)}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleStartEdit(message)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {state.isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-subtle" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-subtle [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-subtle [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={state.input}
              onChange={(e) => dispatch({ type: 'setInput', value: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!state.input.trim()}>
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
