
import { AdminConfiguration, DEFAULT_ADMIN_CONFIG } from '../types/admin';

const ADMIN_CONFIG_KEY = 'podcast360_admin_config';

export const adminConfigStorage = {
  // Get admin configuration
  getConfig(): AdminConfiguration {
    try {
      const stored = localStorage.getItem(ADMIN_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return {
          ...DEFAULT_ADMIN_CONFIG,
          ...parsed,
          apiKeys: { ...DEFAULT_ADMIN_CONFIG.apiKeys, ...parsed.apiKeys },
          aiPrompts: { ...DEFAULT_ADMIN_CONFIG.aiPrompts, ...parsed.aiPrompts },
          defaultPodcast: {
            ...DEFAULT_ADMIN_CONFIG.defaultPodcast,
            ...parsed.defaultPodcast,
            identity: { ...DEFAULT_ADMIN_CONFIG.defaultPodcast.identity, ...parsed.defaultPodcast?.identity },
            episode: { ...DEFAULT_ADMIN_CONFIG.defaultPodcast.episode, ...parsed.defaultPodcast?.episode },
            advanced: { ...DEFAULT_ADMIN_CONFIG.defaultPodcast.advanced, ...parsed.defaultPodcast?.advanced }
          },
          system: { ...DEFAULT_ADMIN_CONFIG.system, ...parsed.system }
        };
      }
      return DEFAULT_ADMIN_CONFIG;
    } catch (error) {
      console.error('Error loading admin config:', error);
      return DEFAULT_ADMIN_CONFIG;
    }
  },

  // Save admin configuration
  saveConfig(config: AdminConfiguration): void {
    try {
      const configToSave = {
        ...config,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(configToSave));
    } catch (error) {
      console.error('Error saving admin config:', error);
      throw error;
    }
  },

  // Reset to defaults
  resetConfig(): void {
    try {
      localStorage.removeItem(ADMIN_CONFIG_KEY);
    } catch (error) {
      console.error('Error resetting admin config:', error);
    }
  },

  // Export configuration (without sensitive data)
  exportConfig(): string {
    const config = this.getConfig();
    const exportData = {
      ...config,
      apiKeys: {
        ...config.apiKeys,
        googleGemini: config.apiKeys.googleGemini ? '[CONFIGURED]' : '',
        openai: config.apiKeys.openai ? '[CONFIGURED]' : '',
        googleDrive: config.apiKeys.googleDrive ? '[CONFIGURED]' : ''
      }
    };
    return JSON.stringify(exportData, null, 2);
  },

  // Import configuration
  importConfig(configString: string): void {
    try {
      const importedConfig = JSON.parse(configString);
      // Don't import API keys for security
      const currentConfig = this.getConfig();
      const mergedConfig = {
        ...importedConfig,
        apiKeys: currentConfig.apiKeys,
        lastUpdated: new Date().toISOString()
      };
      this.saveConfig(mergedConfig);
    } catch (error) {
      console.error('Error importing admin config:', error);
      throw new Error('Invalid configuration format');
    }
  }
};
