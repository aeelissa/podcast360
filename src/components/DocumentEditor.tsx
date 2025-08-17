
import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $insertNodes, $createParagraphNode, $createTextNode } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { Document } from '../types/document';
import DocumentToolbar from './DocumentToolbar';

interface DocumentEditorProps {
  document: Document;
  onContentChange: (content: string) => void;
  saveStatus: 'saved' | 'saving' | 'error';
}

// Plugin to set initial content
function InitialContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      
      if (content.trim()) {
        // Parse HTML content
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      } else {
        // Add empty paragraph if no content
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(''));
        root.append(paragraph);
      }
    });
  }, [editor, content]);

  return null;
}

// Theme configuration for RTL and Arabic text
const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  heading: {
    h1: 'text-2xl font-bold text-podcast-blue mb-4 text-right',
    h2: 'text-xl font-bold text-podcast-blue mb-3 text-right',
    h3: 'text-lg font-bold text-podcast-blue mb-2 text-right',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-inside text-right',
    ul: 'list-disc list-inside text-right',
    listitem: 'mb-1',
  },
  paragraph: 'mb-2 text-right leading-relaxed',
  quote: 'border-r-4 border-podcast-blue pl-4 italic text-podcast-gray',
};

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  document, 
  onContentChange, 
  saveStatus 
}) => {
  const initialConfig = {
    namespace: 'DocumentEditor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
  };

  const handleContentChange = (editorState: any) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(null);
      onContentChange(htmlString);
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <DocumentToolbar saveStatus={saveStatus} />
        
        <div className="flex-1 overflow-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-full p-6 outline-none text-right resize-none leading-relaxed focus:outline-none"
                style={{ 
                  direction: 'rtl',
                  fontFamily: 'inherit'
                }}
              />
            }
            placeholder={
              <div className="absolute top-6 right-6 text-podcast-gray pointer-events-none">
                ابدأ الكتابة هنا...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={handleContentChange} />
          <InitialContentPlugin content={document.content} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default DocumentEditor;
