import { $getRoot, $getSelection } from 'lexical';
import React, { useEffect } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import theme from './theme';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import './RichTextEditorStyles.css';
import { WBBox } from '@admiin-com/ds-web';
export interface RichTextEditorProps {
  onChange: (editorState: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  throw error;
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}
export const RichTextEditor = React.forwardRef(
  (props: RichTextEditorProps, ref) => {
    const initialConfig = {
      namespace: 'MyEditor',
      theme: theme,
      onError,
    };
    // When the editor changes, you can get notified via the
    // LexicalOnChangePlugin!
    function onChange(editorState: any) {
      // editorState.read(() => {
      //   // Read the contents of the EditorState here.
      //   const root = $getRoot();
      //   const selection = $getSelection();

      //   // console.log(root, selection);
      props.onChange(editorState.toJSON());
      // });
    }
    return (
      <LexicalComposer initialConfig={initialConfig}>
        <WBBox
          ref={ref}
          className="editor-container"
          // onFocus={props.onFocus}
          // onBlur={props.onBlur}
        >
          <ToolbarPlugin />
          <WBBox className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChange} />
            {/* <HistoryPlugin /> */}
            <AutoFocusPlugin />
            {/* <TreeViewPlugin /> */}
          </WBBox>
        </WBBox>
      </LexicalComposer>
    );
  }
);
