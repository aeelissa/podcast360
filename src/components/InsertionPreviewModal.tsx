
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Eye } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-podcast-blue">معاينة الإدراج</h2>
          <div className="flex items-center gap-2 text-podcast-gray">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-podcast-gray">
              جاري تحضير المعاينة...
            </div>
          ) : preview ? (
            <>
              {/* Insertion Info */}
              <div className="bg-podcast-blue/5 p-3 rounded-lg text-right">
                <p className="text-sm text-podcast-gray mb-1">موقع الإدراج:</p>
                <p className="font-medium text-podcast-blue">{preview.targetLocation}</p>
                <p className="text-xs text-podcast-gray mt-1">
                  طول المحتوى: {preview.estimatedLength} حرف
                </p>
              </div>

              {/* Content Preview */}
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-podcast-gray mb-2 text-right">المحتوى المراد إدراجه:</p>
                <div className="bg-gray-50 p-3 rounded text-right max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                    {preview.content}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-podcast-gray">
              حدث خطأ في تحضير المعاينة
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-podcast-gray hover:text-podcast-blue transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            className="podcast-button flex items-center gap-2"
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
