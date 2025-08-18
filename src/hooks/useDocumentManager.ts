
import { useState, useEffect, useCallback } from 'react';
import { Document, DocumentType } from '../types/document';
import { documentStorage } from '../utils/documentStorage';
import { createDocumentFromTemplate } from '../utils/documentTemplates';
import { usePodcast } from '../contexts/PodcastContext';

export const useDocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  // Get current episode context
  const { currentEpisode, currentPodcast } = usePodcast();

  // Load episode-specific documents when episode changes
  useEffect(() => {
    if (currentEpisode) {
      console.log('Loading documents for episode:', currentEpisode.title);
      const episodeDocuments = documentStorage.getDocumentsByEpisode(currentEpisode.id);
      setDocuments(episodeDocuments);
      
      // Auto-select concept document if available, or first document
      const conceptDoc = episodeDocuments.find(doc => doc.type === 'concept');
      const firstDoc = episodeDocuments.length > 0 ? episodeDocuments[0] : null;
      setActiveDocument(conceptDoc || firstDoc);
    } else {
      // Clear documents when no episode is selected
      setDocuments([]);
      setActiveDocument(null);
    }
  }, [currentEpisode]);

  // Generate document ID with episode context
  const generateDocumentId = (type: DocumentType): string => {
    const timestamp = Date.now();
    const episodeId = currentEpisode?.id || 'no_episode';
    return `podcast360_${episodeId}_${type}_${timestamp}`;
  };

  // Create a new document from template for current episode
  const createDocument = useCallback((type: DocumentType): Document => {
    if (!currentEpisode) {
      throw new Error('No episode selected. Cannot create document.');
    }

    const template = createDocumentFromTemplate(type);
    const now = new Date().toISOString();
    
    const newDocument: Document = {
      id: generateDocumentId(type),
      title: `${template.title} - ${currentEpisode.title}`,
      content: template.content,
      type: template.type,
      episodeId: currentEpisode.id,
      createdAt: now,
      modifiedAt: now,
      metadata: {
        ...template.metadata,
        podcastId: currentPodcast?.id,
        episodeId: currentEpisode.id
      }
    };

    documentStorage.saveDocument(newDocument);
    setDocuments(prev => [...prev, newDocument]);
    
    console.log('Created document for episode:', {
      document: newDocument.title,
      episode: currentEpisode.title,
      podcast: currentPodcast?.name
    });
    
    return newDocument;
  }, [currentEpisode, currentPodcast]);

  // Get or create document for current episode - with null checks
  const getOrCreateDocument = useCallback((type: DocumentType): Document => {
    if (!currentEpisode) {
      throw new Error('No episode selected. Cannot get or create document.');
    }

    const existingDoc = documents.find(doc => doc.type === type && doc.episodeId === currentEpisode.id);
    if (existingDoc) {
      return existingDoc;
    }
    return createDocument(type);
  }, [documents, currentEpisode, createDocument]);

  // Safe version that returns null instead of throwing
  const safeGetOrCreateDocument = useCallback((type: DocumentType): Document | null => {
    if (!currentEpisode) {
      console.warn('No episode selected. Cannot get or create document.');
      return null;
    }

    try {
      return getOrCreateDocument(type);
    } catch (error) {
      console.error('Error getting or creating document:', error);
      return null;
    }
  }, [currentEpisode, getOrCreateDocument]);

  // Save document with enhanced context logging
  const saveDocument = useCallback((document: Document) => {
    setSaveStatus('saving');
    
    const updatedDocument = {
      ...document,
      modifiedAt: new Date().toISOString()
    };

    documentStorage.saveDocument(updatedDocument);
    
    setDocuments(prev => 
      prev.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
    );

    console.log('Saved document:', {
      document: updatedDocument.title,
      episode: currentEpisode?.title,
      podcast: currentPodcast?.name
    });

    // Simulate save delay for user feedback
    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  }, [currentEpisode, currentPodcast]);

  // Update document content with context awareness
  const updateDocumentContent = useCallback((documentId: string, content: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const updatedDocument = { ...document, content };
      saveDocument(updatedDocument);
      
      if (activeDocument?.id === documentId) {
        setActiveDocument(updatedDocument);
      }
    }
  }, [documents, activeDocument, saveDocument]);

  return {
    documents,
    activeDocument,
    setActiveDocument,
    saveStatus,
    getOrCreateDocument,
    safeGetOrCreateDocument,
    updateDocumentContent,
    saveDocument,
    currentEpisodeContext: currentEpisode
  };
};
