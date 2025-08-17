
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIAction {
  type: 'apply-to-document' | 'save-as-note';
  messageId: string;
  content: string;
}

export type ChatMode = 'document' | 'note';
