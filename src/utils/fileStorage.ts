
import { KnowledgeFile, ChatUploadedFile } from '../types/file';
import { FILE_UPLOAD_CONFIG } from '../types/file';

const KNOWLEDGE_FILES_KEY = 'podcast360_knowledge_files';
const CHAT_FILES_KEY = 'podcast360_chat_files';

export const fileStorage = {
  // Knowledge Base Files
  getKnowledgeFiles(podcastId: string): KnowledgeFile[] {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_FILES_KEY);
      const allFiles: Record<string, KnowledgeFile[]> = stored ? JSON.parse(stored) : {};
      return allFiles[podcastId] || [];
    } catch (error) {
      console.error('Error loading knowledge files:', error);
      return [];
    }
  },

  saveKnowledgeFile(podcastId: string, file: KnowledgeFile): boolean {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_FILES_KEY);
      const allFiles: Record<string, KnowledgeFile[]> = stored ? JSON.parse(stored) : {};
      
      if (!allFiles[podcastId]) {
        allFiles[podcastId] = [];
      }

      // Check file count limit
      if (allFiles[podcastId].length >= FILE_UPLOAD_CONFIG.maxFilesPerPodcast) {
        throw new Error(`Maximum ${FILE_UPLOAD_CONFIG.maxFilesPerPodcast} files allowed per podcast`);
      }

      // Check file size
      if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
        throw new Error(`File size must be less than ${FILE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB`);
      }

      allFiles[podcastId].push(file);
      localStorage.setItem(KNOWLEDGE_FILES_KEY, JSON.stringify(allFiles));
      return true;
    } catch (error) {
      console.error('Error saving knowledge file:', error);
      return false;
    }
  },

  deleteKnowledgeFile(podcastId: string, fileId: string): void {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_FILES_KEY);
      const allFiles: Record<string, KnowledgeFile[]> = stored ? JSON.parse(stored) : {};
      
      if (allFiles[podcastId]) {
        allFiles[podcastId] = allFiles[podcastId].filter(f => f.id !== fileId);
        localStorage.setItem(KNOWLEDGE_FILES_KEY, JSON.stringify(allFiles));
      }
    } catch (error) {
      console.error('Error deleting knowledge file:', error);
    }
  },

  // Chat Files
  getChatFiles(sessionId: string): ChatUploadedFile[] {
    try {
      const stored = localStorage.getItem(CHAT_FILES_KEY);
      const allFiles: Record<string, ChatUploadedFile[]> = stored ? JSON.parse(stored) : {};
      return allFiles[sessionId] || [];
    } catch (error) {
      console.error('Error loading chat files:', error);
      return [];
    }
  },

  saveChatFile(sessionId: string, file: ChatUploadedFile): boolean {
    try {
      const stored = localStorage.getItem(CHAT_FILES_KEY);
      const allFiles: Record<string, ChatUploadedFile[]> = stored ? JSON.parse(stored) : {};
      
      if (!allFiles[sessionId]) {
        allFiles[sessionId] = [];
      }

      allFiles[sessionId].push(file);
      localStorage.setItem(CHAT_FILES_KEY, JSON.stringify(allFiles));
      return true;
    } catch (error) {
      console.error('Error saving chat file:', error);
      return false;
    }
  },

  // Utility function to convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:mime;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  },

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
      return { 
        valid: false, 
        error: `حجم الملف يجب أن يكون أقل من ${FILE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB` 
      };
    }

    if (!FILE_UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'نوع الملف غير مدعوم. الأنواع المدعومة: PDF, DOC, DOCX' 
      };
    }

    return { valid: true };
  }
};
