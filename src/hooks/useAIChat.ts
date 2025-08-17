import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatMode } from '../types/chat';
import { aiService } from '../services/aiService';
import { useDocumentContext } from '../contexts/DocumentContext';
import { usePodcastSettings } from '../contexts/PodcastSettingsContext';
import { sessionManager, SessionKey } from '../utils/sessionManager';
import { getSystemPrompt, validateAIResponse } from '../utils/documentPrompts';

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('document');
  const [currentSessionKey, setCurrentSessionKey] = useState<SessionKey | null>(null);
  
  const { 
    activeDocument, 
    insertContentAtCursor, 
    saveAsNote, 
    getDocumentSections,
    getFullDocumentContent,
    getCurrentSectionKey
  } = useDocumentContext();
  
  const { settings } = usePodcastSettings();

  // Update session when document changes
  useEffect(() => {
    if (activeDocument) {
      const newSessionKey: SessionKey = {
        documentId: activeDocument.id,
        sectionKey: getCurrentSectionKey()
      };
      
      setCurrentSessionKey(newSessionKey);
      const sessionMessages = sessionManager.getMessages(newSessionKey);
      setMessages(sessionMessages);
    }
  }, [activeDocument, getCurrentSectionKey]);

  const buildEnhancedContext = useCallback(() => {
    if (!activeDocument) return '';

    const sections = getDocumentSections();
    const fullContent = getFullDocumentContent();
    
    const documentContext = `
المستند الحالي: ${activeDocument.type === 'concept' ? 'ورقة التصور' : activeDocument.type === 'preparation' ? 'ورقة الإعداد' : 'ورقة السكربت'}

محتوى المستند:
${fullContent.substring(0, 1000)}${fullContent.length > 1000 ? '...' : ''}

أقسام المستند:
${sections.map(section => `- ${section.title} (${section.content.length} حرف)`).join('\n')}
    `;

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

    return podcastContext + '\n\n' + documentContext;
  }, [activeDocument, settings, getDocumentSections, getFullDocumentContent]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentSessionKey) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add to current session
    sessionManager.addMessage(currentSessionKey, userMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const enhancedContext = buildEnhancedContext();
      const documentType = getCurrentSectionKey();
      
      // Handle the 'global' case by using a fallback document type or general prompt
      const promptDocumentType = documentType === 'global' ? 'concept' : documentType;
      const systemPrompt = getSystemPrompt(promptDocumentType, enhancedContext);

      const systemMessage = {
        role: 'system' as const,
        content: systemPrompt
      };

      // Get recent messages from current session
      const sessionMessages = sessionManager.getMessages(currentSessionKey);
      const recentMessages = sessionMessages.slice(-10);

      const aiMessages = [
        systemMessage,
        ...recentMessages.map(msg => ({ 
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const, 
          content: msg.content 
        }))
      ];

      const response = await aiService.chat(aiMessages);
      const validatedResponse = validateAIResponse(response);

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: validatedResponse?.content || response,
        timestamp: new Date().toISOString()
      };

      sessionManager.addMessage(currentSessionKey, aiMessage);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString()
      };
      
      if (currentSessionKey) {
        sessionManager.addMessage(currentSessionKey, errorMessage);
      }
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionKey, buildEnhancedContext, getCurrentSectionKey]);

  const applyToDocument = useCallback((content: string) => {
    insertContentAtCursor(content);
  }, [insertContentAtCursor]);

  const saveAsNoteAction = useCallback((content: string) => {
    saveAsNote(content);
  }, [saveAsNote]);

  const switchSession = useCallback((newSessionKey: SessionKey) => {
    setCurrentSessionKey(newSessionKey);
    const sessionMessages = sessionManager.getMessages(newSessionKey);
    setMessages(sessionMessages);
  }, []);

  const copyMessageToSession = useCallback((message: ChatMessage, targetSessionKey: SessionKey) => {
    if (currentSessionKey) {
      sessionManager.copyMessageToSession(message, currentSessionKey, targetSessionKey);
    }
  }, [currentSessionKey]);

  const getCurrentSessionName = useCallback((): string => {
    if (!currentSessionKey) return 'جلسة عامة';
    return sessionManager.getSectionDisplayName(currentSessionKey.sectionKey);
  }, [currentSessionKey]);

  return {
    messages,
    isLoading,
    chatMode,
    setChatMode,
    sendMessage,
    applyToDocument,
    saveAsNoteAction,
    switchSession,
    copyMessageToSession,
    getCurrentSessionName,
    currentSessionKey,
    isAIConfigured: aiService.isConfigured()
  };
};
