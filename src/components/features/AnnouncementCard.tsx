import React from 'react';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Announcement } from '@/types/lms';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AnnouncementCardProps {
  announcement: Announcement;
  compact?: boolean;
}

const priorityConfig = {
  normal: {
    icon: Info,
    className: 'text-muted-foreground',
    bgClassName: 'bg-muted/50',
  },
  important: {
    icon: AlertCircle,
    className: 'text-primary',
    bgClassName: 'bg-primary/5',
  },
  urgent: {
    icon: AlertTriangle,
    className: 'text-warning',
    bgClassName: 'bg-warning/10',
  },
};

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  compact = false,
}) => {
  const config = priorityConfig[announcement.priority];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'card-elevated p-4 transition-colors',
        config.bgClassName,
        !announcement.isRead && 'border-l-4 border-l-primary'
      )}
    >
      <div className="flex gap-3">
        <div className={cn('mt-0.5', config.className)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm">{announcement.title}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(announcement.createdAt), 'MMM d')}
            </span>
          </div>
          {!compact && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {announcement.content}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {announcement.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
