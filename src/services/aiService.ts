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
  private apiKey: string;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    // Load API key from admin configuration
    this.loadApiKeyFromConfig();
  }

  private loadApiKeyFromConfig() {
    try {
      const adminConfig = localStorage.getItem('podcast360_admin_config');
      if (adminConfig) {
        const config = JSON.parse(adminConfig);
        this.apiKey = config.apiKeys?.googleGemini || '';
      } else {
        // Fallback to old storage method
        this.apiKey = localStorage.getItem('podcast360_ai_api_key') || '';
      }
      
      if (this.apiKey) {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      }
    } catch (error) {
      console.error('Error loading API key from config:', error);
      this.apiKey = '';
    }
  }

  async chat(
    messages: AIMessage[],
    config: AIServiceConfig = {}
  ): Promise<string> {
    if (!this.genAI || !this.apiKey) {
      throw new Error('لم يتم تكوين مفتاح API. يرجى إضافة مفتاح Google Gemini API في الإعدادات.');
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
      if (error instanceof Error && error.message.includes('API_KEY')) {
        throw new Error('مفتاح API غير صالح. يرجى التحقق من صحة المفتاح في الإعدادات.');
      }
      throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
    } else {
      this.genAI = null;
    }
  }

  refreshFromConfig() {
    this.loadApiKeyFromConfig();
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.genAI;
  }

  getApiKeyStatus(): 'missing' | 'configured' | 'invalid' {
    if (!this.apiKey) return 'missing';
    if (!this.genAI) return 'invalid';
    return 'configured';
  }
}

export const aiService = new AIService();
