
import { Episode, EpisodeLevelSettings } from '../types/podcast';

const EPISODES_KEY = 'podcast360_episodes';

export const episodeStorage = {
  // Get all episodes
  getAllEpisodes(): Episode[] {
    try {
      const stored = localStorage.getItem(EPISODES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading episodes:', error);
      return [];
    }
  },

  // Get episodes for a specific podcast
  getEpisodesForPodcast(podcastId: string): Episode[] {
    const episodes = this.getAllEpisodes();
    return episodes.filter(e => e.podcastId === podcastId);
  },

  // Save an episode
  saveEpisode(episode: Episode): void {
    try {
      const episodes = this.getAllEpisodes();
      const existingIndex = episodes.findIndex(e => e.id === episode.id);
      
      if (existingIndex >= 0) {
        episodes[existingIndex] = { ...episode, modifiedAt: new Date().toISOString() };
      } else {
        episodes.push(episode);
      }
      
      localStorage.setItem(EPISODES_KEY, JSON.stringify(episodes));
    } catch (error) {
      console.error('Error saving episode:', error);
    }
  },

  // Get an episode by ID
  getEpisode(id: string): Episode | null {
    const episodes = this.getAllEpisodes();
    return episodes.find(e => e.id === id) || null;
  },

  // Delete an episode
  deleteEpisode(id: string): void {
    try {
      const episodes = this.getAllEpisodes();
      const filtered = episodes.filter(e => e.id !== id);
      localStorage.setItem(EPISODES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting episode:', error);
    }
  },

  // Create a new episode with default settings
  createEpisode(title: string, podcastId: string, description?: string, settings?: Partial<EpisodeLevelSettings>): Episode {
    const defaultSettings: EpisodeLevelSettings = {
      goals: ['تقديم محتوى قيم للمستمعين'],
      successCriteria: ['الحصول على تفاعل إيجابي من المستمعين'],
      duration: 30,
      contentType: 'مقابلة'
    };

    const episode: Episode = {
      id: `episode_${Date.now()}`,
      title,
      description,
      podcastId,
      settings: { ...defaultSettings, ...settings },
      documents: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    this.saveEpisode(episode);
    return episode;
  }
};
