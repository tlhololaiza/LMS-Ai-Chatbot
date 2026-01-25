import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/lms';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: "Hello! I'm your learning assistant. How can I help you today? I can answer questions about your courses, help with technical concepts, or guide you through the platform.",
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const botResponses: Record<string, string> = {
  default: "I'm here to help! You can ask me about your courses, deadlines, or any technical questions. Try asking about React, JavaScript, or how to submit your tasks.",
  react: "React is a JavaScript library for building user interfaces. In your current module, you're learning about components, props, and hooks. Would you like me to explain any of these concepts in more detail?",
  deadline: "Your upcoming deadlines:\n• React Todo App - Feb 15\n• Data Visualization Dashboard - Feb 20\n\nWould you like help getting started on any of these?",
  submit: "To submit a task:\n1. Go to the Tasks section\n2. Find your assignment\n3. Click 'Submit Task'\n4. Paste your GitHub repository link\n5. Click Submit\n\nMake sure your repo is public so facilitators can review it!",
  help: "Here are some things I can help with:\n• Explain technical concepts\n• Guide you through the platform\n• Answer questions about your courses\n• Provide study tips and resources\n\nWhat would you like to know?",
};

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-float z-50 transition-transform hover:scale-105',
          isOpen && 'hidden'
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-card rounded-xl shadow-float border border-border z-50 flex flex-col overflow-hidden transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Learning Assistant</h3>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.sender === 'user' && 'flex-row-reverse'
              )}
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
                  'max-w-[75%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line',
                  message.sender === 'bot'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
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

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
