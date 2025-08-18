
import { podcastStorage } from './podcastStorage';
import { episodeStorage } from './episodeStorage';
import { documentStorage } from './documentStorage';
import { settingsStorage } from './settingsStorage';

const MIGRATION_KEY = 'podcast360_migration_version';
const CURRENT_MIGRATION_VERSION = '1.0.0';

export const dataMigration = {
  // Check if migration is needed
  needsMigration(): boolean {
    try {
      const currentVersion = localStorage.getItem(MIGRATION_KEY);
      return currentVersion !== CURRENT_MIGRATION_VERSION;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  },

  // Run migration process
  async migrate(): Promise<void> {
    try {
      console.log('Starting data migration...');
      
      // Check if user has existing data
      const existingDocuments = documentStorage.getAllDocuments();
      const existingPodcasts = podcastStorage.getAllPodcasts();
      const existingSettings = settingsStorage.getSettings();

      // If no existing podcasts but has documents, create default structure
      if (existingPodcasts.length === 0 && existingDocuments.length > 0) {
        await this.createDefaultPodcastStructure(existingDocuments, existingSettings);
      }

      // Mark migration as complete
      localStorage.setItem(MIGRATION_KEY, CURRENT_MIGRATION_VERSION);
      console.log('Data migration completed successfully');
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  },

  // Create default podcast and episode structure for existing users
  async createDefaultPodcastStructure(existingDocuments: any[], existingSettings: any): Promise<void> {
    try {
      // Create default podcast using existing settings
      const defaultPodcast = podcastStorage.createPodcast(
        existingSettings.identity?.showName || 'البودكاست الأول',
        'بودكاست تم إنشاؤه تلقائياً من البيانات الموجودة'
      );

      // Create default episode
      const defaultEpisode = episodeStorage.createEpisode(
        'الحلقة الأولى',
        defaultPodcast.id,
        'حلقة تم إنشاؤها تلقائياً من المستندات الموجودة'
      );

      // Migrate existing documents to the new episode
      documentStorage.migrateToEpisodeStructure(defaultEpisode.id);

      // Update episode with document IDs
      const migratedDocuments = documentStorage.getDocumentsByEpisode(defaultEpisode.id);
      defaultEpisode.documents = migratedDocuments.map(doc => doc.id);
      episodeStorage.saveEpisode(defaultEpisode);

      console.log('Created default podcast and episode structure');
    } catch (error) {
      console.error('Error creating default structure:', error);
      throw error;
    }
  },

  // Get migration status for UI
  getMigrationStatus(): {
    isComplete: boolean;
    hasExistingData: boolean;
    needsOnboarding: boolean;
  } {
    const isComplete = !this.needsMigration();
    const hasExistingData = documentStorage.getAllDocuments().length > 0;
    const hasPodcasts = podcastStorage.getAllPodcasts().length > 0;
    
    return {
      isComplete,
      hasExistingData,
      needsOnboarding: !hasPodcasts && !hasExistingData
    };
  }
};
