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

// eslint-disable-next-line react/display-name
export const TextArea = React.forwardRef(({ content, onChange }: Props, ref) => {
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

  React.useImperativeHandle(ref, () => ({
    clearEditor() {
      const newEditorState = EditorState.push(
        editorState,
        ContentState.createFromText(''),
        'remove-range'
      );

      setEditorState(newEditorState);
    },
  }));

  return (
    <div
      className="min-h-[5rem] cursor-text"
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
});
