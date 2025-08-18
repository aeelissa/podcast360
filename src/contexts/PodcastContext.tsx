import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Podcast, Episode, HierarchyContext, PodcastLevelSettings, EpisodeLevelSettings } from '../types/podcast';
import { podcastStorage } from '../utils/podcastStorage';
import { episodeStorage } from '../utils/episodeStorage';
import { dataMigration } from '../utils/dataMigration';

interface PodcastContextType extends HierarchyContext {
  // Podcast management
  createPodcast: (name: string, description: string, settings?: Partial<PodcastLevelSettings>) => Promise<Podcast>;
  selectPodcast: (podcastId: string) => void;
  updatePodcast: (podcast: Podcast) => void;
  deletePodcast: (podcastId: string) => void;
  
  // Episode management
  createEpisode: (title: string, description?: string, settings?: Partial<EpisodeLevelSettings>) => Promise<Episode>;
  selectEpisode: (episodeId: string) => void;
  updateEpisode: (episode: Episode) => void;
  deleteEpisode: (episodeId: string) => void;
  
  // UI state
  isLoading: boolean;
  needsOnboarding: boolean;
  migrationStatus: {
    isComplete: boolean;
    hasExistingData: boolean;
    needsOnboarding: boolean;
  };
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

interface PodcastProviderProps {
  children: ReactNode;
}

export const PodcastProvider: React.FC<PodcastProviderProps> = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [episodesForCurrentPodcast, setEpisodesForCurrentPodcast] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(dataMigration.getMigrationStatus());

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load episodes when podcast changes
  useEffect(() => {
    if (currentPodcast) {
      const episodes = episodeStorage.getEpisodesForPodcast(currentPodcast.id);
      setEpisodesForCurrentPodcast(episodes);
      
      // Auto-select first episode if none selected
      if (!currentEpisode && episodes.length > 0) {
        setCurrentEpisode(episodes[0]);
      }
    } else {
      setEpisodesForCurrentPodcast([]);
      setCurrentEpisode(null);
    }
  }, [currentPodcast, currentEpisode]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Handle migration if needed
      if (dataMigration.needsMigration()) {
        await dataMigration.migrate();
        setMigrationStatus(dataMigration.getMigrationStatus());
      }
      
      const podcasts = podcastStorage.getAllPodcasts();
      setAllPodcasts(podcasts);
      
      if (podcasts.length === 0) {
        setNeedsOnboarding(true);
      } else {
        // Auto-select first podcast if none selected
        const firstPodcast = podcasts[0];
        setCurrentPodcast(firstPodcast);
        setNeedsOnboarding(false);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPodcast = async (name: string, description: string, settings?: Partial<PodcastLevelSettings>): Promise<Podcast> => {
    try {
      const podcast = podcastStorage.createPodcast(name, description, settings);
      setAllPodcasts(prev => [...prev, podcast]);
      setCurrentPodcast(podcast);
      setNeedsOnboarding(false);
      return podcast;
    } catch (error) {
      console.error('Error creating podcast:', error);
      throw error;
    }
  };

  const selectPodcast = (podcastId: string) => {
    const podcast = allPodcasts.find(p => p.id === podcastId);
    if (podcast) {
      setCurrentPodcast(podcast);
      setCurrentEpisode(null); // Clear current episode when switching podcasts
    }
  };

  const updatePodcast = (podcast: Podcast) => {
    podcastStorage.savePodcast(podcast);
    setAllPodcasts(prev => prev.map(p => p.id === podcast.id ? podcast : p));
    if (currentPodcast?.id === podcast.id) {
      setCurrentPodcast(podcast);
    }
  };

  const deletePodcast = (podcastId: string) => {
    podcastStorage.deletePodcast(podcastId);
    setAllPodcasts(prev => prev.filter(p => p.id !== podcastId));
    if (currentPodcast?.id === podcastId) {
      const remainingPodcasts = allPodcasts.filter(p => p.id !== podcastId);
      setCurrentPodcast(remainingPodcasts.length > 0 ? remainingPodcasts[0] : null);
    }
  };

  const createEpisode = async (title: string, description?: string, settings?: Partial<EpisodeLevelSettings>): Promise<Episode> => {
    if (!currentPodcast) {
      throw new Error('No podcast selected');
    }
    
    try {
      const episode = episodeStorage.createEpisode(title, currentPodcast.id, description, settings);
      setEpisodesForCurrentPodcast(prev => [...prev, episode]);
      setCurrentEpisode(episode);
      return episode;
    } catch (error) {
      console.error('Error creating episode:', error);
      throw error;
    }
  };

  const selectEpisode = (episodeId: string) => {
    const episode = episodesForCurrentPodcast.find(e => e.id === episodeId);
    if (episode) {
      setCurrentEpisode(episode);
    }
  };

  const updateEpisode = (episode: Episode) => {
    episodeStorage.saveEpisode(episode);
    setEpisodesForCurrentPodcast(prev => prev.map(e => e.id === episode.id ? episode : e));
    if (currentEpisode?.id === episode.id) {
      setCurrentEpisode(episode);
    }
  };

  const deleteEpisode = (episodeId: string) => {
    episodeStorage.deleteEpisode(episodeId);
    setEpisodesForCurrentPodcast(prev => prev.filter(e => e.id !== episodeId));
    if (currentEpisode?.id === episodeId) {
      const remainingEpisodes = episodesForCurrentPodcast.filter(e => e.id !== episodeId);
      setCurrentEpisode(remainingEpisodes.length > 0 ? remainingEpisodes[0] : null);
    }
  };

  return (
    <PodcastContext.Provider value={{
      // State
      currentPodcast,
      currentEpisode,
      allPodcasts,
      episodesForCurrentPodcast,
      isLoading,
      needsOnboarding,
      migrationStatus,
      
      // Podcast methods
      createPodcast,
      selectPodcast,
      updatePodcast,
      deletePodcast,
      
      // Episode methods
      createEpisode,
      selectEpisode,
      updateEpisode,
      deleteEpisode
    }}>
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcast = () => {
  const context = useContext(PodcastContext);
  if (context === undefined) {
    throw new Error('usePodcast must be used within a PodcastProvider');
  }
  return context;
};
