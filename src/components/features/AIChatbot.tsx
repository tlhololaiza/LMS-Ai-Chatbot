import React, { useReducer, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChatMessage, ChatMessageMetadata } from '@/types/lms';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

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
}

type ChatAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'setInput'; value: string }
  | { type: 'addMessage'; message: ChatMessage }
  | { type: 'setTyping'; value: boolean }
  | { type: 'setHighlight'; value?: HighlightSourceInfo };

const initialState: ChatState = {
  isOpen: false,
  messages: initialMessages,
  input: '',
  isTyping: false,
  lastHighlight: undefined,
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
    case 'setTyping':
      return { ...state, isTyping: action.value };
    case 'setHighlight':
      return { ...state, lastHighlight: action.value };
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
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: generateExplanation(text, context),
          sender: 'bot',
          timestamp: new Date().toISOString(),
          contextType: 'explanation',
          metadata: highlightMetadata,
        };
        dispatch({ type: 'addMessage', message: botMessage });
        dispatch({ type: 'setTyping', value: false });
      }, 1000);
    },
    openChat: () => {
      dispatch({ type: 'open' });
    },
  }));

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) {
      return botResponses.react;
    }
    if (lowerMessage.includes('deadline') || lowerMessage.includes('due')) {
      return botResponses.deadline;
    }
    if (lowerMessage.includes('submit') || lowerMessage.includes('github')) {
      return botResponses.submit;
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      return botResponses.help;
    }
    return botResponses.default;
  };

  const handleSend = () => {
    if (!state.input.trim()) return;

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

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(state.input),
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };
      dispatch({ type: 'addMessage', message: botMessage });
      dispatch({ type: 'setTyping', value: false });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
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
          <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'close' })}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.messages.map((message) => (
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
                {renderMessageContent(message)}
              </div>
            </div>
          ))}
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
