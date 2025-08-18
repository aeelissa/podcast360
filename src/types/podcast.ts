
export interface Podcast {
  id: string;
  name: string;
  description: string;
  settings: PodcastLevelSettings;
  knowledgeBase: KnowledgeFile[];
  createdAt: string;
  modifiedAt: string;
}

export interface Episode {
  id: string;
  title: string;
  description?: string;
  podcastId: string;
  settings: EpisodeLevelSettings;
  documents: string[]; // Document IDs
  createdAt: string;
  modifiedAt: string;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx';
  size: number; // in bytes, max 10MB
  content: string; // base64 encoded
  extractedText?: string; // extracted text content for AI
  uploadedAt: string;
}

export interface PodcastLevelSettings {
  identity: {
    tone: string;
    style: string[];
    audience: string;
    brandVoice: string;
    hostName?: string;
  };
  advanced: {
    autoSave: boolean;
    aiSuggestions: boolean;
    exportFormat: string;
  };
}

export interface EpisodeLevelSettings {
  goals: string[];
  successCriteria: string[];
  duration: number;
  contentType: string;
  // These will inherit from podcast settings but can be overridden
  identity?: Partial<PodcastLevelSettings['identity']>;
  advanced?: Partial<PodcastLevelSettings['advanced']>;
}

export interface HierarchyContext {
  currentPodcast: Podcast | null;
  currentEpisode: Episode | null;
  allPodcasts: Podcast[];
  episodesForCurrentPodcast: Episode[];
}
