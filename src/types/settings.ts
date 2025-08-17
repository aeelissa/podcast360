
export interface PodcastIdentity {
  tone: string;
  style: string[];
  audience: string;
  brandVoice: string;
  hostName?: string;
  showName: string;
}

export interface EpisodeConfiguration {
  goals: string[];
  successCriteria: string[];
  duration: number;
  contentType: string;
}

export interface AdvancedSettings {
  autoSave: boolean;
  aiSuggestions: boolean;
  exportFormat: string;
}

export interface PodcastSettings {
  identity: PodcastIdentity;
  episode: EpisodeConfiguration;
  advanced: AdvancedSettings;
}

export const DEFAULT_PODCAST_SETTINGS: PodcastSettings = {
  identity: {
    tone: 'ودودة ومهنية',
    style: ['تفاعلي', 'تعليمي'],
    audience: 'المهتمين بالتكنولوجيا',
    brandVoice: 'عربية فصحى معاصرة',
    showName: 'Podcast360'
  },
  episode: {
    goals: [
      'تعريف المستمعين بالذكاء الاصطناعي',
      'شرح فوائد التكنولوجيا الحديثة',
      'تقديم نصائح عملية للاستخدام'
    ],
    successCriteria: [
      'زيادة المشاركة بنسبة 25%',
      'الحصول على تقييم 4.5 نجوم أو أكثر',
      'تحقيق 1000 استماع في الأسبوع الأول'
    ],
    duration: 45,
    contentType: 'مقابلة'
  },
  advanced: {
    autoSave: true,
    aiSuggestions: true,
    exportFormat: 'docx'
  }
};

export const TONE_OPTIONS = [
  'ودودة ومهنية',
  'رسمية وأكاديمية',
  'مرحة وعفوية',
  'جدية ومعمقة',
  'ملهمة ومحفزة'
];

export const STYLE_OPTIONS = [
  'تفاعلي',
  'تعليمي',
  'تحليلي',
  'قصصي',
  'حواري',
  'استقصائي'
];

export const BRAND_VOICE_OPTIONS = [
  'عربية فصحى معاصرة',
  'عربية فصحى تراثية',
  'عامية مهذبة',
  'مزيج فصحى وعامية'
];

export const CONTENT_TYPE_OPTIONS = [
  'مقابلة',
  'حوار',
  'تحليل',
  'قصة',
  'تعليمي',
  'إخباري'
];
