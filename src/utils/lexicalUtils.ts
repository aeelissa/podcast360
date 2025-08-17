
import { 
  $createParagraphNode, 
  $createTextNode, 
  $getSelection, 
  $isRangeSelection,
  $insertNodes,
  LexicalEditor
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode } from '@lexical/list';

export interface InsertionResult {
  success: boolean;
  message: string;
}

// Convert markdown-like content to Lexical nodes
export function convertContentToNodes(content: string) {
  const lines = content.split('\n');
  const nodes = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      // Empty line - create empty paragraph
      nodes.push($createParagraphNode());
      continue;
    }

    // Check for headings
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const text = headingMatch[2];
      const headingNode = $createHeadingNode(`h${level}`);
      headingNode.append($createTextNode(text));
      nodes.push(headingNode);
      continue;
    }

    // Check for list items
    const listMatch = trimmedLine.match(/^[-*•]\s+(.+)/);
    if (listMatch) {
      const listItem = $createListItemNode();
      listItem.append($createTextNode(listMatch[1]));
      
      // Create a list container
      const list = $createListNode('bullet');
      list.append(listItem);
      nodes.push(list);
      continue;
    }

    // Regular paragraph
    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode(trimmedLine));
    nodes.push(paragraph);
  }

  return nodes;
}

// Insert content at current cursor position
export function insertContentAtCursor(editor: LexicalEditor, content: string): Promise<InsertionResult> {
  return new Promise((resolve) => {
    editor.update(() => {
      try {
        const selection = $getSelection();
        
        if (!$isRangeSelection(selection)) {
          resolve({
            success: false,
            message: 'لا يمكن تحديد موقع المؤشر'
          });
          return;
        }

        // Convert content to nodes
        const nodes = convertContentToNodes(content);
        
        if (nodes.length === 0) {
          resolve({
            success: false,
            message: 'لا يوجد محتوى للإدراج'
          });
          return;
        }

        // Insert nodes at selection
        $insertNodes(nodes);
        
        resolve({
          success: true,
          message: `تم إدراج ${nodes.length} عنصر بنجاح`
        });
        
      } catch (error) {
        console.error('Error inserting content:', error);
        resolve({
          success: false,
          message: 'حدث خطأ أثناء الإدراج'
        });
      }
    });
  });
}

// Get current cursor context (what section/heading the cursor is under)
export function getCurrentCursorContext(editor: LexicalEditor): Promise<string> {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // For now, return a simple context
        // This could be enhanced to detect which heading section we're under
        resolve('قسم المحتوى الحالي');
      } else {
        resolve('غير محدد');
      }
    });
  });
}
