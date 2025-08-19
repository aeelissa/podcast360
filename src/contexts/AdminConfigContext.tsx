
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminConfiguration } from '../types/admin';
import { adminConfigStorage } from '../utils/adminConfigStorage';

interface AdminConfigContextType {
  config: AdminConfiguration;
  updateConfig: (config: Partial<AdminConfiguration>) => void;
  updateAPIKeys: (keys: Partial<AdminConfiguration['apiKeys']>) => void;
  updatePrompts: (prompts: Partial<AdminConfiguration['aiPrompts']>) => void;
  updateDefaults: (defaults: Partial<AdminConfiguration['defaultPodcast']>) => void;
  updateSystem: (system: Partial<AdminConfiguration['system']>) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (configString: string) => void;
  isLoading: boolean;
}

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

interface AdminConfigProviderProps {
  children: ReactNode;
}

export const AdminConfigProvider: React.FC<AdminConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AdminConfiguration>(adminConfigStorage.getConfig());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedConfig = adminConfigStorage.getConfig();
    setConfig(loadedConfig);
    setIsLoading(false);
  }, []);

  const updateConfig = (newConfig: Partial<AdminConfiguration>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
  };

  const updateAPIKeys = (keys: Partial<AdminConfiguration['apiKeys']>) => {
    const updatedConfig = {
      ...config,
      apiKeys: { ...config.apiKeys, ...keys }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
  };

  const updatePrompts = (prompts: Partial<AdminConfiguration['aiPrompts']>) => {
    const updatedConfig = {
      ...config,
      aiPrompts: { ...config.aiPrompts, ...prompts }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
  };

  const updateDefaults = (defaults: Partial<AdminConfiguration['defaultPodcast']>) => {
    const updatedConfig = {
      ...config,
      defaultPodcast: { ...config.defaultPodcast, ...defaults }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
  };

  const updateSystem = (system: Partial<AdminConfiguration['system']>) => {
    const updatedConfig = {
      ...config,
      system: { ...config.system, ...system }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
  };

  const resetConfig = () => {
    adminConfigStorage.resetConfig();
    const defaultConfig = adminConfigStorage.getConfig();
    setConfig(defaultConfig);
  };

  const exportConfig = () => {
    return adminConfigStorage.exportConfig();
  };

  const importConfig = (configString: string) => {
    adminConfigStorage.importConfig(configString);
    const newConfig = adminConfigStorage.getConfig();
    setConfig(newConfig);
  };

  return (
    <AdminConfigContext.Provider value={{
      config,
      updateConfig,
      updateAPIKeys,
      updatePrompts,
      updateDefaults,
      updateSystem,
      resetConfig,
      exportConfig,
      importConfig,
      isLoading
    }}>
      {children}
    </AdminConfigContext.Provider>
  );
};

export const useAdminConfig = () => {
  const context = useContext(AdminConfigContext);
  if (context === undefined) {
    throw new Error('useAdminConfig must be used within an AdminConfigProvider');
  }
  return context;
};
