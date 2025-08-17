
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document } from '../types/document';

export interface DocumentSection {
  title: string;
  content: string;
  level: number;
  anchor: string;
}

interface DocumentContextType {
  activeDocument: Document | null;
  setActiveDocument: (document: Document | null) => void;
  insertContentAtCursor: (content: string) => void;
  saveAsNote: (content: string) => void;
  cursorPosition: number | null;
  setCursorPosition: (position: number | null) => void;
  currentSection: string | null;
  setCurrentSection: (section: string | null) => void;
  getDocumentSections: () => DocumentSection[];
  getFullDocumentContent: () => string;
  getCurrentSectionKey: () => 'concept' | 'preparation' | 'script' | 'global';
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  const getDocumentSections = (): DocumentSection[] => {
    if (!activeDocument?.content) return [];
    
    const sections: DocumentSection[] = [];
    const lines = activeDocument.content.split('\n');
    let currentSectionContent = '';
    let currentTitle = '';
    let currentLevel = 0;
    
    lines.forEach((line, index) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
      
      if (headingMatch) {
        // Save previous section
        if (currentTitle) {
          sections.push({
            title: currentTitle,
            content: currentSectionContent.trim(),
            level: currentLevel,
            anchor: currentTitle.toLowerCase().replace(/\s+/g, '-')
          });
        }
        
        // Start new section
        currentLevel = headingMatch[1].length;
        currentTitle = headingMatch[2];
        currentSectionContent = '';
      } else {
        currentSectionContent += line + '\n';
      }
    });
    
    // Add final section
    if (currentTitle) {
      sections.push({
        title: currentTitle,
        content: currentSectionContent.trim(),
        level: currentLevel,
        anchor: currentTitle.toLowerCase().replace(/\s+/g, '-')
      });
    }
    
    return sections;
  };

  const getFullDocumentContent = (): string => {
    return activeDocument?.content || '';
  };

  const getCurrentSectionKey = (): 'concept' | 'preparation' | 'script' | 'global' => {
    if (!activeDocument) return 'global';
    return activeDocument.type as 'concept' | 'preparation' | 'script';
  };

  const insertContentAtCursor = (content: string) => {
    console.log('Inserting content at cursor:', content);
    if (activeDocument) {
      // Smart insertion logic - for now append with proper spacing
      const existingContent = activeDocument.content;
      const separator = existingContent.trim() ? '\n\n' : '';
      const updatedContent = existingContent + separator + content;
      
      setActiveDocument({
        ...activeDocument,
        content: updatedContent,
        modifiedAt: new Date().toISOString()
      });
    }
  };

  const saveAsNote = (content: string) => {
    const notes = JSON.parse(localStorage.getItem('podcast360_notes') || '[]');
    const newNote = {
      id: `note_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      documentId: activeDocument?.id || null,
      sectionKey: getCurrentSectionKey()
    };
    notes.push(newNote);
    localStorage.setItem('podcast360_notes', JSON.stringify(notes));
    console.log('Saved as note:', content);
  };

  return (
    <DocumentContext.Provider value={{
      activeDocument,
      setActiveDocument,
      insertContentAtCursor,
      saveAsNote,
      cursorPosition,
      setCursorPosition,
      currentSection,
      setCurrentSection,
      getDocumentSections,
      getFullDocumentContent,
      getCurrentSectionKey
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};
