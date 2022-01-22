import * as React from 'react';
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  Editor,
  EditorState,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';

type Props = {
  content?: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
};

export function TextArea({ content, onChange }: Props) {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const editorRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (content && content.length > 0) {
      const blocksFromHtml = convertFromHTML(content);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );

      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [content]);

  return (
    <div
      className="h-36 cursor-text"
      onClick={() => {
        setTimeout(() => {
          if (editorRef && editorRef.current) {
            editorRef.current.focus();
          }
        });
      }}
    >
      <Editor
        editorState={editorState}
        ref={editorRef}
        onChange={editorState => {
          onChange(
            editorState.getCurrentContent().hasText() ||
              editorState.getCurrentContent().getPlainText().trim().length !== 0
              ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
              : ''
          );

          setEditorState(editorState);
        }}
      />
    </div>
  );
}
