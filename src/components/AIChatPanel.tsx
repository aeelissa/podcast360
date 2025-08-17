import React, { useState } from 'react';
import { MessageCircle, Send, Loader2, Copy, ArrowRight, MoreVertical, Settings } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import { useDocumentContext } from '../contexts/DocumentContext';
import { contentInsertionService } from '../services/contentInsertionService';
import InsertionPreviewModal from './InsertionPreviewModal';
import SessionSwitcher from './chat/SessionSwitcher';
import SessionMigrationModal from './chat/SessionMigrationModal';
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

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
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
      applyToDocument(content); // Fallback to original method
      return;
    }

    setInsertionModal({ isOpen: true, content });
  };

  const handleConfirmInsertion = async () => {
    const result = await contentInsertionService.insertContent(insertionModal.content);
    
    if (result.success) {
      console.log('Content inserted successfully:', result.message);
      // Show success feedback - could be enhanced with toast notifications
    } else {
      console.error('Content insertion failed:', result.message);
      // Fallback to original method
      applyToDocument(insertionModal.content);
    }
  };

  const handleSaveAsNote = (content: string) => {
    saveAsNoteAction(content);
    console.log('Saved as note:', content);
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    // For now, just copy to clipboard and show feedback
    navigator.clipboard.writeText(content).then(() => {
      console.log('Message copied to clipboard');
    });
  };

  const handleMigrateMessage = (message: ChatMessage) => {
    setMigrationModal({ isOpen: true, message });
  };

  const handleMigrationComplete = () => {
    // Refresh messages to reflect any changes
    if (currentSessionKey) {
      const updatedMessages = sessionManager.getMessages(currentSessionKey);
      // Note: This would ideally be handled by the useAIChat hook
      console.log('Migration completed, messages updated');
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

        {/* Chat Messages with enhanced message actions */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto p-4 scroll-smooth">
            <div className="space-y-4">
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
              
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div
                    className={`rounded-xl p-4 ${
                      message.role === 'user' 
                        ? 'bg-podcast-blue/10 mr-8' 
                        : 'bg-gray-50 ml-8 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-bold text-podcast-gray text-right">
                        {message.role === 'user' ? 'المُنتِج' : 'AI'}
                      </div>
                      
                      {/* Enhanced Message Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="p-1 hover:bg-podcast-blue/10 rounded text-podcast-gray hover:text-podcast-blue transition-colors"
                          title="نسخ الرسالة"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleMigrateMessage(message)}
                          className="p-1 hover:bg-podcast-gold/10 rounded text-podcast-gray hover:text-podcast-gold-dark transition-colors"
                          title="نقل إلى جلسة أخرى"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm leading-relaxed text-right whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                  
                  {message.role === 'assistant' && index === messages.length - 1 && !isLoading && (
                    <div className="flex gap-2 mt-3 mr-8 justify-end flex-wrap">
                      <button
                        onClick={() => handleApplyToDocument(message.content)}
                        className="bg-podcast-blue/10 hover:bg-podcast-blue/20 text-podcast-blue px-4 py-2 rounded-full text-sm transition-colors font-medium flex items-center gap-1"
                        title="معاينة وإدراج المحتوى في المحرر"
                      >
                        <ArrowRight className="w-3 h-3" />
                        معاينة وإدراج
                      </button>
                      
                      <button
                        onClick={() => handleSaveAsNote(message.content)}
                        className="bg-podcast-gold/10 hover:bg-podcast-gold/20 text-podcast-gold-dark px-4 py-2 rounded-full text-sm transition-colors font-medium"
                      >
                        حفظ كملاحظة
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
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
            </div>
          </div>
          
          {/* Scroll shadows */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>

        {/* Mode Toggle Above Input */}
        <div className="px-4 pb-3 border-t border-podcast-border pt-4">
          <div className="flex items-center gap-6 justify-center text-sm">
            <button
              onClick={() => setChatMode('document')}
              className="flex items-center gap-2 text-podcast-gray hover:text-podcast-blue transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                chatMode === 'document' 
                  ? 'border-podcast-blue bg-podcast-blue' 
                  : 'border-podcast-gray'
              }`}>
                {chatMode === 'document' && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium">تطبيق على الوثيقة</span>
            </button>
            
            <button
              onClick={() => setChatMode('note')}
              className="flex items-center gap-2 text-podcast-gray hover:text-podcast-blue transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                chatMode === 'note' 
                  ? 'border-podcast-blue bg-podcast-blue' 
                  : 'border-podcast-gray'
              }`}>
                {chatMode === 'note' && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium">حفظ كملاحظة</span>
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-podcast-border">
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              className="podcast-button p-3"
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
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
