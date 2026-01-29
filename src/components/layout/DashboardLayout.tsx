import React, { useState, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChatbot, { AIChatbotRef } from '@/components/features/AIChatbot';
import { TextSelectionProvider } from '@/contexts/TextSelectionContext';
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const chatbotRef = useRef<AIChatbotRef>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Handle text explanation requests from TextSelectionProvider
   */
  const handleExplainText = (text: string, context?: string) => {
    chatbotRef.current?.explainText(text, context);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:pl-64 min-h-screen">
        <TextSelectionProvider onExplainText={handleExplainText}>
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            <Outlet />
          </div>
        </TextSelectionProvider>
      </main>

      <AIChatbot ref={chatbotRef} />
    </div>
  );
};

export default DashboardLayout;
