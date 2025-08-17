
import { useState, useCallback } from 'react';
import { ChatMessage, ChatMode } from '../types/chat';
import { aiService } from '../services/aiService';
import { useDocumentContext } from '../contexts/DocumentContext';
import { usePodcastSettings } from '../contexts/PodcastSettingsContext';

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('document');
  const { activeDocument, insertContentAtCursor, saveAsNote } = useDocumentContext();
  const { settings } = usePodcastSettings();

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
      // Build enhanced context for AI with user settings
      const podcastContext = `
        معلومات البودكاست:
        - اسم البودكاست: ${settings.identity.showName}
        - نبرة البودكاست: ${settings.identity.tone}
        - أسلوب التقديم: ${settings.identity.style.join(', ')}
        - الجمهور المستهدف: ${settings.identity.audience}
        - لغة العلامة التجارية: ${settings.identity.brandVoice}
        ${settings.identity.hostName ? `- اسم المضيف: ${settings.identity.hostName}` : ''}
        
        إعدادات الحلقة:
        - نوع المحتوى: ${settings.episode.contentType}
        - المدة المتوقعة: ${settings.episode.duration} دقيقة
        - أهداف الحلقة: ${settings.episode.goals.join(', ')}
        - معايير النجاح: ${settings.episode.successCriteria.join(', ')}
      `;

      const systemMessage = {
        role: 'system' as const,
        content: `أنت مساعد ذكي متخصص في إنتاج البودكاست. تساعد المستخدمين في إنشاء وتطوير محتوى البودكاست باللغة العربية. 
        
        ${podcastContext}
        
        ${activeDocument ? `المستخدم يعمل حالياً على: ${activeDocument.type === 'concept' ? 'ورقة التصور' : activeDocument.type === 'preparation' ? 'ورقة الإعداد' : 'ورقة السكربت'}` : ''}
        ${activeDocument?.content ? `محتوى الوثيقة الحالية: ${activeDocument.content.substring(0, 500)}...` : ''}
        
        التزم بنبرة البودكاست المحددة (${settings.identity.tone}) واستخدم أسلوب التقديم المناسب (${settings.identity.style.join(', ')}). راعِ الجمهور المستهدف (${settings.identity.audience}) واستخدم لغة العلامة التجارية (${settings.identity.brandVoice}).
        
        قدم اقتراحات مفيدة ومحددة يمكن تطبيقها مباشرة على الوثيقة وتتماشى مع أهداف الحلقة ومعايير النجاح المحددة.`
      };

      const aiMessages = [
        systemMessage,
        ...messages.slice(-10).map(msg => ({ 
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const, 
          content: msg.content 
        })),
        { role: 'user' as const, content }
      ];

      const response = await aiService.chat(aiMessages);

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
  }, [messages, activeDocument, insertContentAtCursor, saveAsNote, settings]);

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
