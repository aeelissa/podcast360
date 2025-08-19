
import React, { useState, useCallback, useMemo } from 'react';
import { FileText, Settings, Code } from 'lucide-react';
import { DocumentType } from '../types/document';
import { useDocumentManager } from '../hooks/useDocumentManager';
import { useDocumentContext } from '../contexts/DocumentContext';
import { usePodcast } from '../contexts/PodcastContext';
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
  
  // Get current episode context
  const { currentEpisode, currentPodcast } = usePodcast();

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
    if (!currentEpisode) {
      console.warn('Cannot switch tabs: No episode selected');
      return;
    }
    
    setActiveTab(tabId);
    const document = getOrCreateDocument(tabId);
    setActiveDocument(document);
    setContextDocument(document); // Update context
  }, [getOrCreateDocument, setActiveDocument, setContextDocument, currentEpisode]);

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
    if (currentEpisode) {
      const document = getOrCreateDocument(activeTab);
      setActiveDocument(document);
      setContextDocument(document); // Update context
    } else {
      // Clear active document when no episode is selected
      setActiveDocument(null);
      setContextDocument(null);
    }
  }, [activeTab, getOrCreateDocument, setActiveDocument, setContextDocument, currentEpisode]);

  const currentTab = useMemo(() => 
    tabs.find(tab => tab.id === activeTab), 
    [activeTab, tabs]
  );

  // Show episode selection prompt when no episode is selected
  if (!currentEpisode) {
    return (
      <div className="podcast-panel h-full flex flex-col">
        {/* Tab Navigation - Disabled */}
        <div className="border-b border-podcast-border">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                disabled
                className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-podcast-gray/50 cursor-not-allowed whitespace-nowrap font-medium arabic-text"
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 arabic-content">
            <FileText className="w-16 h-16 text-podcast-gray/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-podcast-gray mb-2">
              اختر حلقة للبدء
            </h3>
            <p className="text-podcast-gray/70 text-sm leading-relaxed">
              {currentPodcast 
                ? 'اختر حلقة من القائمة أعلاه لبدء العمل على المستندات'
                : 'أنشئ بودكاست جديد وحلقة للبدء في العمل'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-panel h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-podcast-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium arabic-text ${
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
      <div className="p-4 border-b border-podcast-border arabic-content">
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
          <div className="flex items-center justify-center h-full text-podcast-gray arabic-text">
            <p>جاري تحميل المستند...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkArea;
