
import { LexicalEditor } from 'lexical';
import { insertContentAtCursor, insertContentAtEnd, getCurrentCursorContext, InsertionResult } from '../utils/lexicalUtils';

export interface InsertionPreview {
  content: string;
  targetLocation: string;
  estimatedLength: number;
  insertionMode?: 'cursor' | 'append' | 'section';
}

export type InsertionMode = 'cursor' | 'append' | 'section';

class ContentInsertionService {
  private editor: LexicalEditor | null = null;
  private currentInsertionMode: InsertionMode = 'cursor';

  setEditor(editor: LexicalEditor) {
    this.editor = editor;
  }

  setInsertionMode(mode: InsertionMode) {
    this.currentInsertionMode = mode;
  }

  async getInsertionPreview(content: string): Promise<InsertionPreview> {
    if (!this.editor) {
      return {
        content,
        targetLocation: 'المحرر غير متاح',
        estimatedLength: content.length,
        insertionMode: this.currentInsertionMode
      };
    }

    const targetLocation = await getCurrentCursorContext(this.editor);
    
    return {
      content,
      targetLocation: this.getInsertionLocationDescription(targetLocation),
      estimatedLength: content.length,
      insertionMode: this.currentInsertionMode
    };
  }

  private getInsertionLocationDescription(context: string): string {
    switch (this.currentInsertionMode) {
      case 'cursor':
        return `عند المؤشر - ${context}`;
      case 'append':
        return 'في نهاية المستند';
      case 'section':
        return `بداية القسم الحالي - ${context}`;
      default:
        return context;
    }
  }

  async insertContent(content: string, mode?: InsertionMode): Promise<InsertionResult> {
    if (!this.editor) {
      return {
        success: false,
        message: 'المحرر غير متاح'
      };
    }

    const insertionMode = mode || this.currentInsertionMode;

    switch (insertionMode) {
      case 'cursor':
        return await insertContentAtCursor(this.editor, content);
      case 'append':
        return await insertContentAtEnd(this.editor, content);
      case 'section':
        // For now, fallback to cursor insertion
        // This could be enhanced to detect section boundaries
        return await insertContentAtCursor(this.editor, content);
      default:
        return await insertContentAtCursor(this.editor, content);
    }
  }

  isReady(): boolean {
    return this.editor !== null;
  }
}

export const contentInsertionService = new ContentInsertionService();
