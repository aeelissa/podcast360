import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Loader2, Settings } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import { useDocumentContext } from '../contexts/DocumentContext';
import { contentInsertionService } from '../services/contentInsertionService';
import { aiResponseProcessor } from '../services/aiResponseProcessor';
import InsertionPreviewModal from './InsertionPreviewModal';
import SessionSwitcher from './chat/SessionSwitcher';
import SessionMigrationModal from './chat/SessionMigrationModal';
import EnhancedMessageDisplay from './chat/EnhancedMessageDisplay';
import { sessionManager } from '../utils/sessionManager';
import { ChatMessage } from '../types/chat';

const AIChatPanel = () => {
  const [inputValue, setInputValue] = useState('');
  const [insertionModal, setInsertionModal] = useState<{
    isOpen: boolean;
    content: string;
  }>({ isOpen: false, content: '' });
  const [migrationModal, setMigrationModal] = useState<{
    isOpen: boolean;
    message: ChatMessage | null;
  }>({ isOpen: false, message: null });
  const [showSessionSettings, setShowSessionSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  
  const { 
    messages, 
    isLoading, 
    chatMode, 
    setChatMode, 
    sendMessage, 
    applyToDocument, 
    saveAsNoteAction,
    getCurrentSessionName,
    currentSessionKey,
    copyMessageToSession,
    switchSession,
    autoSwitchEnabled,
    toggleAutoSwitch
  } = useAIChat();

  const { activeDocument } = useDocumentContext();

  // Auto-scroll to bottom when new messages arrive (but not if user scrolled up)
  useEffect(() => {
    if (!userScrolledUp && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, userScrolledUp]);

  // Handle scroll detection to determine if user scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolledUp(!isNearBottom);
    }
  };

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      setUserScrolledUp(false); // Reset scroll state when sending new message
      await sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyToDocument = (content: string) => {
    if (!contentInsertionService.isReady()) {
      console.warn('Content insertion service not ready');
      applyToDocument(content);
      return;
    }

    setInsertionModal({ isOpen: true, content });
  };

  const handleConfirmInsertion = async () => {
    const result = await contentInsertionService.insertContent(insertionModal.content);
    
    if (result.success) {
      console.log('Content inserted successfully:', result.message);
    } else {
      console.error('Content insertion failed:', result.message);
      applyToDocument(insertionModal.content);
    }
  };

  const handleSaveAsNote = (content: string) => {
    saveAsNoteAction(content);
    console.log('Saved as note:', content);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      console.log('Message copied to clipboard');
    });
  };

  const handleMigrateMessage = (message: ChatMessage) => {
    setMigrationModal({ isOpen: true, message });
  };

  const handleMigrationComplete = () => {
    if (currentSessionKey) {
      const updatedMessages = sessionManager.getMessages(currentSessionKey);
      console.log('Migration completed, messages updated');
    }
  };

  const handleEnhancedAction = (actionType: string, content: string) => {
    const context = {
      documentType: activeDocument?.type,
      currentSection: getCurrentSessionName(),
    };

    const processedResponse = aiResponseProcessor.processResponse(content, context);
    
    switch (actionType) {
      case 'insert-at-cursor':
        handleApplyToDocument(processedResponse.formattedContent);
        break;
      case 'append-to-section':
        contentInsertionService.setInsertionMode('append');
        handleApplyToDocument(processedResponse.formattedContent);
        break;
      case 'create-new-section':
        const sectionContent = `\n\n## قسم جديد\n\n${processedResponse.formattedContent}`;
        handleApplyToDocument(sectionContent);
        break;
      case 'replace-selection':
        handleApplyToDocument(processedResponse.formattedContent);
        break;
      default:
        handleApplyToDocument(content);
    }
  };

  return (
    <>
      <div className="podcast-panel h-full flex flex-col">
        {/* Enhanced Header with Session Management */}
        <div className="podcast-header px-4 py-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h2 className="font-bold text-right">الدردشة مع الذكاء الاصطناعي</h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Session Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSessionSettings(!showSessionSettings)}
                  className="p-2 hover:bg-podcast-gold/20 rounded-full transition-colors"
                  title="إعدادات الجلسة"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                {showSessionSettings && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowSessionSettings(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 bg-white border border-podcast-border rounded-lg shadow-lg z-20 min-w-48">
                      <div className="p-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={autoSwitchEnabled}
                            onChange={toggleAutoSwitch}
                            className="rounded"
                          />
                          <span className="text-right">تبديل تلقائي للجلسات</span>
                        </label>
                        <p className="text-xs text-podcast-gray mt-1 text-right">
                          تبديل الجلسة تلقائياً عند تغيير القسم
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Session Switcher */}
              <SessionSwitcher
                currentSessionKey={currentSessionKey}
                onSessionSwitch={switchSession}
                getCurrentSessionName={getCurrentSessionName}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Chat Messages with auto-scroll */}
        <div className="flex-1 overflow-hidden relative">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto p-4 scroll-smooth"
            onScroll={handleScroll}
          >
            <div className="space-y-4" dir="rtl">
              {messages.length === 0 && (
                <div className="text-center text-podcast-gray py-8">
                  <p className="text-sm">ابدأ محادثة مع الذكاء الاصطناعي لمساعدتك في إنتاج البودكاست</p>
                  <p className="text-xs mt-2 opacity-75">
                    الجلسة الحالية: {getCurrentSessionName()}
                  </p>
                  {!autoSwitchEnabled && (
                    <p className="text-xs mt-1 text-podcast-gold-dark">
                      التبديل التلقائي للجلسات معطل
                    </p>
                  )}
                </div>
              )}
              
              {messages.map((message, index) => {
                const processedResponse = message.role === 'assistant' 
                  ? aiResponseProcessor.processResponse(message.content, {
                      documentType: activeDocument?.type,
                      currentSection: getCurrentSessionName(),
                    })
                  : undefined;

                return (
                  <EnhancedMessageDisplay
                    key={message.id}
                    message={message}
                    processedResponse={processedResponse}
                    onAction={handleEnhancedAction}
                    onCopy={handleCopyMessage}
                    onMigrate={handleMigrateMessage}
                    isLatest={index === messages.length - 1 && !isLoading}
                  />
                );
              })}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="bg-gray-50 ml-8 border border-gray-200 rounded-xl p-4">
                  <div className="text-sm font-bold mb-2 text-podcast-gray text-right">AI</div>
                  <div className="flex items-center gap-2 text-podcast-gray">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">جاري الكتابة...</span>
                  </div>
                </div>
              )}
              
              {/* Auto-scroll target */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Scroll shadows */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>

        {/* Input Area with RTL support */}
        <div className="p-4 border-t border-podcast-border">
          <div className="flex gap-2" dir="rtl">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="podcast-input flex-1 text-right"
              dir="rtl"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="podcast-button p-3"
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Insertion Preview Modal */}
      <InsertionPreviewModal
        isOpen={insertionModal.isOpen}
        onClose={() => setInsertionModal({ isOpen: false, content: '' })}
        content={insertionModal.content}
        onConfirm={handleConfirmInsertion}
      />

      {/* Session Migration Modal */}
      <SessionMigrationModal
        isOpen={migrationModal.isOpen}
        onClose={() => setMigrationModal({ isOpen: false, message: null })}
        message={migrationModal.message}
        currentSessionKey={currentSessionKey}
        onMigrationComplete={handleMigrationComplete}
      />
    </>
  );
};

export default AIChatPanel;
