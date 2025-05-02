import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { EditorPanel } from './EditorPanel';

export interface MarkdownEditorProps {
  content: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content }) => {
  const [markdown, setMarkdown] = useState<string>(content);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setMarkdown(content);
  }, [content]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMarkdown(value);
    }
  };

  return (
    <EditorPanel
      editor={
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={markdown}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      }
      preview={
        <ReactMarkdown>
          {markdown}
        </ReactMarkdown>
      }
      showPreview={true}
      splitMode="horizontal"
      isDarkMode={true}
    />
  );
};

export default MarkdownEditor; 