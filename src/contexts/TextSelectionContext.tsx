import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { useTextSelection, TextSelectionData } from '@/hooks/useTextSelection';
import ExplainPopup from '@/components/features/ExplainPopup';

interface TextSelectionContextType {
  selection: TextSelectionData;
  clearSelection: () => void;
  sendToChatbot: (text: string, context?: string) => void;
  enableSelection: boolean;
  setEnableSelection: (enabled: boolean) => void;
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined);

interface TextSelectionProviderProps {
  children: ReactNode;
  onExplainText?: (text: string, context?: string) => void;
  enableByDefault?: boolean;
}

/**
 * Provider component that enables text selection detection across wrapped content
 * Shows ExplainPopup when text is selected and manages communication with chatbot
 */
export const TextSelectionProvider: React.FC<TextSelectionProviderProps> = ({
  children,
  onExplainText,
  enableByDefault = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enableSelection, setEnableSelection] = useState(enableByDefault);
  const { selection, clearSelection } = useTextSelection({
    containerRef,
    minLength: 3,
    contextLength: 100,
  });

  /**
   * Send selected text to chatbot for explanation
   */
  const sendToChatbot = useCallback(
    (text: string, context?: string) => {
      if (onExplainText) {
        onExplainText(text, context || selection.context);
      }
      clearSelection();
    },
    [onExplainText, selection.context, clearSelection]
  );

  /**
   * Handle Explain button click
   */
  const handleExplain = useCallback(
    (text: string) => {
      sendToChatbot(text, selection.context);
    },
    [sendToChatbot, selection.context]
  );

  const contextValue: TextSelectionContextType = {
    selection,
    clearSelection,
    sendToChatbot,
    enableSelection,
    setEnableSelection,
  };

  return (
    <TextSelectionContext.Provider value={contextValue}>
      <div ref={containerRef} className="relative">
        {children}
        
        {/* Show ExplainPopup when text is selected and feature is enabled */}
        {enableSelection && selection.isActive && (
          <ExplainPopup
            selectedText={selection.text}
            position={selection.position}
            isVisible={selection.isActive}
            onExplain={handleExplain}
            onClose={clearSelection}
          />
        )}
      </div>
    </TextSelectionContext.Provider>
  );
};

/**
 * Hook to access text selection context
 * Must be used within TextSelectionProvider
 */
export const useTextSelectionContext = () => {
  const context = useContext(TextSelectionContext);
  if (!context) {
    throw new Error('useTextSelectionContext must be used within TextSelectionProvider');
  }
  return context;
};

export default TextSelectionProvider;
