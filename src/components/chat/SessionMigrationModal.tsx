
import React, { useState } from 'react';
import { X, ArrowRight, MessageSquare, Check } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { sessionManager, SessionKey } from '../../utils/sessionManager';
import { useDocumentContext } from '../../contexts/DocumentContext';

interface SessionMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  currentSessionKey: SessionKey | null;
  onMigrationComplete: () => void;
}

const SessionMigrationModal: React.FC<SessionMigrationModalProps> = ({
  isOpen,
  onClose,
  message,
  currentSessionKey,
  onMigrationComplete
}) => {
  const [selectedTargetSession, setSelectedTargetSession] = useState<SessionKey | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { activeDocument } = useDocumentContext();

  const availableTargetSessions: SessionKey[] = [
    { documentId: activeDocument?.id || '', sectionKey: 'concept' as const },
    { documentId: activeDocument?.id || '', sectionKey: 'preparation' as const },
    { documentId: activeDocument?.id || '', sectionKey: 'script' as const },
    { documentId: activeDocument?.id || '', sectionKey: 'global' as const }
  ].filter(session => session.sectionKey !== currentSessionKey?.sectionKey);

  const handleMigration = () => {
    if (!message || !currentSessionKey || !selectedTargetSession) return;
    
    setIsConfirming(true);
    
    try {
      sessionManager.copyMessageToSession(message, currentSessionKey, selectedTargetSession);
      onMigrationComplete();
      onClose();
    } catch (error) {
      console.error('Failed to migrate message:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen || !message || !activeDocument) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-right">نقل الرسالة إلى جلسة أخرى</h2>
        </div>

        {/* Message Preview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="text-sm font-medium text-podcast-gray mb-2 text-right">
            الرسالة المحددة:
          </div>
          <div className="text-sm text-right line-clamp-3">
            {message.content}
          </div>
          <div className="text-xs text-podcast-gray mt-2 text-right">
            من: {message.role === 'user' ? 'المُنتِج' : 'AI'}
          </div>
        </div>

        {/* Target Session Selection */}
        <div className="mb-6">
          <div className="text-sm font-medium text-podcast-gray mb-3 text-right">
            اختر الجلسة المستهدفة:
          </div>
          
          <div className="space-y-2">
            {availableTargetSessions.map((sessionKey) => {
              const displayName = sessionManager.getSectionDisplayName(sessionKey.sectionKey);
              const messageCount = sessionManager.getMessages(sessionKey).length;
              const isSelected = selectedTargetSession?.sectionKey === sessionKey.sectionKey;
              
              return (
                <button
                  key={sessionKey.sectionKey}
                  onClick={() => setSelectedTargetSession(sessionKey)}
                  className={`w-full p-3 rounded-lg border text-right transition-colors ${
                    isSelected 
                      ? 'border-podcast-blue bg-podcast-blue/10' 
                      : 'border-gray-200 hover:border-podcast-blue/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isSelected && <Check className="w-4 h-4 text-podcast-blue" />}
                      <MessageSquare className="w-4 h-4 text-podcast-gray" />
                      <span className="text-xs text-podcast-gray">
                        {messageCount} رسالة
                      </span>
                    </div>
                    
                    <div className="font-medium text-podcast-gray">
                      {displayName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-podcast-gray hover:bg-gray-100 rounded-lg transition-colors"
          >
            إلغاء
          </button>
          
          <button
            onClick={handleMigration}
            disabled={!selectedTargetSession || isConfirming}
            className="px-4 py-2 bg-podcast-blue text-white rounded-lg hover:bg-podcast-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري النقل...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                نقل الرسالة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionMigrationModal;
