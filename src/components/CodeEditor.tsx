import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Box } from '@mui/material';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';
import { EditorPanel } from './EditorPanel';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  }
});

// Add a function to reset mermaid
const resetMermaid = () => {
  mermaid.contentLoaded();
};

export interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  showPreview?: boolean;
  isDarkMode?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language,
  onChange,
  showPreview = true,
  isDarkMode = true
}) => {
  const [editorValue, setEditorValue] = useState(value);
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (language === 'mermaid' && (!value || value.trim() === '')) {
      const defaultMermaid = `graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    B -- No --> D[End]`;
      setEditorValue(defaultMermaid);
      onChange(defaultMermaid);
    } else {
      setEditorValue(value);
    }
  }, [value, language, onChange]);

  const editorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
    
    editor.updateOptions({
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
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
      }
    }
  }, [isDarkMode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
      onChange(value);
    }
  };

  useEffect(() => {
    if (language === 'mermaid' && previewRef.current) {
      try {
        console.log('Initializing Mermaid with content:', editorValue);
        
        mermaid.initialize({
          startOnLoad: true,
          theme: isDarkMode ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'monospace',
          flowchart: {
            htmlLabels: true,
            curve: 'basis'
          }
        });

        // Check if content is empty or just whitespace
        if (!editorValue || editorValue.trim() === '') {
          console.log('Empty content detected, showing default diagram');
          if (previewRef.current) {
            previewRef.current.innerHTML = '<div style="color: #666;">Enter a Mermaid diagram...</div>';
          }
          return;
        }

        // Try to detect diagram type if not specified
        let diagramContent = editorValue.trim();
        console.log('Original diagram content:', diagramContent);
        
        // Remove any comments (lines starting with //)
        diagramContent = diagramContent.split('\n')
          .filter(line => !line.trim().startsWith('//'))
          .join('\n')
          .trim();
        
        console.log('Content after removing comments:', diagramContent);

        // If content is empty after removing comments, show default diagram
        if (!diagramContent) {
          console.log('Content empty after comment removal, using default diagram');
          diagramContent = `graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    B -- No --> D[End]`;
        }
        // If content doesn't start with a diagram type, wrap it in a graph
        else if (!diagramContent.startsWith('graph') && 
            !diagramContent.startsWith('sequenceDiagram') && 
            !diagramContent.startsWith('classDiagram') && 
            !diagramContent.startsWith('stateDiagram') && 
            !diagramContent.startsWith('erDiagram') && 
            !diagramContent.startsWith('flowchart') && 
            !diagramContent.startsWith('gantt') && 
            !diagramContent.startsWith('pie') && 
            !diagramContent.startsWith('journey')) {
          console.log('No diagram type detected, wrapping in graph TD');
          diagramContent = `graph TD\n${diagramContent}`;
        }

        console.log('Final diagram content to render:', diagramContent);

        // Reset mermaid before rendering
        resetMermaid();

        // Create a unique ID for this render
        const diagramId = `mermaid-diagram-${Date.now()}`;
        
        mermaid.render(diagramId, diagramContent).then(({ svg }) => {
          console.log('Mermaid render successful');
          if (previewRef.current) {
            // Create a container div with the mermaid class
            const container = document.createElement('div');
            container.className = 'mermaid';
            container.innerHTML = svg;
            previewRef.current.innerHTML = '';
            previewRef.current.appendChild(container);
            
            // Force a reflow to ensure the SVG is properly sized
            previewRef.current.style.display = 'none';
            // Use void operator to handle the expression
            void previewRef.current.offsetHeight;
            previewRef.current.style.display = 'flex';
          }
        }).catch((error: Error) => {
          console.error('Error rendering mermaid diagram:', error);
          if (previewRef.current) {
            previewRef.current.innerHTML = `<div style="color: red;">Error rendering diagram: ${error.message}</div>`;
          }
        });
      } catch (error: unknown) {
        console.error('Error initializing mermaid:', error);
        if (previewRef.current) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          previewRef.current.innerHTML = `<div style="color: red;">Error initializing mermaid: ${errorMessage}</div>`;
        }
      }
    }
  }, [editorValue, language, isDarkMode]);

  const renderPreview = () => {
    if (language === 'mermaid') {
      return (
        <Box
          ref={previewRef}
          sx={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block'
            },
            '& .mermaid': {
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
        />
      );
    }

    if (language === 'markdown') {
      return (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
            p: 2,
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 2,
              mb: 1,
              fontWeight: 'bold',
              color: isDarkMode ? '#fff' : '#000'
            },
            '& p': {
              my: 1
            },
            '& code': {
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
              padding: '2px 4px',
              borderRadius: '3px',
              fontFamily: 'monospace'
            },
            '& pre': {
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0
              }
            },
            '& blockquote': {
              borderLeft: `4px solid ${isDarkMode ? '#666' : '#ddd'}`,
              margin: '1rem 0',
              padding: '0.5rem 0 0.5rem 1rem',
              color: isDarkMode ? '#ccc' : '#666'
            },
            '& ul, & ol': {
              pl: 2
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              mb: 2,
              '& th, & td': {
                border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                padding: '0.5rem'
              },
              '& th': {
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5'
              }
            }
          }}
        >
          <ReactMarkdown>
            {editorValue}
          </ReactMarkdown>
        </Box>
      );
    }

    if (language === 'html') {
      return (
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: ${isDarkMode ? '#1E1E1E' : '#FFFFFF'};
                  color: ${isDarkMode ? '#D4D4D4' : '#000000'};
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                }
              </style>
            </head>
            <body>
              ${editorValue}
            </body>
            </html>
          `}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF'
          }}
          title="Preview"
        />
      );
    }

    return (
      <iframe
        srcDoc={`
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
            <pre>${editorValue.split('\n').map((line, i) => 
              `<span class="line-numbers">${(i + 1).toString().padStart(3, ' ')}</span>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`
            ).join('\n')}</pre>
          </body>
          </html>
        `}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF'
        }}
        title="Preview"
      />
    );
  };

  return (
    <EditorPanel
      editor={
        <Box sx={{ height: '100%', width: '100%' }}>
          <Editor
            height="100%"
            language={language}
            value={editorValue}
            onChange={handleEditorChange}
            onMount={editorDidMount}
            theme={isDarkMode ? 'vs-dark' : 'vs'}
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
      }
      preview={renderPreview()}
      showPreview={showPreview}
      isDarkMode={isDarkMode}
    />
  );
};

export default CodeEditor; 