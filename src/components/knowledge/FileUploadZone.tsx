
import React, { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { ChatUploadedFile, FILE_UPLOAD_CONFIG } from '../../types/file';
import { fileProcessor } from '../../services/fileProcessor';
import { fileStorage } from '../../utils/fileStorage';

interface FileUploadZoneProps {
  onFileUploaded: (file: ChatUploadedFile) => void;
  sessionId: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUploaded, sessionId }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
      return `الملف كبير جداً. الحد الأقصى ${FILE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB`;
    }
    
    if (!FILE_UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
      return 'نوع الملف غير مدعوم. المسموح: PDF, DOC, DOCX';
    }
    
    return null;
  };

  const processFile = async (file: File) => {
    const fileId = `${Date.now()}_${file.name}`;
    setUploadingFiles(prev => new Set(prev).add(fileId));
    
    try {
      const validation = validateFile(file);
      if (validation) {
        throw new Error(validation);
      }

      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
        reader.readAsDataURL(file);
      });

      const base64Content = await base64Promise;
      
      // Extract text content
      const extractionResult = await fileProcessor.extractText(file);
      
      const uploadedFile: ChatUploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        content: base64Content,
        extractedText: extractionResult.extractedText,
        uploadedAt: new Date().toISOString(),
        sessionId
      };

      // Save to storage using the correct method
      fileStorage.saveUploadedFile(uploadedFile);
      onFileUploaded(uploadedFile);
      
      // Clear any previous errors
      setUploadErrors(prev => prev.filter(error => !error.includes(file.name)));
      
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = `خطأ في رفع ${file.name}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`;
      setUploadErrors(prev => [...prev, errorMessage]);
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await processFile(file);
    }
  }, [sessionId]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await processFile(file);
    }
    e.target.value = '';
  };

  const clearError = (index: number) => {
    setUploadErrors(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragActive 
            ? 'border-podcast-gold bg-podcast-gold/5' 
            : 'border-podcast-border hover:border-podcast-gold/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragActive(true)}
        onDragLeave={() => setIsDragActive(false)}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-podcast-gray" />
        <p className="text-sm text-podcast-gray mb-2">
          اسحب الملفات هنا أو انقر للتصفح
        </p>
        <p className="text-xs text-podcast-gray/70 mb-4">
          يدعم PDF, DOC, DOCX - حتى {FILE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB
        </p>
        <input
          type="file"
          multiple
          accept={FILE_UPLOAD_CONFIG.allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="podcast-button cursor-pointer inline-flex items-center gap-2"
        >
          <File className="w-4 h-4" />
          اختر الملفات
        </label>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.size > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-podcast-gray">جاري الرفع...</p>
          {Array.from(uploadingFiles).map((fileId) => (
            <div key={fileId} className="flex items-center gap-2 text-sm">
              <div className="animate-spin w-4 h-4 border-2 border-podcast-gold border-t-transparent rounded-full"></div>
              <span>معالجة الملف...</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {uploadErrors.length > 0 && (
        <div className="space-y-2">
          {uploadErrors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700 flex-1">{error}</span>
              <button
                onClick={() => clearError(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
