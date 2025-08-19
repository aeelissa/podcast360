
export interface APIKeysConfig {
  googleGemini: string;
  openai?: string;
  googleDrive?: string;
}

export interface AIPromptsConfig {
  conceptPrompt: string;
  preparationPrompt: string;
  scriptPrompt: string;
  baseSystemPrompt: string;
}

export interface DefaultPodcastConfig {
  identity: {
    tone: string;
    style: string[];
    audience: string;
    brandVoice: string;
    showName: string;
  };
  episode: {
    goals: string[];
    successCriteria: string[];
    duration: number;
    contentType: string;
  };
  advanced: {
    autoSave: boolean;
    aiSuggestions: boolean;
    exportFormat: string;
  };
}

export interface SystemConfig {
  language: string;
  theme: string;
  autoBackup: boolean;
  debugMode: boolean;
}

export interface AdminConfiguration {
  apiKeys: APIKeysConfig;
  aiPrompts: AIPromptsConfig;
  defaultPodcast: DefaultPodcastConfig;
  system: SystemConfig;
  version: string;
  lastUpdated: string;
}

export const DEFAULT_ADMIN_CONFIG: AdminConfiguration = {
  apiKeys: {
    googleGemini: 'AIzaSyBvJqXYZ9vRmQwF5cH4kL2nP8xT1uD6gS0', // Pre-filled production key
  },
  aiPrompts: {
    conceptPrompt: `أنت مساعد ذكي متخصص في إنتاج البودكاست باللغة العربية. أنت تساعد في تطوير ورقة التصور للحلقة. ركز على:
- تحديد الفكرة الرئيسية وأهدافها بوضوح
- تحليل الجمهور المستهدف وتوقعاته
- استخراج النقاط الأساسية والرسائل المحورية
- اقتراح هيكل منطقي للحلقة
- تحديد المعلومات والمواد المطلوبة للإعداد

اجعل اقتراحاتك محددة وقابلة للتطبيق العملي. استخدم لغة واضحة ومباشرة تناسب صانع المحتوى العربي.`,

    preparationPrompt: `أنت مساعد ذكي متخصص في إنتاج البودكاست باللغة العربية. أنت تساعد في إعداد الحلقة وتجهيز المواد. ركز على:
- اقتراح مصادر موثوقة ومتنوعة للمحتوى
- تطوير أسئلة جوهرية ومثيرة للاهتمام
- تنظيم البحث والملاحظات بطريقة منهجية
- التحضير التقني للتسجيل والمعدات
- إعداد خطة زمنية للحلقة
- اقتراح نقاط تفاعل مع الجمهور

قدم اقتراحات عملية ومنظمة تساعد في الإعداد الفعال والمهني للحلقة.`,

    scriptPrompt: `أنت مساعد ذكي متخصص في إنتاج البودكاست باللغة العربية. أنت تساعد في كتابة سكربت الحلقة. ركز على:
- صياغة مقدمة جذابة تشد انتباه المستمع من البداية
- تنظيم المحتوى الرئيسي بطريقة منطقية ومتدفقة
- إضافة عناصر تشويق وتفاعل طوال الحلقة
- كتابة خاتمة قوية تترك أثراً إيجابياً
- إدراج دعوات للعمل مناسبة ومحفزة
- ضمان التوازن بين المعلومات والترفيه

اكتب بأسلوب طبيعي ومتدفق يناسب الحديث المسموع. تجنب الأسلوب الكتابي الجاف واستخدم لغة حية وتفاعلية.`,

    baseSystemPrompt: `أنت مساعد ذكي متخصص في إنتاج البودكاست باللغة العربية. تتميز بالخبرة العميقة في صناعة المحتوى الصوتي والتفاعل مع الجمهور العربي.

مهامك الأساسية:
- مساعدة منتجي البودكاست في جميع مراحل الإنتاج
- تقديم اقتراحات إبداعية ومحتوى عالي الجودة
- ضمان التوافق مع الثقافة العربية والقيم المحلية
- تحسين جودة المحتوى وزيادة التفاعل

خصائصك:
- تجيب دائماً باللغة العربية الفصحى المعاصرة
- تقدم حلولاً عملية وقابلة للتطبيق
- تراعي احتياجات الجمهور العربي المتنوع
- تحافظ على طابع مهني ومفيد في جميع التفاعلات`
  },
  defaultPodcast: {
    identity: {
      tone: 'ودودة ومهنية',
      style: ['تفاعلي', 'تعليمي'],
      audience: 'المهتمين بالتكنولوجيا والإعلام الرقمي',
      brandVoice: 'عربية فصحى معاصرة',
      showName: 'بودكاست جديد'
    },
    episode: {
      goals: [
        'تقديم محتوى قيم ومفيد للجمهور',
        'زيادة الوعي بالموضوع المطروح',
        'تحفيز التفاعل والنقاش البناء'
      ],
      successCriteria: [
        'زيادة المشاركة بنسبة 20%',
        'الحصول على تقييم 4 نجوم أو أكثر',
        'تحقيق 500 استماع في الأسبوع الأول'
      ],
      duration: 30,
      contentType: 'مقابلة'
    },
    advanced: {
      autoSave: true,
      aiSuggestions: true,
      exportFormat: 'docx'
    }
  },
  system: {
    language: 'ar',
    theme: 'default',
    autoBackup: true,
    debugMode: false
  },
  version: '1.0.0',
  lastUpdated: new Date().toISOString()
};
