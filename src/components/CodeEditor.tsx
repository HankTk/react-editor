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
  isDarkMode?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialValue = '', 
  onChange, 
  language = 'plaintext',
  showPreview = true,
  splitMode = 'horizontal',
  isDarkMode = true
}) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutTimeoutRef = useRef<NodeJS.Timeout>();
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Apply the appropriate theme
    monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
    
    // Ensure the editor is properly configured
    editor.updateOptions({
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: false,
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
    });

    // Force initial layout
    requestAnimationFrame(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    });
  };

  // Update theme when isDarkMode changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
        requestAnimationFrame(() => {
          if (editorRef.current) {
            editorRef.current.layout();
          }
        });
      }
    }
  }, [isDarkMode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      onChange?.(value);
    }
  };

  // Debounced layout update
  const debouncedLayoutUpdate = useCallback(() => {
    if (layoutTimeoutRef.current) {
      clearTimeout(layoutTimeoutRef.current);
    }
    layoutTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        requestAnimationFrame(() => {
          if (editorRef.current) {
            editorRef.current.layout();
          }
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    // Update layout when split mode changes
    if (editorRef.current) {
      isTransitioningRef.current = true;
      debouncedLayoutUpdate();
      
      const timeoutId = setTimeout(() => {
        isTransitioningRef.current = false;
        debouncedLayoutUpdate();
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        if (layoutTimeoutRef.current) {
          clearTimeout(layoutTimeoutRef.current);
        }
        isTransitioningRef.current = false;
      };
    }
  }, [splitMode, debouncedLayoutUpdate]);

  const handlePanelResize = useCallback(() => {
    if (!isTransitioningRef.current && editorRef.current) {
      debouncedLayoutUpdate();
    }
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
    };
  }, [debouncedLayoutUpdate]);

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
            background: ${isDarkMode ? '#1E1E1E' : '#FFFFFF'};
            color: ${isDarkMode ? '#D4D4D4' : '#000000'};
            margin: 0;
          }
          pre {
            margin: 0;
            padding: 10px;
            background: ${isDarkMode ? '#1E1E1E' : '#FFFFFF'};
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,${isDarkMode ? '0.3' : '0.1'});
            overflow-x: auto;
          }
          .line-numbers {
            color: ${isDarkMode ? '#858585' : '#999'};
            padding-right: 10px;
            border-right: 1px solid ${isDarkMode ? '#404040' : '#ddd'};
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
        overflow: 'hidden',
        bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF'
      }} 
      ref={containerRef}
    >
      <PanelGroup 
        direction={splitMode}
        style={{ flex: 1 }}
        onLayout={handlePanelResize}
      >
        <Panel defaultSize={showPreview ? 50 : 100}>
          <Box sx={{ height: '100%', width: '100%', overflow: 'hidden', bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }}>
            <Editor
              height="100%"
              language={language}
              value={value}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={isDarkMode ? 'vs-dark' : 'vs'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: false,
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
                background: isDarkMode ? '#333' : '#ddd',
                cursor: splitMode === 'horizontal' ? 'col-resize' : 'row-resize',
                transition: 'background 0.2s',
              }}
            />
            <Panel defaultSize={50}>
              <Paper 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
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
                    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF'
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