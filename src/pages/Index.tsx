
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import AIChatPanel from '../components/AIChatPanel';
import WorkArea from '../components/WorkArea';
import NavigationPanel from '../components/NavigationPanel';
import DemoBanner from '../components/DemoBanner';
import { DocumentProvider } from '../contexts/DocumentContext';

const Index = () => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);

  return (
    <DocumentProvider>
      <div className="min-h-screen bg-podcast-bg font-medium" dir="rtl">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Header */}
        <header className="bg-white border-b border-podcast-border px-4 py-3 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsNavigationVisible(!isNavigationVisible)}
                className="p-2 hover:bg-podcast-blue/10 rounded-lg transition-colors"
                title="فتح/إغلاق لوحة التنقل"
              >
                <Menu className="w-5 h-5 text-podcast-blue" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-podcast-blue leading-tight">Podcast360</h1>
                <p className="text-sm text-podcast-gray leading-relaxed">منصة إنتاج البودكاست بالذكاء الاصطناعي</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-podcast-gold/20 text-podcast-gold-dark px-3 py-1 rounded-full text-sm font-medium">
                MVP
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - AI Chat (Hidden on mobile) */}
          <div className="hidden md:block w-80 flex-shrink-0 p-4">
            <AIChatPanel />
          </div>

          {/* Center Panel - Work Area */}
          <div className="flex-1 p-4 min-w-0">
            <WorkArea />
          </div>

          {/* Right Panel - Navigation (Collapsible) */}
          {isNavigationVisible && (
            <div className="w-80 flex-shrink-0 p-4 hidden lg:block">
              <NavigationPanel
                isVisible={isNavigationVisible}
                onClose={() => setIsNavigationVisible(false)}
              />
            </div>
          )}

          {/* Mobile Navigation Overlay */}
          {isNavigationVisible && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/20" onClick={() => setIsNavigationVisible(false)}>
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] p-4" onClick={(e) => e.stopPropagation()}>
                <NavigationPanel
                  isVisible={isNavigationVisible}
                  onClose={() => setIsNavigationVisible(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DocumentProvider>
  );
};

export default Index;
