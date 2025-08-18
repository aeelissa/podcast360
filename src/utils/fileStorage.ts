
import { FileUploadConfig, ChatUploadedFile, FileProcessingResult } from '../types/file';
import { KnowledgeFile } from '../types/podcast';
import { fileProcessor } from '../services/fileProcessor';

const KNOWLEDGE_FILES_KEY = 'podcast360_knowledge_files';
const CHAT_FILES_KEY = 'podcast360_chat_files';

export const fileStorage = {
  // Knowledge Base files (podcast-level)
  getKnowledgeFiles(podcastId: string): KnowledgeFile[] {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_FILES_KEY);
      const allFiles: KnowledgeFile[] = stored ? JSON.parse(stored) : [];
      return allFiles.filter(file => file.podcastId === podcastId);
    } catch (error) {
      console.error('Error loading knowledge files:', error);
      return [];
    }
  },

  saveKnowledgeFile(file: KnowledgeFile): void {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_FILES_KEY);
      const allFiles: KnowledgeFile[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = allFiles.findIndex(f => f.id === file.id);
      if (existingIndex >= 0) {
        allFiles[existingIndex] = file;
      } else {
        allFiles.push(file);
      }
      
      localStorage.setItem(KNOWLEDGE_FILES_KEY, JSON.stringify(allFiles));
    } catch (error) {
      console.error('Error saving knowledge file:', error);
      throw error;
    }
  },

  deleteKnowledgeFile(fileId: string): void {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_FILES_KEY);
      const allFiles: KnowledgeFile[] = stored ? JSON.parse(stored) : [];
      const filtered = allFiles.filter(f => f.id !== fileId);
      localStorage.setItem(KNOWLEDGE_FILES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting knowledge file:', error);
    }
  },

  // Chat uploaded files (session-level)
  getChatFiles(sessionId: string): ChatUploadedFile[] {
    try {
      const stored = localStorage.getItem(CHAT_FILES_KEY);
      const allFiles: ChatUploadedFile[] = stored ? JSON.parse(stored) : [];
      return allFiles.filter(file => file.sessionId === sessionId);
    } catch (error) {
      console.error('Error loading chat files:', error);
      return [];
    }
  },

  saveChatFile(file: ChatUploadedFile): void {
    try {
      const stored = localStorage.getItem(CHAT_FILES_KEY);
      const allFiles: ChatUploadedFile[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = allFiles.findIndex(f => f.id === file.id);
      if (existingIndex >= 0) {
        allFiles[existingIndex] = file;
      } else {
        allFiles.push(file);
      }
      
      localStorage.setItem(CHAT_FILES_KEY, JSON.stringify(allFiles));
    } catch (error) {
      console.error('Error saving chat file:', error);
      throw error;
    }
  },

  deleteChatFile(fileId: string): void {
    try {
      const stored = localStorage.getItem(CHAT_FILES_KEY);
      const allFiles: ChatUploadedFile[] = stored ? JSON.parse(stored) : [];
      const filtered = allFiles.filter(f => f.id !== fileId);
      localStorage.setItem(CHAT_FILES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting chat file:', error);
    }
  },

  // File processing and validation
  async processFile(file: File, podcastId?: string, sessionId?: string): Promise<FileProcessingResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Process file content - use extractText instead of processFile
      const result = await fileProcessor.extractText(file);
      
      if (result.success && result.extractedText) {
        // Create file record
        const fileRecord = await this.createFileRecord(file, result.extractedText, podcastId, sessionId);
        
        // Save to appropriate storage
        if (podcastId) {
          this.saveKnowledgeFile(fileRecord as KnowledgeFile);
        } else if (sessionId) {
          this.saveChatFile(fileRecord as ChatUploadedFile);
        }
        
        return { success: true, extractedText: result.extractedText };
      }
      
      return result;
    } catch (error) {
      console.error('Error processing file:', error);
      return { success: false, error: 'Failed to process file' };
    }
  },

  validateFile(file: File): { isValid: boolean; error?: string } {
    const config: FileUploadConfig = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFilesPerPodcast: 5,
      allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (file.size > config.maxFileSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!config.allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only PDF and DOC/DOCX files are allowed' };
    }

    return { isValid: true };
  },

  async createFileRecord(file: File, extractedText: string, podcastId?: string, sessionId?: string): Promise<KnowledgeFile | ChatUploadedFile> {
    const content = await this.fileToBase64(file);
    const now = new Date().toISOString();
    
    const baseRecord = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      content,
      extractedText,
      uploadedAt: now
    };

    if (podcastId) {
      return {
        ...baseRecord,
        podcastId
      } as KnowledgeFile;
    } else if (sessionId) {
      return {
        ...baseRecord,
        sessionId
      } as ChatUploadedFile;
    }

    throw new Error('Either podcastId or sessionId must be provided');
  },

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:type;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  },

  base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }
};
