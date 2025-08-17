
import React, { useState } from 'react';
import { FileText, Loader2, ExternalLink } from 'lucide-react';
import { googleDocsService } from '../services/googleDocsService';
import { Document } from '../types/document';
import { useToast } from '../hooks/use-toast';

interface ExportButtonProps {
  document: Document;
}

const ExportButton: React.FC<ExportButtonProps> = ({ document }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!document || !document.content.trim()) {
      toast({
        title: "تنبيه",
        description: "لا يمكن تصدير وثيقة فارغة",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const result = await googleDocsService.exportDocument(document);
      
      if (result.success && result.documentUrl) {
        toast({
          title: "تم التصدير بنجاح!",
          description: "تم إنشاء المستند في Google Docs",
        });
        
        // Open the Google Doc in a new tab
        window.open(result.documentUrl, '_blank');
      } else {
        throw new Error(result.error || 'فشل في التصدير');
      }
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء التصدير إلى Google Docs",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-podcast-blue text-white rounded-lg hover:bg-podcast-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="تصدير إلى Google Docs"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileText className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">
        {isExporting ? 'جاري التصدير...' : 'تصدير إلى Google Docs'}
      </span>
      {!isExporting && <ExternalLink className="w-3 h-3" />}
    </button>
  );
};

export default ExportButton;
