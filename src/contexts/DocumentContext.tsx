
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document } from '../types/document';

interface DocumentContextType {
  activeDocument: Document | null;
  setActiveDocument: (document: Document | null) => void;
  insertContentAtCursor: (content: string) => void;
  saveAsNote: (content: string) => void;
  cursorPosition: number | null;
  setCursorPosition: (position: number | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const insertContentAtCursor = (content: string) => {
    // This will be implemented to work with the Lexical editor
    console.log('Inserting content at cursor:', content);
    // For now, just append to document content
    if (activeDocument) {
      const updatedContent = activeDocument.content + '\n\n' + content;
      setActiveDocument({
        ...activeDocument,
        content: updatedContent,
        modifiedAt: new Date().toISOString()
      });
    }
  };

  const saveAsNote = (content: string) => {
    // Save as a note in localStorage
    const notes = JSON.parse(localStorage.getItem('podcast360_notes') || '[]');
    const newNote = {
      id: `note_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      documentId: activeDocument?.id || null
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
      setCursorPosition
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
