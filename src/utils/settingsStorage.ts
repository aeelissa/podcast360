import { PodcastSettings } from '../types/settings';

const SETTINGS_KEY = 'podcast360_settings';

// Load default settings from admin configuration
const getDefaultSettings = (): PodcastSettings => {
  try {
    const adminConfig = localStorage.getItem('podcast360_admin_config');
    if (adminConfig) {
      const config = JSON.parse(adminConfig);
      if (config.defaultPodcast) {
        return config.defaultPodcast;
      }
    }
  } catch (error) {
    console.error('Error loading default settings from admin config:', error);
  }

  // Fallback to hardcoded defaults
  return {
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
};

export const settingsStorage = {
  // Get settings from localStorage
  getSettings(): PodcastSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const defaultSettings = getDefaultSettings();
        // Merge with defaults to ensure all properties exist
        return {
          ...defaultSettings,
          ...parsed,
          identity: { ...defaultSettings.identity, ...parsed.identity },
          episode: { ...defaultSettings.episode, ...parsed.episode },
          advanced: { ...defaultSettings.advanced, ...parsed.advanced }
        };
      }
      return getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return getDefaultSettings();
    }
  },

  // Save settings to localStorage
  saveSettings(settings: PodcastSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Reset settings to defaults
  resetSettings(): void {
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }
};
