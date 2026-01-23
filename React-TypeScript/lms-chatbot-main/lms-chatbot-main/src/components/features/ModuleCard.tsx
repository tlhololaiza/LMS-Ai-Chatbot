import React from 'react';
import { ChevronRight, Lock, CheckCircle, PlayCircle, FileText, HelpCircle, ClipboardList } from 'lucide-react';
import { Module, Lesson } from '@/types/lms';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ModuleCardProps {
  module: Module;
  isExpanded?: boolean;
  onToggle?: () => void;
  onLessonClick?: (lesson: Lesson) => void;
}

const lessonTypeIcons = {
  video: PlayCircle,
  reading: FileText,
  quiz: HelpCircle,
  task: ClipboardList,
};

const ModuleCard: React.FC<ModuleCardProps> = ({ module, isExpanded, onToggle, onLessonClick }) => {
  const completedLessons = module.lessons.filter((l) => l.isCompleted).length;
  const progress = Math.round((completedLessons / module.lessons.length) * 100);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div
        className={cn(
          'card-elevated overflow-hidden transition-all',
          module.isLocked && 'opacity-60'
        )}
      >
        <CollapsibleTrigger className="w-full">
          <div className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                module.isCompleted
                  ? 'bg-success/10 text-success'
                  : module.isLocked
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {module.isLocked ? (
                <Lock className="w-5 h-5" />
              ) : module.isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{module.order}</span>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-medium truncate">{module.title}</h4>
              <p className="text-sm text-muted-foreground">
                {completedLessons}/{module.lessons.length} lessons • {progress}% complete
              </p>
            </div>
            <ChevronRight
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border">
            {module.lessons.map((lesson, index) => {
              const Icon = lessonTypeIcons[lesson.type];
              return (
                <div
                  key={lesson.id}
                  onClick={() => !module.isLocked && onLessonClick?.(lesson)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer',
                    index !== module.lessons.length - 1 && 'border-b border-border',
                    module.isLocked && 'cursor-not-allowed'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      lesson.isCompleted
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {lesson.isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {lesson.type} • {lesson.duration}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ModuleCard;
