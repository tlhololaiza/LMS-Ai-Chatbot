import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TextSelectionPosition } from '@/hooks/useTextSelection';

export interface ExplainPopupProps {
  /** The selected text to explain */
  selectedText: string;
  /** Position data for the popup */
  position: TextSelectionPosition | null;
  /** Whether the popup should be visible */
  isVisible: boolean;
  /** Callback when user clicks the Explain button */
  onExplain: (text: string) => void;
  /** Callback when popup is closed */
  onClose: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Floating popup component that appears near selected text
 * Shows an "Explain" button to send text to AI chatbot
 */
const ExplainPopup: React.FC<ExplainPopupProps> = ({
  selectedText,
  position,
  isVisible,
  onExplain,
  onClose,
  className,
}) => {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  /**
   * Calculate optimal popup position to avoid overflow
   */
  useEffect(() => {
    if (!position || !isVisible || !popupRef.current) return;

    const popup = popupRef.current;
    const popupRect = popup.getBoundingClientRect();
    
    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Desired position (above selected text, centered)
    let top = position.y - popupRect.height - 10; // 10px gap above selection
    let left = position.x - popupRect.width / 2;

    // Prevent horizontal overflow
    if (left < 10) {
      left = 10; // 10px from left edge
    } else if (left + popupRect.width > viewportWidth - 10) {
      left = viewportWidth - popupRect.width - 10; // 10px from right edge
    }

    // If popup would overflow top, show below selection instead
    if (top < 10) {
      top = position.y + position.height + 10; // 10px gap below selection
    }

    // Prevent vertical overflow at bottom
    if (top + popupRect.height > viewportHeight - 10) {
      top = viewportHeight - popupRect.height - 10;
    }

    setPopupPosition({ top, left });
  }, [position, isVisible]);

  /**
   * Trigger animation when visibility changes
   */
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      // Delay unmounting to allow fade-out animation
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  /**
   * Handle Explain button click
   */
  const handleExplainClick = () => {
    onExplain(selectedText);
    onClose();
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close
      if (e.key === 'Escape') {
        onClose();
      }
      // Enter key to explain
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        onExplain(selectedText);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, selectedText, onClose, onExplain]);

  // Don't render if not visible and not animating
  if (!isVisible && !isAnimating) return null;

  return (
    <div
      ref={popupRef}
      className={cn(
        'explain-popup fixed z-[100] bg-card border border-border rounded-lg shadow-float p-2',
        'transition-all duration-200 ease-out',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        className
      )}
      style={{
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
      }}
      onClick={(e) => e.stopPropagation()} // Prevent click-outside from closing immediately
    >
      <div className="flex items-center gap-2">
        {/* Explain Button */}
        <Button
          size="sm"
          onClick={handleExplainClick}
          className="gap-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Explain</span>
        </Button>

        {/* Show selected text preview if short enough */}
        {selectedText.length <= 30 && (
          <span className="text-xs text-muted-foreground max-w-[150px] truncate px-2">
            "{selectedText}"
          </span>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-auto"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="text-[10px] text-muted-foreground text-center mt-1 px-2">
        Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] border border-border">Enter</kbd> or{' '}
        <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] border border-border">Esc</kbd>
      </div>

      {/* Tooltip Arrow */}
      <div
        className={cn(
          'absolute w-3 h-3 bg-card border-border rotate-45',
          'border-l border-b -bottom-1.5 left-1/2 -translate-x-1/2'
        )}
        style={{
          boxShadow: '2px 2px 4px rgba(0,0,0,0.05)',
        }}
      />
    </div>
  );
};

export default ExplainPopup;
