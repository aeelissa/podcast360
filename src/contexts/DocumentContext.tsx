
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document } from '../types/document';
import { usePodcast } from './PodcastContext';

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

  // Get podcast context to sync with current episode
  const { currentEpisode, currentPodcast } = usePodcast();

  // Enhanced auto-sync when episode changes
  useEffect(() => {
    if (currentEpisode && currentPodcast) {
      console.log('Episode context changed, updating document context:', {
        podcast: currentPodcast.name,
        episode: currentEpisode.title,
        previousDocument: activeDocument?.type
      });
      
      // Clear document context when switching episodes for clean slate
      setActiveDocument(null);
      setCursorPosition(null);
      setCurrentSection(null);
      
      // Log the context switch
      console.log('Document context cleared for new episode');
    } else if (!currentEpisode) {
      // Clear everything when no episode is selected
      setActiveDocument(null);
      setCursorPosition(null);
      setCurrentSection(null);
      console.log('Document context cleared - no episode selected');
    }
  }, [currentEpisode?.id, currentPodcast?.id]); // Only trigger on ID changes

  const getDocumentSections = (): DocumentSection[] => {
    if (!activeDocument?.content) return [];
    
    const sections: DocumentSection[] = [];
    const lines = activeDocument.content.split('\n');
    let currentSectionContent = '';
    let currentTitle = '';
    let currentLevel = 0;
    
    lines.forEach((line) => {
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
    console.log('DocumentContext: Inserting content at cursor:', content.substring(0, 100) + '...');
    console.log('Current context:', {
      podcast: currentPodcast?.name,
      episode: currentEpisode?.title,
      document: activeDocument?.type
    });
    
    if (activeDocument) {
      // Enhanced insertion logic with better content formatting
      const existingContent = activeDocument.content;
      let updatedContent: string;
      
      if (cursorPosition !== null && cursorPosition >= 0) {
        // Insert at specific cursor position if available
        updatedContent = existingContent.slice(0, cursorPosition) + 
          '\n\n' + content + '\n\n' + 
          existingContent.slice(cursorPosition);
      } else {
        // Fallback to appending with proper spacing
        const separator = existingContent.trim() ? '\n\n' : '';
        updatedContent = existingContent + separator + content;
      }
      
      const updatedDocument = {
        ...activeDocument,
        content: updatedContent,
        modifiedAt: new Date().toISOString()
      };
      
      setActiveDocument(updatedDocument);
      
      console.log('Content inserted successfully:', {
        originalLength: existingContent.length,
        newLength: updatedContent.length,
        addedLength: content.length
      });
    } else {
      console.warn('Cannot insert content: No active document');
    }
  };

  const saveAsNote = (content: string) => {
    const notes = JSON.parse(localStorage.getItem('podcast360_notes') || '[]');
    const newNote = {
      id: `note_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      documentId: activeDocument?.id || null,
      episodeId: currentEpisode?.id || null,
      podcastId: currentPodcast?.id || null,
      sectionKey: getCurrentSectionKey(),
      context: {
        podcastName: currentPodcast?.name,
        episodeTitle: currentEpisode?.title,
        documentType: activeDocument?.type
      }
    };
    notes.push(newNote);
    localStorage.setItem('podcast360_notes', JSON.stringify(notes));
    console.log('Saved as note with enhanced episode context:', newNote);
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
