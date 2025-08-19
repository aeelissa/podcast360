
import React, { useState, useEffect } from 'react';
import { Book, Upload, Trash2, FileText, AlertCircle } from 'lucide-react';
import { ChatUploadedFile } from '../../types/file';
import { fileStorage } from '../../utils/fileStorage';
import { usePodcast } from '../../contexts/PodcastContext';
import FileUploadZone from './FileUploadZone';

const KnowledgeBasePanel: React.FC = () => {
  const [files, setFiles] = useState<ChatUploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  
  const { currentEpisode } = usePodcast();

  // Load files for current episode
  useEffect(() => {
    if (currentEpisode) {
      const episodeFiles = fileStorage.getFilesBySession(currentEpisode.id);
      setFiles(episodeFiles);
    } else {
      setFiles([]);
    }
  }, [currentEpisode]);

  const handleFileUploaded = (file: ChatUploadedFile) => {
    setFiles(prev => [...prev, file]);
    console.log('File uploaded to knowledge base:', file.name);
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('هل تريد حذف هذا الملف من قاعدة المعرفة؟')) {
      fileStorage.deleteFile(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      console.log('File deleted from knowledge base:', fileId);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📁';
  };

  if (!currentEpisode) {
    return (
      <div className="podcast-panel h-full flex flex-col">
        <div className="podcast-header px-4 py-3 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            <h2 className="font-bold text-right">قاعدة المعرفة</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-podcast-gray">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">اختر حلقة لإدارة ملفات قاعدة المعرفة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-panel h-full flex flex-col">
      {/* Header */}
      <div className="podcast-header px-4 py-3 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            <h2 className="font-bold text-right">قاعدة المعرفة</h2>
          </div>
          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="podcast-button-sm"
            title="رفع ملفات"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          
          {/* Upload Zone */}
          {showUploadZone && (
            <div className="border border-podcast-border rounded-lg p-4">
              <FileUploadZone
                onFileUploaded={handleFileUploaded}
                sessionId={currentEpisode.id}
              />
            </div>
          )}

          {/* Files List */}
          {files.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 mx-auto mb-3 text-podcast-gray opacity-50" />
              <p className="text-sm text-podcast-gray">
                لا توجد ملفات في قاعدة المعرفة
              </p>
              <p className="text-xs text-podcast-gray/70 mt-1">
                ارفع ملفات لتحسين إجابات الذكاء الاصطناعي
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-podcast-gray text-right">
                الملفات المرفوعة ({files.length})
              </h3>
              
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border border-podcast-border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{getFileTypeIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-right">
                        {file.name}
                      </p>
                      <p className="text-xs text-podcast-gray text-right">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('ar')}
                      </p>
                      {file.extractedText && (
                        <p className="text-xs text-green-600 text-right mt-1">
                          تم استخراج النص ({file.extractedText.length} حرف)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePanel;
