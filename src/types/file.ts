
export interface FileUploadConfig {
  maxFileSize: number; // 10MB in bytes
  maxFilesPerPodcast: number; // 5 files
  allowedTypes: string[];
}

export interface ChatUploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string; // base64
  extractedText?: string;
  uploadedAt: string;
  sessionId: string;
}

export interface FileProcessingResult {
  success: boolean;
  extractedText?: string;
  error?: string;
}

export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesPerPodcast: 5,
  allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};
