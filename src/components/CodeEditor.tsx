import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Paper } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

interface CodeEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  language?: string;
  showPreview?: boolean;
  splitMode?: 'horizontal' | 'vertical';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialValue = '', 
  onChange, 
  language = 'plaintext',
  showPreview = true,
  splitMode = 'horizontal'
}) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutTimeoutRef = useRef<NodeJS.Timeout>();
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Force initial layout with a delay
    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      onChange?.(value);
    }
  };

  const updateLayout = useCallback(() => {
    if (isTransitioningRef.current) return;
    
    if (layoutTimeoutRef.current) {
      clearTimeout(layoutTimeoutRef.current);
    }

    isTransitioningRef.current = true;
    layoutTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
      isTransitioningRef.current = false;
    }, 150);
  }, []);

  useEffect(() => {
    // Update layout when split mode changes
    isTransitioningRef.current = true;
    const timeoutId = setTimeout(() => {
      updateLayout();
    }, 50);

    return () => {
      if (layoutTimeoutRef.current) {
        clearTimeout(layoutTimeoutRef.current);
      }
      clearTimeout(timeoutId);
      isTransitioningRef.current = false;
    };
  }, [splitMode, updateLayout]);

  const handlePanelResize = () => {
    if (!isTransitioningRef.current) {
      updateLayout();
    }
  };

  const getPreviewContent = () => {
    // Only wrap in HTML for specific file types that need it
    if (language === 'html') {
      return value;
    }

    // For other file types, show a formatted code preview
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: monospace;
            white-space: pre;
            padding: 20px;
            background: #f5f5f5;
            margin: 0;
          }
          pre {
            margin: 0;
            padding: 10px;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow-x: auto;
          }
          .line-numbers {
            color: #999;
            padding-right: 10px;
            border-right: 1px solid #ddd;
            margin-right: 10px;
            user-select: none;
          }
        </style>
      </head>
      <body>
        <pre>${value.split('\n').map((line, i) => 
          `<span class="line-numbers">${(i + 1).toString().padStart(3, ' ')}</span>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`
        ).join('\n')}</pre>
      </body>
      </html>
    `;
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }} 
      ref={containerRef}
    >
      <PanelGroup 
        direction={splitMode}
        style={{ flex: 1 }}
        onLayout={handlePanelResize}
      >
        <Panel defaultSize={showPreview ? 50 : 100}>
          <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <Editor
              height="100%"
              defaultLanguage={language}
              value={value}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
                renderWhitespace: 'none',
                folding: true,
                lineNumbers: 'on',
                glyphMargin: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                }
              }}
            />
          </Box>
        </Panel>
        {showPreview && (
          <>
            <PanelResizeHandle
              style={{
                width: splitMode === 'horizontal' ? '4px' : '100%',
                height: splitMode === 'horizontal' ? '100%' : '4px',
                background: '#333',
                cursor: splitMode === 'horizontal' ? 'col-resize' : 'row-resize',
                transition: 'background 0.2s',
              }}
            />
            <Panel defaultSize={50}>
              <Paper 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  bgcolor: 'white',
                  overflow: 'auto',
                  p: 2
                }}
              >
                <iframe
                  srcDoc={getPreviewContent()}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title="Preview"
                />
              </Paper>
            </Panel>
          </>
        )}
      </PanelGroup>
    </Box>
  );
};

export default CodeEditor; 