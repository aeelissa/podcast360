
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIServiceConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private apiKey: string | null = null;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    // Try to get API key from environment or prompt user to set it
    this.apiKey = this.getApiKey();
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  private getApiKey(): string | null {
    // For now, we'll prompt user to set this via Supabase secrets
    return null;
  }

  async chat(
    messages: AIMessage[],
    config: AIServiceConfig = {}
  ): Promise<string> {
    if (!this.apiKey || !this.genAI) {
      throw new Error('Gemini API key not configured. Please set your API key.');
    }

    const { model = 'gemini-1.5-flash', temperature = 0.7 } = config;

    try {
      const genModel = this.genAI.getGenerativeModel({ 
        model,
        generationConfig: {
          temperature,
          maxOutputTokens: config.maxTokens || 1000,
        }
      });

      // Convert messages to Gemini format
      // Gemini expects a conversation history and doesn't have system messages in the same way
      // We'll prepend system message as part of the first user message
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');
      
      let prompt = '';
      if (systemMessage) {
        prompt = systemMessage.content + '\n\n';
      }
      
      // Add conversation history
      conversationMessages.forEach(msg => {
        if (msg.role === 'user') {
          prompt += `المستخدم: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          prompt += `المساعد: ${msg.content}\n`;
        }
      });

      const result = await genModel.generateContent(prompt);
      const response = await result.response;
      return response.text() || 'عذراً، لم أتمكن من الحصول على إجابة.';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    this.genAI = new GoogleGenerativeAI(key);
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.genAI;
  }
}

export const aiService = new AIService();
