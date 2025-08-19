
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

// Helper function to notify services of config changes
const notifyConfigChange = () => {
  console.log('Admin Config: Notifying services of configuration change');
  // Dispatch custom event for services to listen to
  window.dispatchEvent(new CustomEvent('admin-config-updated'));
};

export const AdminConfigProvider: React.FC<AdminConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AdminConfiguration>(adminConfigStorage.getConfig());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedConfig = adminConfigStorage.getConfig();
    console.log('Admin Config: Initial config loaded:', {
      apiKeys: Object.keys(loadedConfig.apiKeys).reduce((acc, key) => {
        acc[key] = loadedConfig.apiKeys[key] ? '[CONFIGURED]' : '[MISSING]';
        return acc;
      }, {} as any),
      hasPrompts: !!loadedConfig.aiPrompts,
      hasDefaults: !!loadedConfig.defaultPodcast
    });
    setConfig(loadedConfig);
    setIsLoading(false);
  }, []);

  const updateConfig = (newConfig: Partial<AdminConfiguration>) => {
    console.log('Admin Config: Updating config:', newConfig);
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
    notifyConfigChange();
  };

  const updateAPIKeys = (keys: Partial<AdminConfiguration['apiKeys']>) => {
    console.log('Admin Config: Updating API keys:', Object.keys(keys));
    const updatedConfig = {
      ...config,
      apiKeys: { ...config.apiKeys, ...keys }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
    notifyConfigChange();
  };

  const updatePrompts = (prompts: Partial<AdminConfiguration['aiPrompts']>) => {
    console.log('Admin Config: Updating AI prompts:', Object.keys(prompts));
    const updatedConfig = {
      ...config,
      aiPrompts: { ...config.aiPrompts, ...prompts }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
    notifyConfigChange();
  };

  const updateDefaults = (defaults: Partial<AdminConfiguration['defaultPodcast']>) => {
    console.log('Admin Config: Updating default podcast settings:', defaults);
    const updatedConfig = {
      ...config,
      defaultPodcast: { ...config.defaultPodcast, ...defaults }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
    notifyConfigChange();
  };

  const updateSystem = (system: Partial<AdminConfiguration['system']>) => {
    console.log('Admin Config: Updating system settings:', system);
    const updatedConfig = {
      ...config,
      system: { ...config.system, ...system }
    };
    setConfig(updatedConfig);
    adminConfigStorage.saveConfig(updatedConfig);
    notifyConfigChange();
  };

  const resetConfig = () => {
    console.log('Admin Config: Resetting to defaults');
    adminConfigStorage.resetConfig();
    const defaultConfig = adminConfigStorage.getConfig();
    setConfig(defaultConfig);
    notifyConfigChange();
  };

  const exportConfig = () => {
    return adminConfigStorage.exportConfig();
  };

  const importConfig = (configString: string) => {
    console.log('Admin Config: Importing configuration');
    adminConfigStorage.importConfig(configString);
    const newConfig = adminConfigStorage.getConfig();
    setConfig(newConfig);
    notifyConfigChange();
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
