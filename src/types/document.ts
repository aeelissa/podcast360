
export type DocumentType = 'concept' | 'preparation' | 'script';

export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  createdAt: string;
  modifiedAt: string;
  episodeId?: string; // Link to episode
  metadata?: {
    podcastName?: string;
    episodeNumber?: number;
    duration?: string;
    targetAudience?: string;
  };
}

export interface DocumentTemplate {
  type: DocumentType;
  title: string;
  content: string;
  metadata?: Document['metadata'];
}
