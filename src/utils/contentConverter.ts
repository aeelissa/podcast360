
import { Document } from '../types/document';

interface GoogleDocsRequest {
  title: string;
  body: {
    content: Array<{
      paragraph?: {
        elements: Array<{
          textRun: {
            content: string;
            textStyle?: {
              bold?: boolean;
              italic?: boolean;
              underline?: boolean;
            };
          };
        }>;
        paragraphStyle?: {
          alignment?: string;
          direction?: string;
        };
      };
    }>;
  };
}

export class ContentConverter {
  static htmlToGoogleDocs(document: Document): GoogleDocsRequest {
    const parser = new DOMParser();
    const doc = parser.parseFromString(document.content || '', 'text/html');
    
    const title = `Podcast360 - ${this.getDocumentTypeInArabic(document.type)} - ${new Date(document.createdAt).toLocaleDateString('ar-SA')}`;
    
    const content: GoogleDocsRequest['body']['content'] = [];
    
    // Add document title as heading
    content.push({
      paragraph: {
        elements: [{
          textRun: {
            content: document.title + '\n',
            textStyle: {
              bold: true
            }
          }
        }],
        paragraphStyle: {
          alignment: 'START',
          direction: 'RIGHT_TO_LEFT'
        }
      }
    });
    
    // Convert HTML content
    const elements = doc.body.children;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      content.push(...this.convertElement(element));
    }
    
    // If no content, add a default paragraph
    if (content.length === 1) {
      content.push({
        paragraph: {
          elements: [{
            textRun: {
              content: 'ابدأ الكتابة هنا...\n'
            }
          }],
          paragraphStyle: {
            alignment: 'START',
            direction: 'RIGHT_TO_LEFT'
          }
        }
      });
    }
    
    return {
      title,
      body: { content }
    };
  }
  
  private static convertElement(element: Element): GoogleDocsRequest['body']['content'] {
    const result: GoogleDocsRequest['body']['content'] = [];
    
    switch (element.tagName.toLowerCase()) {
      case 'h1':
      case 'h2':
      case 'h3':
        result.push({
          paragraph: {
            elements: [{
              textRun: {
                content: element.textContent + '\n',
                textStyle: {
                  bold: true
                }
              }
            }],
            paragraphStyle: {
              alignment: 'START',
              direction: 'RIGHT_TO_LEFT'
            }
          }
        });
        break;
        
      case 'p':
        const textContent = this.extractFormattedText(element);
        if (textContent.length > 0) {
          result.push({
            paragraph: {
              elements: textContent,
              paragraphStyle: {
                alignment: 'START',
                direction: 'RIGHT_TO_LEFT'
              }
            }
          });
        }
        break;
        
      case 'ul':
      case 'ol':
        const listItems = element.querySelectorAll('li');
        listItems.forEach(li => {
          const bullet = element.tagName.toLowerCase() === 'ul' ? '• ' : '1. ';
          result.push({
            paragraph: {
              elements: [{
                textRun: {
                  content: bullet + li.textContent + '\n'
                }
              }],
              paragraphStyle: {
                alignment: 'START',
                direction: 'RIGHT_TO_LEFT'
              }
            }
          });
        });
        break;
        
      default:
        if (element.textContent) {
          result.push({
            paragraph: {
              elements: [{
                textRun: {
                  content: element.textContent + '\n'
                }
              }],
              paragraphStyle: {
                alignment: 'START',
                direction: 'RIGHT_TO_LEFT'
              }
            }
          });
        }
    }
    
    return result;
  }
  
  private static extractFormattedText(element: Element): Array<{
    textRun: {
      content: string;
      textStyle?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
      };
    };
  }> {
    const result: Array<{
      textRun: {
        content: string;
        textStyle?: {
          bold?: boolean;
          italic?: boolean;
          underline?: boolean;
        };
      };
    }> = [];
    
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const content = node.textContent;
        if (content) {
          result.push({
            textRun: {
              content: content
            }
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as Element;
        const tagName = elem.tagName.toLowerCase();
        const textStyle: any = {};
        
        if (tagName === 'strong' || tagName === 'b') {
          textStyle.bold = true;
        }
        if (tagName === 'em' || tagName === 'i') {
          textStyle.italic = true;
        }
        if (tagName === 'u') {
          textStyle.underline = true;
        }
        
        if (Object.keys(textStyle).length > 0) {
          result.push({
            textRun: {
              content: elem.textContent || '',
              textStyle
            }
          });
        } else {
          // Process child nodes
          elem.childNodes.forEach(processNode);
        }
      }
    };
    
    element.childNodes.forEach(processNode);
    
    // Add newline at the end
    if (result.length > 0) {
      result[result.length - 1].textRun.content += '\n';
    } else {
      result.push({
        textRun: {
          content: '\n'
        }
      });
    }
    
    return result;
  }
  
  private static getDocumentTypeInArabic(type: string): string {
    switch (type) {
      case 'concept':
        return 'مفهوم';
      case 'preparation':
        return 'تحضير';
      case 'script':
        return 'نص';
      default:
        return 'وثيقة';
    }
  }
}
