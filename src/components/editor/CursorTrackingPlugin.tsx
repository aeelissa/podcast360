
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useDocumentContext } from '../../contexts/DocumentContext';

export function CursorTrackingPlugin() {
  const [editor] = useLexicalComposerContext();
  const { setCursorPosition } = useDocumentContext();

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorOffset = selection.anchor.offset;
            setCursorPosition(anchorOffset);
          }
        });
        return false;
      },
      1
    );
  }, [editor, setCursorPosition]);

  return null;
}
