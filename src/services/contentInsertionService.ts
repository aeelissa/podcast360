
import { LexicalEditor } from 'lexical';
import { insertContentAtCursor, getCurrentCursorContext, InsertionResult } from '../utils/lexicalUtils';

export interface InsertionPreview {
  content: string;
  targetLocation: string;
  estimatedLength: number;
}

class ContentInsertionService {
  private editor: LexicalEditor | null = null;

  setEditor(editor: LexicalEditor) {
    this.editor = editor;
  }

  async getInsertionPreview(content: string): Promise<InsertionPreview> {
    if (!this.editor) {
      return {
        content,
        targetLocation: 'غير متاح',
        estimatedLength: content.length
      };
    }

    const targetLocation = await getCurrentCursorContext(this.editor);
    
    return {
      content,
      targetLocation,
      estimatedLength: content.length
    };
  }

  async insertContent(content: string): Promise<InsertionResult> {
    if (!this.editor) {
      return {
        success: false,
        message: 'المحرر غير متاح'
      };
    }

    return await insertContentAtCursor(this.editor, content);
  }

  isReady(): boolean {
    return this.editor !== null;
  }
}

export const contentInsertionService = new ContentInsertionService();
