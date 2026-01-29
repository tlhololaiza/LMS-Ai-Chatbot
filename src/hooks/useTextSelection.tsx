import { useState, useEffect, useCallback, RefObject } from 'react';

export interface TextSelectionPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextSelectionData {
  text: string;
  position: TextSelectionPosition | null;
  context: string; // Surrounding text for context
  isActive: boolean;
}

interface UseTextSelectionOptions {
  containerRef?: RefObject<HTMLElement>;
  minLength?: number; // Minimum characters to trigger selection
  contextLength?: number; // Characters to capture before/after selection
}

/**
 * Custom hook to detect and manage text selection within a container
 * Provides selected text, position, and surrounding context
 */
export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const { containerRef, minLength = 3, contextLength = 50 } = options;

  const [selection, setSelection] = useState<TextSelectionData>({
    text: '',
    position: null,
    context: '',
    isActive: false,
  });

  /**
   * Get the context (surrounding text) of the selection
   */
  const getSelectionContext = useCallback((selectedText: string, fullText: string): string => {
    const index = fullText.indexOf(selectedText);
    if (index === -1) return selectedText;

    const start = Math.max(0, index - contextLength);
    const end = Math.min(fullText.length, index + selectedText.length + contextLength);
    
    const before = start > 0 ? '...' : '';
    const after = end < fullText.length ? '...' : '';
    
    return before + fullText.substring(start, end) + after;
  }, [contextLength]);

  /**
   * Calculate the position of the selected text
   */
  const getSelectionPosition = useCallback((range: Range): TextSelectionPosition | null => {
    try {
      const rect = range.getBoundingClientRect();
      
      // Get scroll offsets
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      return {
        x: rect.left + scrollLeft + rect.width / 2, // Center of selection
        y: rect.top + scrollTop,
        width: rect.width,
        height: rect.height,
      };
    } catch (error) {
      console.warn('Error getting selection position:', error);
      return null;
    }
  }, []);

  /**
   * Handle text selection change
   */
  const handleSelectionChange = useCallback(() => {
    const windowSelection = window.getSelection();
    
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setSelection({
        text: '',
        position: null,
        context: '',
        isActive: false,
      });
      return;
    }

    const selectedText = windowSelection.toString().trim();
    
    // Check if selection meets minimum length requirement
    if (selectedText.length < minLength) {
      setSelection({
        text: '',
        position: null,
        context: '',
        isActive: false,
      });
      return;
    }

    // If containerRef is provided, check if selection is within container
    if (containerRef?.current) {
      const range = windowSelection.getRangeAt(0);
      const container = containerRef.current;
      
      // Check if the selection is within the specified container
      if (!container.contains(range.commonAncestorContainer)) {
        setSelection({
          text: '',
          position: null,
          context: '',
          isActive: false,
        });
        return;
      }
    }

    // Get the range and position
    const range = windowSelection.getRangeAt(0);
    const position = getSelectionPosition(range);

    // Get surrounding context
    const container = containerRef?.current || document.body;
    const fullText = container.innerText || '';
    const context = getSelectionContext(selectedText, fullText);

    setSelection({
      text: selectedText,
      position,
      context,
      isActive: true,
    });
  }, [containerRef, minLength, getSelectionPosition, getSelectionContext]);

  /**
   * Handle mouse up event (end of selection)
   */
  const handleMouseUp = useCallback(() => {
    // Small delay to ensure selection is finalized
    setTimeout(() => {
      handleSelectionChange();
    }, 10);
  }, [handleSelectionChange]);

  /**
   * Clear the current selection
   */
  const clearSelection = useCallback(() => {
    setSelection({
      text: '',
      position: null,
      context: '',
      isActive: false,
    });
    
    // Also clear browser selection
    const windowSelection = window.getSelection();
    if (windowSelection) {
      windowSelection.removeAllRanges();
    }
  }, []);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const container = containerRef?.current || document;

    // Listen for selection changes
    document.addEventListener('selectionchange', handleSelectionChange);
    
    // Listen for mouse up to detect end of selection
    container.addEventListener('mouseup', handleMouseUp);
    
    // Listen for touch end for mobile support
    container.addEventListener('touchend', handleMouseUp);

    // Cleanup function
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchend', handleMouseUp);
    };
  }, [containerRef, handleSelectionChange, handleMouseUp]);

  /**
   * Clear selection when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selection.isActive) {
        const clickedElement = event.target as HTMLElement;
        
        // Don't clear if clicking on the popup or selected text
        if (
          !clickedElement.closest('.explain-popup') &&
          !clickedElement.closest('.text-selection-highlight')
        ) {
          // Check if there's still actual text selected
          const windowSelection = window.getSelection();
          if (!windowSelection || windowSelection.toString().trim().length === 0) {
            clearSelection();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selection.isActive, clearSelection]);

  return {
    selection,
    clearSelection,
    isActive: selection.isActive,
  };
};

export default useTextSelection;
