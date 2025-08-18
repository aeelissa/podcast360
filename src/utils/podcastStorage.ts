
import { Podcast, PodcastLevelSettings } from '../types/podcast';

const PODCASTS_KEY = 'podcast360_podcasts';

export const podcastStorage = {
  // Get all podcasts
  getAllPodcasts(): Podcast[] {
    try {
      const stored = localStorage.getItem(PODCASTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading podcasts:', error);
      return [];
    }
  },

  // Save a podcast
  savePodcast(podcast: Podcast): void {
    try {
      const podcasts = this.getAllPodcasts();
      const existingIndex = podcasts.findIndex(p => p.id === podcast.id);
      
      if (existingIndex >= 0) {
        podcasts[existingIndex] = { ...podcast, modifiedAt: new Date().toISOString() };
      } else {
        podcasts.push(podcast);
      }
      
      localStorage.setItem(PODCASTS_KEY, JSON.stringify(podcasts));
    } catch (error) {
      console.error('Error saving podcast:', error);
    }
  },

  // Get a podcast by ID
  getPodcast(id: string): Podcast | null {
    const podcasts = this.getAllPodcasts();
    return podcasts.find(p => p.id === id) || null;
  },

  // Delete a podcast
  deletePodcast(id: string): void {
    try {
      const podcasts = this.getAllPodcasts();
      const filtered = podcasts.filter(p => p.id !== id);
      localStorage.setItem(PODCASTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting podcast:', error);
    }
  },

  // Create a new podcast with default settings
  createPodcast(name: string, description: string, settings?: Partial<PodcastLevelSettings>): Podcast {
    const defaultSettings: PodcastLevelSettings = {
      identity: {
        tone: 'ودودة ومهنية',
        style: ['تفاعلي', 'تعليمي'],
        audience: 'المهتمين بالتكنولوجيا',
        brandVoice: 'عربية فصحى معاصرة',
        hostName: ''
      },
      advanced: {
        autoSave: true,
        aiSuggestions: true,
        exportFormat: 'docx'
      }
    };

    const podcast: Podcast = {
      id: `podcast_${Date.now()}`,
      name,
      description,
      settings: {
        ...defaultSettings,
        ...settings,
        identity: { ...defaultSettings.identity, ...settings?.identity },
        advanced: { ...defaultSettings.advanced, ...settings?.advanced }
      },
      knowledgeBase: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    this.savePodcast(podcast);
    return podcast;
  }
};
