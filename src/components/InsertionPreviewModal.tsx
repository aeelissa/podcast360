
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Eye, FileText, MapPin } from 'lucide-react';
import { contentInsertionService, InsertionPreview } from '../services/contentInsertionService';

interface InsertionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onConfirm: () => void;
}

const InsertionPreviewModal: React.FC<InsertionPreviewModalProps> = ({
  isOpen,
  onClose,
  content,
  onConfirm
}) => {
  const [preview, setPreview] = useState<InsertionPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insertionMode, setInsertionMode] = useState<'cursor' | 'append' | 'section'>('cursor');

  useEffect(() => {
    if (isOpen && content) {
      setIsLoading(true);
      contentInsertionService.getInsertionPreview(content)
        .then(setPreview)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const formatContent = (text: string) => {
    // Split content into lines and format for preview
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Detect headings
      if (trimmedLine.match(/^#{1,6}\s+/)) {
        const level = trimmedLine.match(/^(#{1,6})/)?.[1].length || 1;
        const text = trimmedLine.replace(/^#{1,6}\s+/, '');
        return (
          <div key={index} className={`font-bold text-podcast-blue mb-2 ${
            level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'
          }`}>
            {text}
          </div>
        );
      }
      
      // Detect lists
      if (trimmedLine.match(/^[-*•]\s+/)) {
        const text = trimmedLine.replace(/^[-*•]\s+/, '');
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <span className="text-podcast-blue mt-1">•</span>
            <span className="text-sm">{text}</span>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-sm leading-relaxed mb-2">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-podcast-blue/5">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-podcast-blue flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة الإدراج
          </h2>
          <div className="w-8" /> {/* Spacer for center alignment */}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-podcast-gray">
              <div className="animate-spin w-8 h-8 border-2 border-podcast-blue border-t-transparent rounded-full mx-auto mb-3"></div>
              جاري تحضير المعاينة...
            </div>
          ) : preview ? (
            <>
              {/* Insertion Location Info */}
              <div className="bg-podcast-blue/10 p-4 rounded-lg border border-podcast-blue/20">
                <div className="flex items-start gap-3 text-right">
                  <MapPin className="w-5 h-5 text-podcast-blue mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-podcast-gray mb-1">موقع الإدراج:</p>
                    <p className="font-medium text-podcast-blue">{preview.targetLocation}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-podcast-gray">
                      <span>طول المحتوى: {preview.estimatedLength} حرف</span>
                      <span>عدد الأسطر: {content.split('\n').filter(line => line.trim()).length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insertion Mode Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-podcast-gray text-right">طريقة الإدراج:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setInsertionMode('cursor')}
                    className={`p-3 rounded-lg border text-right transition-colors ${
                      insertionMode === 'cursor' 
                        ? 'border-podcast-blue bg-podcast-blue/10 text-podcast-blue' 
                        : 'border-gray-200 hover:border-podcast-blue/50'
                    }`}
                  >
                    <div className="font-medium">إدراج عند المؤشر</div>
                    <div className="text-xs text-podcast-gray mt-1">
                      سيتم إدراج المحتوى في الموقع الحالي للمؤشر
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setInsertionMode('append')}
                    className={`p-3 rounded-lg border text-right transition-colors ${
                      insertionMode === 'append' 
                        ? 'border-podcast-blue bg-podcast-blue/10 text-podcast-blue' 
                        : 'border-gray-200 hover:border-podcast-blue/50'
                    }`}
                  >
                    <div className="font-medium">إضافة في النهاية</div>
                    <div className="text-xs text-podcast-gray mt-1">
                      سيتم إضافة المحتوى في نهاية المستند
                    </div>
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-podcast-gray" />
                  <span className="text-sm font-medium text-podcast-gray">معاينة المحتوى</span>
                </div>
                <div className="p-4 bg-white max-h-64 overflow-y-auto">
                  <div className="text-right space-y-2">
                    {formatContent(preview.content)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-podcast-gray">
              <X className="w-8 h-8 mx-auto mb-3 text-red-400" />
              حدث خطأ في تحضير المعاينة
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-podcast-gray hover:text-podcast-blue transition-colors font-medium"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            className="podcast-button flex items-center gap-2 px-6 py-2"
            disabled={isLoading || !preview}
          >
            <ArrowRight className="w-4 h-4" />
            إدراج المحتوى
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsertionPreviewModal;
