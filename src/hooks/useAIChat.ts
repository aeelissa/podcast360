
import { useState, useCallback } from 'react';
import { ChatMessage, ChatMode } from '../types/chat';
import { aiService } from '../services/aiService';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('document');
  const { activeDocument, insertContentAtCursor, saveAsNote } = useDocumentContext();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build context for AI
      const systemMessage = {
        role: 'system' as const,
        content: `أنت مساعد ذكي متخصص في إنتاج البودكاست. تساعد المستخدمين في إنشاء وتطوير محتوى البودكاست باللغة العربية. 
        ${activeDocument ? `المستخدم يعمل حالياً على: ${activeDocument.type === 'concept' ? 'ورقة التصور' : activeDocument.type === 'preparation' ? 'ورقة الإعداد' : 'ورقة السكربت'}` : ''}
        ${activeDocument?.content ? `محتوى الوثيقة الحالية: ${activeDocument.content.substring(0, 500)}...` : ''}
        قدم اقتراحات مفيدة ومحددة يمكن تطبيقها مباشرة على الوثيقة.`
      };

      const chatMessages = [
        systemMessage,
        ...messages.slice(-10).map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content }
      ];

      const response = await aiService.chat(chatMessages);

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, activeDocument, insertContentAtCursor, saveAsNote]);

  const applyToDocument = useCallback((content: string) => {
    insertContentAtCursor(content);
  }, [insertContentAtCursor]);

  const saveAsNoteAction = useCallback((content: string) => {
    saveAsNote(content);
  }, [saveAsNote]);

  return {
    messages,
    isLoading,
    chatMode,
    setChatMode,
    sendMessage,
    applyToDocument,
    saveAsNoteAction,
    isAIConfigured: aiService.isConfigured()
  };
};
