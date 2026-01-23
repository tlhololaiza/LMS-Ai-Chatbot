import React from 'react';
import { Lesson } from '@/types/lms';
import { X, PlayCircle, FileText, HelpCircle, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LessonViewerProps {
  lesson: Lesson;
  moduleName: string;
  onClose: () => void;
  onMarkComplete?: (lessonId: string) => void;
}

const lessonTypeIcons = {
  video: PlayCircle,
  reading: FileText,
  quiz: HelpCircle,
  task: ClipboardList,
};

const lessonTypeLabels = {
  video: 'Video Lesson',
  reading: 'Reading Material',
  quiz: 'Quiz',
  task: 'Practice Task',
};

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, moduleName, onClose, onMarkComplete }) => {
  const Icon = lessonTypeIcons[lesson.type];

  // Simple markdown-like content renderer
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    lines.forEach((line, index) => {
      // Code block handling
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = '';
        } else {
          elements.push(
            <pre key={`code-${index}`} className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm font-mono text-foreground">{codeContent.trim()}</code>
            </pre>
          );
          inCodeBlock = false;
          codeContent = '';
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold mt-5 mb-2 text-foreground">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-base font-semibold mt-4 mb-2 text-foreground">
            {line.slice(5)}
          </h4>
        );
      }
      // Bullet points
      else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 text-muted-foreground list-disc">
            {renderInlineCode(line.slice(2))}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\. /.test(line)) {
        const content = line.replace(/^\d+\. /, '');
        elements.push(
          <li key={index} className="ml-4 text-muted-foreground list-decimal">
            {renderInlineCode(content)}
          </li>
        );
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 my-3 bg-primary/5 rounded-r-lg">
            <p className="text-muted-foreground italic">{line.slice(2)}</p>
          </blockquote>
        );
      }
      // Regular paragraphs
      else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="text-muted-foreground my-2 leading-relaxed">
            {renderInlineCode(line)}
          </p>
        );
      }
      // Empty lines
      else {
        elements.push(<div key={index} className="h-2" />);
      }
    });

    return elements;
  };

  // Render inline code and bold text
  const renderInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-8 lg:inset-12 bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              lesson.isCompleted ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
            )}>
              {lesson.isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{moduleName}</p>
              <h1 className="text-xl font-semibold">{lesson.title}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  {lessonTypeLabels[lesson.type]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {lesson.content ? (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {renderContent(lesson.content)}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">Content coming soon</h3>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  This lesson content is being prepared and will be available shortly.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            {lesson.isCompleted ? (
              <span className="flex items-center gap-2 text-success text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            ) : (
              <Button 
                onClick={() => onMarkComplete?.(lesson.id)}
                className="bg-primary hover:bg-primary/90"
              >
                Mark as Complete
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
