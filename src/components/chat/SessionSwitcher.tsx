
import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { sessionManager, SessionKey } from '../../utils/sessionManager';
import { useDocumentContext } from '../../contexts/DocumentContext';

interface SessionSwitcherProps {
  currentSessionKey: SessionKey | null;
  onSessionSwitch: (sessionKey: SessionKey) => void;
  getCurrentSessionName: () => string;
}

const SessionSwitcher: React.FC<SessionSwitcherProps> = ({
  currentSessionKey,
  onSessionSwitch,
  getCurrentSessionName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeDocument } = useDocumentContext();

  const availableSessions: SessionKey[] = [
    { documentId: activeDocument?.id || '', sectionKey: 'concept' },
    { documentId: activeDocument?.id || '', sectionKey: 'preparation' },
    { documentId: activeDocument?.id || '', sectionKey: 'script' },
    { documentId: activeDocument?.id || '', sectionKey: 'global' }
  ];

  const getSessionStats = (sessionKey: SessionKey) => {
    const messages = sessionManager.getMessages(sessionKey);
    const lastMessage = messages[messages.length - 1];
    return {
      messageCount: messages.length,
      lastActivity: lastMessage?.timestamp || null
    };
  };

  const formatLastActivity = (timestamp: string | null) => {
    if (!timestamp) return 'لا توجد رسائل';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    if (diffMinutes < 1440) return `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
  };

  if (!activeDocument) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-podcast-gold/20 text-podcast-gold-dark px-3 py-1 rounded-full text-sm font-medium hover:bg-podcast-gold/30 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span>جلسة: {getCurrentSessionName()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-podcast-border rounded-lg shadow-lg z-20 min-w-80">
            <div className="p-3 border-b border-podcast-border">
              <h3 className="font-bold text-sm text-podcast-gray text-right">تبديل الجلسة</h3>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {availableSessions.map((sessionKey) => {
                const stats = getSessionStats(sessionKey);
                const isActive = currentSessionKey?.sectionKey === sessionKey.sectionKey;
                const displayName = sessionManager.getSectionDisplayName(sessionKey.sectionKey);
                
                return (
                  <button
                    key={sessionKey.sectionKey}
                    onClick={() => {
                      onSessionSwitch(sessionKey);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      isActive ? 'bg-podcast-blue/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isActive && <ArrowRight className="w-3 h-3 text-podcast-blue" />}
                        <Clock className="w-3 h-3 text-podcast-gray" />
                        <span className="text-xs text-podcast-gray">
                          {formatLastActivity(stats.lastActivity)}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-medium ${isActive ? 'text-podcast-blue' : 'text-podcast-gray'}`}>
                          {displayName}
                        </div>
                        <div className="text-xs text-podcast-gray">
                          {stats.messageCount} رسالة
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionSwitcher;
