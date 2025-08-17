import React, { useState, useCallback, useMemo } from 'react';
import { FileText, Settings, Code } from 'lucide-react';
import { DocumentType } from '../types/document';
import { useDocumentManager } from '../hooks/useDocumentManager';
import { useDocumentContext } from '../contexts/DocumentContext';
import DocumentEditor from './DocumentEditor';

interface TabData {
  id: DocumentType;
  title: string;
  icon: React.ReactNode;
}

const WorkArea = () => {
  const [activeTab, setActiveTab] = useState<DocumentType>('concept');
  
  const {
    activeDocument,
    setActiveDocument,
    saveStatus,
    getOrCreateDocument,
    updateDocumentContent
  } = useDocumentManager();

  // Import document context
  const { setActiveDocument: setContextDocument } = useDocumentContext();

  const tabs: TabData[] = [
    {
      id: 'concept',
      title: 'ورقة التصور',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'preparation',
      title: 'ورقة الإعداد',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'script',
      title: 'ورقة السكربت',
      icon: <Code className="w-4 h-4" />,
    }
  ];

  // Handle tab switching
  const handleTabSwitch = useCallback((tabId: DocumentType) => {
    setActiveTab(tabId);
    const document = getOrCreateDocument(tabId);
    setActiveDocument(document);
    setContextDocument(document); // Update context
  }, [getOrCreateDocument, setActiveDocument, setContextDocument]);

  // Handle content changes
  const handleContentChange = useCallback((content: string) => {
    if (activeDocument) {
      const updatedDocument = { ...activeDocument, content };
      updateDocumentContent(activeDocument.id, content);
      setContextDocument(updatedDocument); // Update context
    }
  }, [activeDocument, updateDocumentContent, setContextDocument]);

  // Initialize active document when component mounts or tab changes
  React.useEffect(() => {
    const document = getOrCreateDocument(activeTab);
    setActiveDocument(document);
    setContextDocument(document); // Update context
  }, [activeTab, getOrCreateDocument, setActiveDocument, setContextDocument]);

  const currentTab = useMemo(() => 
    tabs.find(tab => tab.id === activeTab), 
    [activeTab, tabs]
  );

  return (
    <div className="podcast-panel h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-podcast-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'border-podcast-blue text-podcast-blue bg-podcast-blue/5 font-bold'
                  : 'border-transparent text-podcast-gray hover:text-podcast-blue hover:bg-podcast-blue/5'
              }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Document Title */}
      <div className="p-4 border-b border-podcast-border">
        <div className="text-right">
          {currentTab && (
            <>
              <h3 className="text-lg font-bold text-podcast-blue">
                {currentTab.title}
              </h3>
              {activeDocument && (
                <p className="text-sm text-podcast-gray">
                  آخر تعديل: {new Date(activeDocument.modifiedAt).toLocaleDateString('ar-SA')}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Document Editor */}
      <div className="flex-1 overflow-hidden">
        {activeDocument ? (
          <DocumentEditor
            document={activeDocument}
            onContentChange={handleContentChange}
            saveStatus={saveStatus}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-podcast-gray">
            <p>جاري تحميل المستند...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkArea;
