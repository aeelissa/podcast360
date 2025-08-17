
import { useState, useEffect, useCallback } from 'react';
import { Document, DocumentType } from '../types/document';
import { documentStorage } from '../utils/documentStorage';
import { createDocumentFromTemplate } from '../utils/documentTemplates';

export const useDocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Load documents on mount
  useEffect(() => {
    const loadedDocuments = documentStorage.getAllDocuments();
    setDocuments(loadedDocuments);
  }, []);

  // Generate document ID
  const generateDocumentId = (type: DocumentType): string => {
    const timestamp = Date.now();
    return `podcast360_${type}_${timestamp}`;
  };

  // Create a new document from template
  const createDocument = useCallback((type: DocumentType): Document => {
    const template = createDocumentFromTemplate(type);
    const now = new Date().toISOString();
    
    const newDocument: Document = {
      id: generateDocumentId(type),
      title: template.title,
      content: template.content,
      type: template.type,
      createdAt: now,
      modifiedAt: now,
      metadata: template.metadata
    };

    documentStorage.saveDocument(newDocument);
    setDocuments(prev => [...prev, newDocument]);
    
    return newDocument;
  }, []);

  // Get or create document for a type
  const getOrCreateDocument = useCallback((type: DocumentType): Document => {
    const existingDoc = documents.find(doc => doc.type === type);
    if (existingDoc) {
      return existingDoc;
    }
    return createDocument(type);
  }, [documents, createDocument]);

  // Save document with debouncing
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

    // Simulate save delay for user feedback
    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  }, []);

  // Update document content
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
    updateDocumentContent,
    saveDocument
  };
};
