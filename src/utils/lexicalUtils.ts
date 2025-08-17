
import { 
  $createParagraphNode, 
  $createTextNode, 
  $getSelection, 
  $isRangeSelection,
  $insertNodes,
  $getRoot,
  $setSelection,
  $createRangeSelection,
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
          message: `تم إدراج ${nodes.length} عنصر بنجاح عند المؤشر`
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

// Insert content at the end of the document
export function insertContentAtEnd(editor: LexicalEditor, content: string): Promise<InsertionResult> {
  return new Promise((resolve) => {
    editor.update(() => {
      try {
        const root = $getRoot();
        const nodes = convertContentToNodes(content);
        
        if (nodes.length === 0) {
          resolve({
            success: false,
            message: 'لا يوجد محتوى للإدراج'
          });
          return;
        }

        // Add some spacing before new content if document isn't empty
        if (root.getChildrenSize() > 0) {
          root.append($createParagraphNode());
        }

        // Append nodes to the end
        nodes.forEach(node => root.append(node));
        
        // Move cursor to end of inserted content
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          const selection = $createRangeSelection();
          selection.anchor.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
          selection.focus.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
          $setSelection(selection);
        }
        
        resolve({
          success: true,
          message: `تم إدراج ${nodes.length} عنصر بنجاح في نهاية المستند`
        });
        
      } catch (error) {
        console.error('Error inserting content at end:', error);
        resolve({
          success: false,
          message: 'حدث خطأ أثناء الإدراج في النهاية'
        });
      }
    });
  });
}

// Get current cursor context (what section/heading the cursor is under)
export function getCurrentCursorContext(editor: LexicalEditor): Promise<string> {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      try {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const focusNode = selection.focus.getNode();
          
          // Try to find the nearest heading or section
          let contextNode = anchorNode.getParent();
          let context = 'قسم المحتوى الحالي';
          
          // Look for headings in nearby nodes
          const root = $getRoot();
          const children = root.getChildren();
          
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.getType() === 'heading') {
              const textContent = child.getTextContent();
              if (textContent) {
                context = `تحت العنوان: ${textContent}`;
                break;
              }
            }
          }
          
          resolve(context);
        } else {
          resolve('بداية المستند');
        }
      } catch (error) {
        console.error('Error getting cursor context:', error);
        resolve('موقع غير محدد');
      }
    });
  });
}
