
import { AIResponse } from '../utils/documentPrompts';
import { ChatMessage } from '../types/chat';

export interface ProcessedAIResponse {
  content: string;
  formattedContent: string;
  suggestedActions: AIAction[];
  insertionStrategy: InsertionStrategy;
  confidence: number;
  contentType: 'text' | 'list' | 'script' | 'outline';
}

export interface AIAction {
  type: 'insert-at-cursor' | 'append-to-section' | 'replace-selection' | 'create-new-section';
  label: string;
  description: string;
  targetSection?: string;
}

export interface InsertionStrategy {
  mode: 'cursor' | 'append' | 'section' | 'replace';
  targetLocation: string;
  formatting: 'preserve' | 'markdown' | 'plain';
}

class AIResponseProcessor {
  processResponse(rawResponse: string, context?: {
    documentType?: string;
    currentSection?: string;
    selectedText?: string;
  }): ProcessedAIResponse {
    const contentType = this.detectContentType(rawResponse);
    const formattedContent = this.formatContent(rawResponse, contentType);
    const insertionStrategy = this.determineInsertionStrategy(rawResponse, context);
    const suggestedActions = this.generateSuggestedActions(rawResponse, context);
    
    return {
      content: rawResponse,
      formattedContent,
      suggestedActions,
      insertionStrategy,
      confidence: this.calculateConfidence(rawResponse),
      contentType
    };
  }

  private detectContentType(content: string): 'text' | 'list' | 'script' | 'outline' {
    // Detect lists
    if (content.includes('•') || content.includes('-') || /^\d+\./m.test(content)) {
      return 'list';
    }
    
    // Detect script format (has dialogue or stage directions)
    if (content.includes(':') && (content.includes('المضيف') || content.includes('الضيف'))) {
      return 'script';
    }
    
    // Detect outline (multiple headings)
    if ((content.match(/^#+/gm) || []).length > 2) {
      return 'outline';
    }
    
    return 'text';
  }

  private formatContent(content: string, contentType: 'text' | 'list' | 'script' | 'outline'): string {
    switch (contentType) {
      case 'list':
        return this.formatAsList(content);
      case 'script':
        return this.formatAsScript(content);
      case 'outline':
        return this.formatAsOutline(content);
      default:
        return this.formatAsText(content);
    }
  }

  private formatAsList(content: string): string {
    return content
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('•') && !trimmed.startsWith('-') && !/^\d+\./.test(trimmed)) {
          return `• ${trimmed}`;
        }
        return line;
      })
      .join('\n');
  }

  private formatAsScript(content: string): string {
    return content
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.includes(':') && !trimmed.startsWith('**')) {
          return `**${trimmed}**`;
        }
        return line;
      })
      .join('\n');
  }

  private formatAsOutline(content: string): string {
    const lines = content.split('\n');
    let formattedLines: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && formattedLines.length > 0) {
        const lastLine = formattedLines[formattedLines.length - 1];
        if (lastLine.startsWith('#')) {
          formattedLines.push(`\n${line}`);
        } else {
          formattedLines.push(line);
        }
      } else {
        formattedLines.push(line);
      }
    });
    
    return formattedLines.join('\n');
  }

  private formatAsText(content: string): string {
    // Add proper paragraph spacing
    return content
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .join('\n\n');
  }

  private determineInsertionStrategy(content: string, context?: {
    documentType?: string;
    currentSection?: string;
    selectedText?: string;
  }): InsertionStrategy {
    // If text is selected, suggest replacement
    if (context?.selectedText) {
      return {
        mode: 'replace',
        targetLocation: 'النص المحدد',
        formatting: 'markdown'
      };
    }

    // For script content, prefer cursor insertion
    if (this.detectContentType(content) === 'script') {
      return {
        mode: 'cursor',
        targetLocation: 'موضع المؤشر',
        formatting: 'markdown'
      };
    }

    // For outlines, suggest section insertion
    if (this.detectContentType(content) === 'outline') {
      return {
        mode: 'section',
        targetLocation: context?.currentSection || 'القسم الحالي',
        formatting: 'markdown'
      };
    }

    // Default to cursor insertion
    return {
      mode: 'cursor',
      targetLocation: 'موضع المؤشر',
      formatting: 'markdown'
    };
  }

  private generateSuggestedActions(content: string, context?: {
    documentType?: string;
    currentSection?: string;
    selectedText?: string;
  }): AIAction[] {
    const actions: AIAction[] = [];
    const contentType = this.detectContentType(content);

    // Always offer cursor insertion
    actions.push({
      type: 'insert-at-cursor',
      label: 'إدراج عند المؤشر',
      description: 'إضافة المحتوى في موضع المؤشر الحالي'
    });

    // Offer section-specific actions based on content type
    if (contentType === 'outline' || contentType === 'script') {
      actions.push({
        type: 'create-new-section',
        label: 'إنشاء قسم جديد',
        description: 'إضافة المحتوى كقسم منفصل'
      });
    }

    // If there's selected text, offer replacement
    if (context?.selectedText) {
      actions.push({
        type: 'replace-selection',
        label: 'استبدال النص المحدد',
        description: 'استبدال النص المحدد بالمحتوى الجديد'
      });
    }

    // Always offer append option
    actions.push({
      type: 'append-to-section',
      label: 'إضافة في النهاية',
      description: 'إضافة المحتوى في نهاية المستند'
    });

    return actions;
  }

  private calculateConfidence(content: string): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence for well-structured content
    if (content.includes('#') || content.includes('•') || content.includes('-')) {
      confidence += 0.2;
    }

    // Increase confidence for longer, detailed responses
    if (content.length > 200) {
      confidence += 0.1;
    }

    // Increase confidence for Arabic content
    if (/[\u0600-\u06FF]/.test(content)) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  extractActionableItems(content: string): string[] {
    const items: string[] = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      // Look for action items (lines starting with action verbs in Arabic)
      if (/^(قم|اكتب|أضف|حضر|اذكر|استخدم|ركز)/.test(trimmed)) {
        items.push(trimmed);
      }
    });
    
    return items;
  }
}

export const aiResponseProcessor = new AIResponseProcessor();
