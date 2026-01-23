import React from 'react';
import { Calendar, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/types/lms';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onSubmit?: (taskId: string) => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'status-badge-pending',
    icon: Clock,
  },
  submitted: {
    label: 'Submitted',
    className: 'status-badge-warning',
    icon: CheckCircle,
  },
  graded: {
    label: 'Graded',
    className: 'status-badge-success',
    icon: CheckCircle,
  },
  late: {
    label: 'Late',
    className: 'bg-destructive/10 text-destructive',
    icon: AlertCircle,
  },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onSubmit }) => {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  return (
    <div className="card-elevated p-4 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">{task.title}</h4>
            <span className={cn('status-badge', config.className)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
            {task.grade !== undefined && (
              <span className="font-medium text-success">
                Grade: {task.grade}%
              </span>
            )}
          </div>
          {task.submissionUrl && (
            <a
              href={task.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Submission
            </a>
          )}
          {task.feedback && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium mb-1">Feedback:</p>
              <p className="text-xs text-muted-foreground">{task.feedback}</p>
            </div>
          )}
        </div>
        {task.status === 'pending' && onSubmit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSubmit(task.id)}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
