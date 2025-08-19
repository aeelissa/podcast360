import { ChatMessage } from '../types/chat';

export interface ChatSession {
  id: string;
  documentId: string;
  sectionKey: 'concept' | 'preparation' | 'script' | 'global';
  messages: ChatMessage[];
  lastAccessed: string;
  createdAt: string;
}

export type SessionKey = {
  documentId: string;
  sectionKey: 'concept' | 'preparation' | 'script' | 'global';
};

class SessionManager {
  private sessions: Map<string, ChatSession> = new Map();
  private readonly MAX_MESSAGES_PER_SESSION = 50;
  private readonly STORAGE_KEY = 'podcast360_chat_sessions';
  private currentSessionId: string = 'default_session';

  constructor() {
    this.loadSessions();
  }

  private getSessionId(key: SessionKey): string {
    return `${key.documentId}_${key.sectionKey}`;
  }

  getCurrentSessionId(): string {
    return this.currentSessionId;
  }

  setCurrentSessionId(sessionId: string): void {
    this.currentSessionId = sessionId;
  }

  private loadSessions(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const sessionsData = JSON.parse(stored);
        Object.entries(sessionsData).forEach(([id, session]) => {
          this.sessions.set(id, session as ChatSession);
        });
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  }

  private saveSessions(): void {
    try {
      const sessionsData = Object.fromEntries(this.sessions);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionsData));
    } catch (error) {
      console.error('Failed to save chat sessions:', error);
    }
  }

  getSession(key: SessionKey): ChatSession {
    const sessionId = this.getSessionId(key);
    let session = this.sessions.get(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        documentId: key.documentId,
        sectionKey: key.sectionKey,
        messages: [],
        lastAccessed: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      this.sessions.set(sessionId, session);
      this.saveSessions();
    } else {
      session.lastAccessed = new Date().toISOString();
      this.saveSessions();
    }
    
    return session;
  }

  addMessage(key: SessionKey, message: ChatMessage): void {
    const session = this.getSession(key);
    session.messages.push(message);
    
    // Prune old messages if exceeding limit
    if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
      session.messages = session.messages.slice(-this.MAX_MESSAGES_PER_SESSION);
    }
    
    session.lastAccessed = new Date().toISOString();
    this.saveSessions();
  }

  getMessages(key: SessionKey): ChatMessage[] {
    const session = this.getSession(key);
    return session.messages;
  }

  copyMessageToSession(message: ChatMessage, fromKey: SessionKey, toKey: SessionKey): void {
    const copiedMessage: ChatMessage = {
      ...message,
      id: `copied_${Date.now()}_${message.id}`,
      timestamp: new Date().toISOString()
    };
    
    this.addMessage(toKey, copiedMessage);
  }

  getAllSessionsForDocument(documentId: string): ChatSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.documentId === documentId)
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
  }

  clearSession(key: SessionKey): void {
    const sessionId = this.getSessionId(key);
    this.sessions.delete(sessionId);
    this.saveSessions();
  }

  getSectionDisplayName(sectionKey: string): string {
    switch (sectionKey) {
      case 'concept': return 'ورقة التصور';
      case 'preparation': return 'ورقة الإعداد';
      case 'script': return 'ورقة السكربت';
      case 'global': return 'جلسة عامة';
      default: return sectionKey;
    }
  }
}

export const sessionManager = new SessionManager();
