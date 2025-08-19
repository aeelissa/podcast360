
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PodcastSettings } from '../types/settings';
import { settingsStorage } from '../utils/settingsStorage';
import { useAdminConfig } from './AdminConfigContext';

interface PodcastSettingsContextType {
  settings: PodcastSettings;
  updateSettings: (settings: Partial<PodcastSettings>) => void;
  updateIdentity: (identity: Partial<PodcastSettings['identity']>) => void;
  updateEpisode: (episode: Partial<PodcastSettings['episode']>) => void;
  updateAdvanced: (advanced: Partial<PodcastSettings['advanced']>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const PodcastSettingsContext = createContext<PodcastSettingsContextType | undefined>(undefined);

interface PodcastSettingsProviderProps {
  children: ReactNode;
}

export const PodcastSettingsProvider: React.FC<PodcastSettingsProviderProps> = ({ children }) => {
  const { config: adminConfig, isLoading: adminLoading } = useAdminConfig();
  const [settings, setSettings] = useState<PodcastSettings>(settingsStorage.getSettings());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for admin config to load, then load settings with admin defaults
    if (!adminLoading) {
      console.log('Loading settings with admin defaults:', adminConfig.defaultPodcast);
      const loadedSettings = settingsStorage.getSettings();
      setSettings(loadedSettings);
      setIsLoading(false);
    }
  }, [adminLoading, adminConfig.defaultPodcast]);

  const updateSettings = (newSettings: Partial<PodcastSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    settingsStorage.saveSettings(updatedSettings);
  };

  const updateIdentity = (identity: Partial<PodcastSettings['identity']>) => {
    const updatedSettings = {
      ...settings,
      identity: { ...settings.identity, ...identity }
    };
    setSettings(updatedSettings);
    settingsStorage.saveSettings(updatedSettings);
  };

  const updateEpisode = (episode: Partial<PodcastSettings['episode']>) => {
    const updatedSettings = {
      ...settings,
      episode: { ...settings.episode, ...episode }
    };
    setSettings(updatedSettings);
    settingsStorage.saveSettings(updatedSettings);
  };

  const updateAdvanced = (advanced: Partial<PodcastSettings['advanced']>) => {
    const updatedSettings = {
      ...settings,
      advanced: { ...settings.advanced, ...advanced }
    };
    setSettings(updatedSettings);
    settingsStorage.saveSettings(updatedSettings);
  };

  const resetSettings = () => {
    console.log('Resetting to admin defaults:', adminConfig.defaultPodcast);
    settingsStorage.resetSettings();
    const defaultSettings = settingsStorage.getSettings();
    setSettings(defaultSettings);
  };

  return (
    <PodcastSettingsContext.Provider value={{
      settings,
      updateSettings,
      updateIdentity,
      updateEpisode,
      updateAdvanced,
      resetSettings,
      isLoading
    }}>
      {children}
    </PodcastSettingsContext.Provider>
  );
};

export const usePodcastSettings = () => {
  const context = useContext(PodcastSettingsContext);
  if (context === undefined) {
    throw new Error('usePodcastSettings must be used within a PodcastSettingsProvider');
  }
  return context;
};
