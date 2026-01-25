import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  progress: number;
  subtitle?: string;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  progress,
  subtitle,
  className,
}) => {
  return (
    <div className={cn('card-elevated p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm truncate pr-2">{title}</h4>
        <span className="text-sm font-semibold text-primary">{progress}%</span>
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      )}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressCard;
