
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIServiceConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

class AIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    // Try to get API key from environment or prompt user to set it
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string | null {
    // For now, we'll prompt user to set this via Supabase secrets
    return null;
  }

  async chat(
    messages: ChatMessage[],
    config: AIServiceConfig = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set your API key.');
    }

    const { model = 'gpt-4', temperature = 0.7, maxTokens = 1000 } = config;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'عذراً، لم أتمكن من الحصول على إجابة.';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const aiService = new AIService();
