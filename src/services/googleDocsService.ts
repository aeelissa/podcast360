
import { googleAuthService } from './googleAuthService';
import { ContentConverter } from '../utils/contentConverter';
import { Document } from '../types/document';

export interface ExportResult {
  success: boolean;
  documentUrl?: string;
  error?: string;
}

class GoogleDocsService {
  private readonly DOCS_API_URL = 'https://docs.googleapis.com/v1/documents';
  
  async exportDocument(document: Document): Promise<ExportResult> {
    try {
      // Get access token
      let accessToken = await googleAuthService.getAccessToken();
      
      if (!accessToken) {
        accessToken = await googleAuthService.signIn();
      }
      
      // Convert document content
      const googleDocsData = ContentConverter.htmlToGoogleDocs(document);
      
      // Create the document
      const response = await fetch(this.DOCS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: googleDocsData.title
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create document: ${response.statusText}`);
      }
      
      const createdDoc = await response.json();
      const documentId = createdDoc.documentId;
      
      // Add content to the document
      const batchUpdateResponse = await fetch(`${this.DOCS_API_URL}/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: this.createBatchUpdateRequests(googleDocsData.body.content)
        })
      });
      
      if (!batchUpdateResponse.ok) {
        throw new Error(`Failed to update document: ${batchUpdateResponse.statusText}`);
      }
      
      // Return the document URL
      const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
      
      return {
        success: true,
        documentUrl
      };
      
    } catch (error) {
      console.error('Error exporting to Google Docs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  private createBatchUpdateRequests(content: any[]): any[] {
    const requests: any[] = [];
    let index = 1; // Start after the default paragraph
    
    content.forEach((item) => {
      if (item.paragraph) {
        // Insert text
        const text = item.paragraph.elements.map((el: any) => el.textRun.content).join('');
        
        requests.push({
          insertText: {
            location: { index },
            text: text
          }
        });
        
        // Apply formatting
        let currentIndex = index;
        item.paragraph.elements.forEach((element: any) => {
          const textLength = element.textRun.content.length;
          
          if (element.textRun.textStyle) {
            const textStyle = element.textRun.textStyle;
            
            if (textStyle.bold) {
              requests.push({
                updateTextStyle: {
                  range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + textLength
                  },
                  textStyle: { bold: true },
                  fields: 'bold'
                }
              });
            }
            
            if (textStyle.italic) {
              requests.push({
                updateTextStyle: {
                  range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + textLength
                  },
                  textStyle: { italic: true },
                  fields: 'italic'
                }
              });
            }
            
            if (textStyle.underline) {
              requests.push({
                updateTextStyle: {
                  range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + textLength
                  },
                  textStyle: { underline: true },
                  fields: 'underline'
                }
              });
            }
          }
          
          currentIndex += textLength;
        });
        
        // Apply paragraph formatting (RTL)
        if (item.paragraph.paragraphStyle?.direction === 'RIGHT_TO_LEFT') {
          requests.push({
            updateParagraphStyle: {
              range: {
                startIndex: index,
                endIndex: index + text.length
              },
              paragraphStyle: {
                direction: 'RIGHT_TO_LEFT',
                alignment: 'START'
              },
              fields: 'direction,alignment'
            }
          });
        }
        
        index += text.length;
      }
    });
    
    return requests;
  }
}

export const googleDocsService = new GoogleDocsService();
