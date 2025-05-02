import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  initialValue = '# Hello World\n\nStart writing your markdown here...',
  onChange 
}) => {
  const [markdown, setMarkdown] = useState<string>(initialValue);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMarkdown(initialValue);
  }, [initialValue]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMarkdown(value);
      onChange?.(value);
    }
  };

  const debouncedLayoutUpdate = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        requestAnimationFrame(() => {
          if (editorRef.current) {
            editorRef.current.layout();
          }
        });
      }
    }, 100);
  }, []);

  const handlePanelResize = useCallback(() => {
    debouncedLayoutUpdate();
  }, [debouncedLayoutUpdate]);

  // Add resize observer for container
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      debouncedLayoutUpdate();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [debouncedLayoutUpdate]);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <PanelGroup 
        direction="horizontal"
        onLayout={handlePanelResize}
      >
        <Panel defaultSize={50}>
          <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
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
                automaticLayout: false,
              }}
            />
          </Paper>
        </Panel>
        <PanelResizeHandle style={{ width: '4px', background: '#ccc' }} />
        <Panel defaultSize={50}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%', 
              overflow: 'auto',
              p: 2,
              '& pre': {
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
              },
              '& code': {
                backgroundColor: '#f5f5f5',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
              },
            }}
          >
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </Paper>
        </Panel>
      </PanelGroup>
    </Box>
  );
};

export default MarkdownEditor; 