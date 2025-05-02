import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import mermaid from 'mermaid';

// Initialize mermaid with specific configuration
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
  const previewRef = useRef<HTMLDivElement>(null);

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

  // Custom renderer for code blocks
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (language === 'mermaid') {
        return (
          <div className="mermaid" key={code}>
            {code}
          </div>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  // Render mermaid diagrams after markdown is rendered
  useEffect(() => {
    const renderMermaidDiagrams = async () => {
      try {
        // Wait for the DOM to be updated
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Find all mermaid diagrams
        const mermaidElements = document.querySelectorAll('.mermaid');
        
        // Render each diagram
        mermaidElements.forEach(async (element) => {
          try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            element.setAttribute('id', id);
            await mermaid.render(id, element.textContent || '');
            element.innerHTML = '';
            const svg = document.querySelector(`#${id} svg`);
            if (svg) {
              element.appendChild(svg);
            }
          } catch (error) {
            console.error('Error rendering mermaid diagram:', error);
          }
        });
      } catch (error) {
        console.error('Error in mermaid rendering:', error);
      }
    };

    renderMermaidDiagrams();
  }, [markdown]);

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
              '& .mermaid': {
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                margin: '1rem 0',
                '& svg': {
                  maxWidth: '100%',
                  height: 'auto',
                }
              }
            }}
          >
            <div ref={previewRef}>
              <ReactMarkdown
                components={components}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </Paper>
        </Panel>
      </PanelGroup>
    </Box>
  );
};

export default MarkdownEditor; 