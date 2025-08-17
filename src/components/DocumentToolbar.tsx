
import React from 'react';
import { Bold, Italic, List, ListOrdered, Type, Save } from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';

interface DocumentToolbarProps {
  saveStatus: 'saved' | 'saving' | 'error';
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({ saveStatus }) => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertList = (type: 'bullet' | 'number') => {
    if (type === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'جاري الحفظ...';
      case 'saved':
        return 'محفوظ تلقائياً';
      case 'error':
        return 'خطأ في الحفظ';
      default:
        return 'محفوظ تلقائياً';
    }
  };

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'text-podcast-gold';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-podcast-gray';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-podcast-border bg-gray-50">
      <div className="flex items-center gap-2">
        <button
          onClick={() => formatText('bold')}
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="عريض"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => formatText('italic')}
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="مائل"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-podcast-border mx-1"></div>
        
        <button
          onClick={() => insertList('bullet')}
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => insertList('number')}
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="قائمة مرقمة"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div className={`flex items-center gap-2 text-sm font-medium ${getSaveStatusColor()}`}>
        <Save className="w-4 h-4" />
        <span>{getSaveStatusText()}</span>
      </div>
    </div>
  );
};

export default DocumentToolbar;
