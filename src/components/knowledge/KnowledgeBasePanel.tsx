
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Book, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { ChatUploadedFile } from '../../types/file';
import { fileStorage } from '../../utils/fileStorage';
import { usePodcast } from '../../contexts/PodcastContext';
import FileUploadZone from './FileUploadZone';

const KnowledgeBasePanel = () => {
  const [uploadedFiles, setUploadedFiles] = useState<ChatUploadedFile[]>([]);
  const { currentEpisode } = usePodcast();
  const currentSessionId = currentEpisode?.id || 'default_session';

  useEffect(() => {
    loadFiles();
  }, [currentSessionId]);

  const loadFiles = () => {
    const files = fileStorage.getChatFiles(currentSessionId);
    setUploadedFiles(files);
  };

  const handleFileUploaded = (file: ChatUploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleDeleteFile = (fileId: string) => {
    fileStorage.deleteChatFile(fileId);
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="text-rtl">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-podcast-blue" />
          <h3 className="font-bold text-podcast-blue text-right">مستندات المحادثة</h3>
        </div>
        <p className="text-sm text-podcast-gray text-right mb-4">
          ارفع مستندات للاستخدام في هذه المحادثة فقط (مستوى الحلقة)
        </p>
      </div>

      {/* Upload Zone */}
      <FileUploadZone
        onFileUploaded={handleFileUploaded}
        sessionId={currentSessionId}
      />

      {/* Uploaded Files List */}
      <div className="flex-1 overflow-y-auto">
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-8 text-rtl">
            <FileText className="w-12 h-12 mx-auto text-podcast-gray/50 mb-3" />
            <p className="text-podcast-gray text-right">لم يتم رفع أي مستندات بعد</p>
            <p className="text-sm text-podcast-gray/70 text-right">
              ارفع مستندات لتحسين إجابات الذكاء الاصطناعي
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-right text-podcast-blue">
              الملفات المرفوعة ({uploadedFiles.length})
            </h4>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-start gap-3 p-3 border border-podcast-border rounded-lg hover:bg-podcast-gold/5 transition-colors"
              >
                <FileText className="w-4 h-4 text-podcast-blue mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0 text-rtl">
                  <p className="font-medium text-sm text-right truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-podcast-gray text-right">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('ar')}
                  </p>
                  {file.extractedText && (
                    <p className="text-xs text-podcast-gray/70 text-right mt-1 line-clamp-2">
                      {file.extractedText.substring(0, 100)}...
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="text-xs text-podcast-gray/70 text-right text-rtl border-t pt-3">
        <p className="flex items-center gap-1 justify-end">
          <Book className="w-3 h-3" />
          هذه المستندات متاحة فقط في هذه المحادثة
        </p>
      </div>
    </div>
  );
};

export default KnowledgeBasePanel;
