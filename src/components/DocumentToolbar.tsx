import React, { useState, useCallback, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  List, 
  ListOrdered, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Save,
  Undo,
  Redo,
  Link,
  Palette
} from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getSelection, 
  $isRangeSelection, 
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND
} from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import ExportButton from './ExportButton';
import { useDocumentContext } from '../contexts/DocumentContext';

interface DocumentToolbarProps {
  saveStatus: 'saved' | 'saving' | 'error';
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({ saveStatus }) => {
  const [editor] = useLexicalComposerContext();
  const { activeDocument } = useDocumentContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontSize, setFontSize] = useState('16');

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertList = (type: 'bullet' | 'number') => {
    if (type === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const undoCommand = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redoCommand = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    // This would require custom styling implementation
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
    <div className="flex items-center justify-between p-3 border-b border-podcast-border bg-gray-50 flex-wrap gap-2">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Undo/Redo */}
        <button
          onClick={undoCommand}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo 
              ? 'hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue' 
              : 'text-podcast-gray/50 cursor-not-allowed'
          }`}
          title="تراجع"
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          onClick={redoCommand}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo 
              ? 'hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue' 
              : 'text-podcast-gray/50 cursor-not-allowed'
          }`}
          title="إعادة"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Font Size */}
        <select
          value={fontSize}
          onChange={(e) => changeFontSize(e.target.value)}
          className="px-2 py-1 rounded text-sm border border-podcast-border bg-white"
          title="حجم الخط"
        >
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="24">24</option>
        </select>

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Text Formatting */}
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

        <button
          onClick={() => formatText('underline')}
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="تحته خط"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Text Color */}
        <button
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="لون النص"
        >
          <Palette className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Headings */}
        <select
          onChange={(e) => {
            if (e.target.value === 'h1' || e.target.value === 'h2' || e.target.value === 'h3') {
              formatHeading(e.target.value as HeadingTagType);
            }
          }}
          className="px-2 py-1 rounded text-sm border border-podcast-border bg-white"
          title="نوع النص"
          defaultValue=""
        >
          <option value="">عادي</option>
          <option value="h1">عنوان كبير</option>
          <option value="h2">عنوان متوسط</option>
          <option value="h3">عنوان صغير</option>
        </select>

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Lists */}
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

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Alignment */}
        <button
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="محاذاة يسار"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="محاذاة وسط"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="محاذاة يمين"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-podcast-border mx-1"></div>

        {/* Link */}
        <button
          className="p-2 rounded-lg hover:bg-podcast-blue/10 text-podcast-gray hover:text-podcast-blue transition-colors"
          title="إدراج رابط"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Export Button */}
        {activeDocument && (
          <ExportButton document={activeDocument} />
        )}
        
        {/* Save Status */}
        <div className={`flex items-center gap-2 text-sm font-medium ${getSaveStatusColor()}`}>
          <Save className="w-4 h-4" />
          <span>{getSaveStatusText()}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentToolbar;
