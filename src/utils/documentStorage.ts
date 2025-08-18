
import { Document, DocumentType } from '../types/document';

const STORAGE_KEY = 'podcast360_documents';

export const documentStorage = {
  // Get all documents from localStorage
  getAllDocuments(): Document[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading documents:', error);
      return [];
    }
  },

  // Save a document to localStorage
  saveDocument(document: Document): void {
    try {
      const documents = this.getAllDocuments();
      const existingIndex = documents.findIndex(doc => doc.id === document.id);
      
      if (existingIndex >= 0) {
        documents[existingIndex] = document;
      } else {
        documents.push(document);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving document:', error);
    }
  },

  // Get a document by ID
  getDocument(id: string): Document | null {
    const documents = this.getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  },

  // Get documents by type
  getDocumentsByType(type: DocumentType): Document[] {
    const documents = this.getAllDocuments();
    return documents.filter(doc => doc.type === type);
  },

  // Get documents by episode ID
  getDocumentsByEpisode(episodeId: string): Document[] {
    const documents = this.getAllDocuments();
    return documents.filter(doc => doc.episodeId === episodeId);
  },

  // Get documents by episode ID and type
  getDocumentsByEpisodeAndType(episodeId: string, type: DocumentType): Document[] {
    const documents = this.getAllDocuments();
    return documents.filter(doc => doc.episodeId === episodeId && doc.type === type);
  },

  // Delete a document
  deleteDocument(id: string): void {
    try {
      const documents = this.getAllDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  },

  // Migrate existing documents to new episode-based structure
  migrateToEpisodeStructure(defaultEpisodeId: string): void {
    try {
      const documents = this.getAllDocuments();
      const migratedDocuments = documents.map(doc => ({
        ...doc,
        episodeId: doc.episodeId || defaultEpisodeId
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedDocuments));
      console.log(`Migrated ${documents.length} documents to episode structure`);
    } catch (error) {
      console.error('Error migrating documents:', error);
    }
  }
};
