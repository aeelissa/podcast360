
export interface DocumentSchema {
  type: 'concept' | 'preparation' | 'script';
  sections: string[];
  expectedContent: string[];
  insertionPoints: string[];
}

export interface AIResponse {
  content: string;
  insertionType: 'cursor' | 'after_heading' | 'append' | 'replace_selection';
  targetSection?: string;
  confidence: number;
}

export const DOCUMENT_SCHEMAS: Record<string, DocumentSchema> = {
  concept: {
    type: 'concept',
    sections: ['الفكرة الرئيسية', 'الأهداف', 'الجمهور المستهدف', 'النقاط الأساسية'],
    expectedContent: ['episode_idea', 'target_audience', 'key_points', 'episode_goals'],
    insertionPoints: ['after_heading', 'cursor', 'append']
  },
  preparation: {
    type: 'preparation',
    sections: ['البحث', 'المصادر', 'الأسئلة', 'التحضير التقني'],
    expectedContent: ['research_notes', 'sources', 'questions', 'technical_prep'],
    insertionPoints: ['after_heading', 'cursor', 'append']
  },
  script: {
    type: 'script',
    sections: ['المقدمة', 'المحتوى الرئيسي', 'الخاتمة', 'الدعوة للعمل'],
    expectedContent: ['intro_script', 'main_content', 'conclusion', 'call_to_action'],
    insertionPoints: ['cursor', 'after_heading', 'replace_selection']
  }
};

export const getSystemPrompt = (documentType: 'concept' | 'preparation' | 'script', podcastContext: string): string => {
  // Load prompts from admin configuration
  let prompts;
  try {
    const adminConfig = localStorage.getItem('podcast360_admin_config');
    if (adminConfig) {
      const config = JSON.parse(adminConfig);
      prompts = config.aiPrompts;
    }
  } catch (error) {
    console.error('Error loading prompts from admin config:', error);
  }

  // Fallback to defaults if no admin config found
  if (!prompts) {
    prompts = {
      baseSystemPrompt: `أنت مساعد ذكي متخصص في إنتاج البودكاست باللغة العربية. ${podcastContext}`,
      conceptPrompt: `أنت تساعد في تطوير ورقة التصور للحلقة. ركز على:
- تحديد الفكرة الرئيسية وأهدافها
- تحليل الجمهور المستهدف
- استخراج النقاط الأساسية
- اقتراح هيكل الحلقة

اجعل اقتراحاتك محددة وقابلة للتطبيق العملي. استخدم لغة واضحة ومباشرة.`,
      
      preparationPrompt: `أنت تساعد في إعداد الحلقة وتجهيز المواد. ركز على:
- اقتراح مصادر موثوقة للمحتوى
- تطوير أسئلة جوهرية
- تنظيم البحث والملاحظات
- التحضير التقني للتسجيل

قدم اقتراحات عملية ومنظمة تساعد في الإعداد الفعال.`,
      
      scriptPrompt: `أنت تساعد في كتابة سكربت الحلقة. ركز على:
- صياغة مقدمة جذابة
- تنظيم المحتوى الرئيسي بطريقة منطقية
- كتابة خاتمة قوية
- إضافة دعوات للعمل مناسبة

اكتب بأسلوب طبيعي ومتدفق يناسب الحديث المسموع. تجنب الأسلوب الكتابي الجاف.`
    };
  }

  const basePrompt = `${prompts.baseSystemPrompt} ${podcastContext}`;
  
  switch (documentType) {
    case 'concept':
      return `${basePrompt}\n\n${prompts.conceptPrompt}`;
    case 'preparation':
      return `${basePrompt}\n\n${prompts.preparationPrompt}`;
    case 'script':
      return `${basePrompt}\n\n${prompts.scriptPrompt}`;
    default:
      return basePrompt;
  }
};

export const validateAIResponse = (response: string): AIResponse | null => {
  try {
    // For now, return a basic structure - can be enhanced with JSON parsing later
    return {
      content: response,
      insertionType: 'cursor',
      confidence: 0.8
    };
  } catch (error) {
    console.error('Failed to validate AI response:', error);
    return null;
  }
};
