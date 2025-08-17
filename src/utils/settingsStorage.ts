
import { PodcastSettings, DEFAULT_PODCAST_SETTINGS } from '../types/settings';

const SETTINGS_KEY = 'podcast360_settings';

export const settingsStorage = {
  // Get settings from localStorage
  getSettings(): PodcastSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return {
          ...DEFAULT_PODCAST_SETTINGS,
          ...parsed,
          identity: { ...DEFAULT_PODCAST_SETTINGS.identity, ...parsed.identity },
          episode: { ...DEFAULT_PODCAST_SETTINGS.episode, ...parsed.episode },
          advanced: { ...DEFAULT_PODCAST_SETTINGS.advanced, ...parsed.advanced }
        };
      }
      return DEFAULT_PODCAST_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_PODCAST_SETTINGS;
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
