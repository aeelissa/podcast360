
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
  private configWatcher: (() => void) | null = null;

  constructor() {
    // Load API key from admin configuration
    this.loadApiKeyFromConfig();
    this.startConfigWatcher();
  }

  private startConfigWatcher() {
    // Listen for changes to admin config in localStorage
    this.configWatcher = () => {
      console.log('Admin config changed, refreshing AI service...');
      this.refreshFromConfig();
    };
    
    // Watch for storage changes
    window.addEventListener('storage', this.configWatcher);
    
    // Also watch for custom config update events
    window.addEventListener('admin-config-updated', this.configWatcher);
  }

  private loadApiKeyFromConfig() {
    try {
      const adminConfig = localStorage.getItem('podcast360_admin_config');
      if (adminConfig) {
        const config = JSON.parse(adminConfig);
        this.apiKey = config.apiKeys?.googleGemini || '';
        console.log('AI Service: API key loaded from admin config:', this.apiKey ? '[CONFIGURED]' : '[MISSING]');
      } else {
        // Fallback to old storage method
        this.apiKey = localStorage.getItem('podcast360_ai_api_key') || '';
        console.log('AI Service: Using fallback API key:', this.apiKey ? '[CONFIGURED]' : '[MISSING]');
      }
      
      if (this.apiKey) {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        console.log('AI Service: Google Generative AI initialized successfully');
      } else {
        this.genAI = null;
        console.log('AI Service: No API key available');
      }
    } catch (error) {
      console.error('Error loading API key from config:', error);
      this.apiKey = '';
      this.genAI = null;
    }
  }

  async chat(
    messages: AIMessage[],
    config: AIServiceConfig = {}
  ): Promise<string> {
    if (!this.genAI || !this.apiKey) {
      console.error('AI Service: Not configured. API Key status:', this.getApiKeyStatus());
      throw new Error('لم يتم تكوين مفتاح API. يرجى إضافة مفتاح Google Gemini API في إعدادات الإدارة.');
    }

    const { model = 'gemini-1.5-flash', temperature = 0.7 } = config;

    try {
      console.log('AI Service: Sending chat request with', messages.length, 'messages');
      
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
      const responseText = response.text() || 'عذراً، لم أتمكن من الحصول على إجابة.';
      
      console.log('AI Service: Chat response received successfully');
      return responseText;
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error instanceof Error && error.message.includes('API_KEY')) {
        throw new Error('مفتاح API غير صالح. يرجى التحقق من صحة المفتاح في إعدادات الإدارة.');
      }
      throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي. تحقق من اتصال الإنترنت ومفتاح API.');
    }
  }

  setApiKey(key: string) {
    console.log('AI Service: Setting API key:', key ? '[CONFIGURED]' : '[MISSING]');
    this.apiKey = key;
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
    } else {
      this.genAI = null;
    }
  }

  refreshFromConfig() {
    console.log('AI Service: Refreshing configuration...');
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

  destroy() {
    if (this.configWatcher) {
      window.removeEventListener('storage', this.configWatcher);
      window.removeEventListener('admin-config-updated', this.configWatcher);
    }
  }
}

export const aiService = new AIService();
