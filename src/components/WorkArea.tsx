
import React, { useState, useCallback, useMemo } from 'react';
import { FileText, Settings, Code, Languages } from 'lucide-react';
import { DocumentType } from '../types/document';
import { useDocumentManager } from '../hooks/useDocumentManager';
import DocumentEditor from './DocumentEditor';

interface TabData {
  id: DocumentType;
  title: string;
  icon: React.ReactNode;
}

const WorkArea = () => {
  const [activeTab, setActiveTab] = useState<DocumentType>('concept');
  const [isEasternNumerals, setIsEasternNumerals] = useState(false);
  
  const {
    activeDocument,
    setActiveDocument,
    saveStatus,
    getOrCreateDocument,
    updateDocumentContent
  } = useDocumentManager();

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

  // Function to convert Western numerals to Eastern Arabic numerals
  const convertToEasternNumerals = useCallback((text: string) => {
    if (!isEasternNumerals) return text;
    
    const westernToEastern = {
      '0': '٠',
      '1': '١',
      '2': '٢',
      '3': '٣',
      '4': '٤',
      '5': '٥',
      '6': '٦',
      '7': '٧',
      '8': '٨',
      '9': '٩'
    };
    
    return text.replace(/[0-9]/g, (digit) => westernToEastern[digit as keyof typeof westernToEastern] || digit);
  }, [isEasternNumerals]);

  // Handle tab switching
  const handleTabSwitch = useCallback((tabId: DocumentType) => {
    setActiveTab(tabId);
    const document = getOrCreateDocument(tabId);
    setActiveDocument(document);
  }, [getOrCreateDocument, setActiveDocument]);

  // Handle content changes
  const handleContentChange = useCallback((content: string) => {
    if (activeDocument) {
      updateDocumentContent(activeDocument.id, content);
    }
  }, [activeDocument, updateDocumentContent]);

  // Initialize active document when component mounts or tab changes
  React.useEffect(() => {
    const document = getOrCreateDocument(activeTab);
    setActiveDocument(document);
  }, [activeTab, getOrCreateDocument, setActiveDocument]);

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
              <span>{convertToEasternNumerals(tab.title)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-podcast-border">
        <div className="flex justify-between items-center">
          {/* Language Toggle */}
          <button
            onClick={() => setIsEasternNumerals(!isEasternNumerals)}
            className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium text-podcast-gray hover:text-podcast-blue"
          >
            <Languages className="w-3 h-3" />
            <span>تبديل اللغة</span>
          </button>

          {/* Document Title */}
          {currentTab && (
            <div className="text-right">
              <h3 className="text-lg font-bold text-podcast-blue">
                {convertToEasternNumerals(currentTab.title)}
              </h3>
              {activeDocument && (
                <p className="text-sm text-podcast-gray">
                  آخر تعديل: {convertToEasternNumerals(
                    new Date(activeDocument.modifiedAt).toLocaleDateString('ar-SA')
                  )}
                </p>
              )}
            </div>
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
