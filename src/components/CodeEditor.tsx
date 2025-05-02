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

// Dark theme configuration
const darkTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'D4D4D4' }, // Default text color
    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'comment', foreground: '6A9955' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'delimiter', foreground: 'D4D4D4' },
    { token: 'delimiter.bracket', foreground: 'D4D4D4' },
    { token: 'delimiter.array', foreground: 'D4D4D4' },
    { token: 'delimiter.parenthesis', foreground: 'D4D4D4' },
    { token: 'delimiter.curly', foreground: 'D4D4D4' },
    { token: 'delimiter.square', foreground: 'D4D4D4' },
    { token: 'delimiter.angle', foreground: 'D4D4D4' },
    { token: 'delimiter.semicolon', foreground: 'D4D4D4' },
    { token: 'delimiter.comma', foreground: 'D4D4D4' },
    { token: 'delimiter.dot', foreground: 'D4D4D4' },
    { token: 'delimiter.colon', foreground: 'D4D4D4' },
    { token: 'delimiter.arrow', foreground: 'D4D4D4' },
    
    // HTML specific colors
    { token: 'tag', foreground: '569CD6' },
    { token: 'attribute', foreground: '9CDCFE' },
    { token: 'attribute.value', foreground: 'CE9178' },
    
    // CSS specific colors
    { token: 'property', foreground: '9CDCFE' },
    { token: 'value', foreground: 'CE9178' },
    { token: 'selector', foreground: 'D7BA7D' },
    { token: 'unit', foreground: 'B5CEA8' },
    
    // Python specific colors
    { token: 'def', foreground: 'DCDCAA' },
    { token: 'class', foreground: '4EC9B0' },
    { token: 'decorator', foreground: 'DCDCAA' },
    { token: 'self', foreground: '9CDCFE' },
    
    // Rust specific colors
    { token: 'macro', foreground: 'C586C0' },
    { token: 'lifetime', foreground: '4EC9B0' },
    { token: 'attribute', foreground: '9CDCFE' },
    { token: 'derive', foreground: 'C586C0' },

    // Additional token types
    { token: 'keyword.control', foreground: 'C586C0' },
    { token: 'keyword.operator', foreground: 'D4D4D4' },
    { token: 'keyword.other', foreground: '569CD6' },
    { token: 'storage', foreground: '569CD6' },
    { token: 'storage.type', foreground: '4EC9B0' },
    { token: 'entity.name.function', foreground: 'DCDCAA' },
    { token: 'entity.name.type', foreground: '4EC9B0' },
    { token: 'entity.name.tag', foreground: '569CD6' },
    { token: 'entity.other.attribute-name', foreground: '9CDCFE' },
    { token: 'variable.parameter', foreground: '9CDCFE' },
    { token: 'variable.other', foreground: '9CDCFE' },
    { token: 'constant', foreground: '4FC1FF' },
    { token: 'constant.numeric', foreground: 'B5CEA8' },
    { token: 'constant.language', foreground: '569CD6' },
    { token: 'constant.character', foreground: 'CE9178' },
    { token: 'constant.other', foreground: '4FC1FF' },
    { token: 'support', foreground: '4EC9B0' },
    { token: 'support.function', foreground: 'DCDCAA' },
    { token: 'support.type', foreground: '4EC9B0' },
    { token: 'support.class', foreground: '4EC9B0' },
    { token: 'support.constant', foreground: '4FC1FF' },
    { token: 'support.variable', foreground: '9CDCFE' },
    { token: 'invalid', foreground: 'F44747' },
    { token: 'invalid.deprecated', foreground: 'CE9178' },
    { token: 'invalid.illegal', foreground: 'F44747' }
  ],
  colors: {
    'editor.background': '#1A1A1A',
    'editor.foreground': '#D4D4D4',
    'editor.lineHighlightBackground': '#2A2A2A',
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#3A3A3A',
    'editor.lineHighlightBorder': '#2A2A2A',
    'editorCursor.foreground': '#FFFFFF',
    'editorWhitespace.foreground': '#404040',
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
    'editorGutter.background': '#1A1A1A',
    'editorBracketMatch.background': '#0050A4',
    'editorBracketMatch.border': '#0050A4',
    'editorOverviewRuler.border': '#7F7F7F',
    'editorOverviewRuler.findMatchForeground': '#D18616',
    'editorOverviewRuler.selectionHighlightForeground': '#A9A9A9',
    'editorOverviewRuler.wordHighlightForeground': '#A9A9A9',
    'editorOverviewRuler.wordHighlightStrongForeground': '#C9C9C9',
    'editorOverviewRuler.modifiedForeground': '#1B81A8',
    'editorOverviewRuler.addedForeground': '#487E02',
    'editorOverviewRuler.deletedForeground': '#F14C4C',
    'editorOverviewRuler.errorForeground': '#F14C4C',
    'editorOverviewRuler.warningForeground': '#CCA700',
    'editorOverviewRuler.infoForeground': '#3794FF'
  }
};

// Light theme configuration
const lightTheme = {
  base: 'vs',
  inherit: true,
  rules: [
    // JavaScript/TypeScript specific colors
    { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
    { token: 'string', foreground: 'A31515' },
    { token: 'number', foreground: '098658' },
    { token: 'comment', foreground: '008000' },
    { token: 'function', foreground: '795E26' },
    { token: 'variable', foreground: '001080' },
    { token: 'type', foreground: '267F99' },
    { token: 'operator', foreground: '000000' },
    { token: 'delimiter', foreground: '000000' },
    { token: 'delimiter.bracket', foreground: '000000' },
    { token: 'delimiter.array', foreground: '000000' },
    { token: 'delimiter.parenthesis', foreground: '000000' },
    { token: 'delimiter.curly', foreground: '000000' },
    { token: 'delimiter.square', foreground: '000000' },
    { token: 'delimiter.angle', foreground: '000000' },
    { token: 'delimiter.semicolon', foreground: '000000' },
    { token: 'delimiter.comma', foreground: '000000' },
    { token: 'delimiter.dot', foreground: '000000' },
    { token: 'delimiter.colon', foreground: '000000' },
    { token: 'delimiter.arrow', foreground: '000000' },
    
    // HTML specific colors
    { token: 'tag', foreground: '0000FF' },
    { token: 'attribute', foreground: '001080' },
    { token: 'attribute.value', foreground: 'A31515' },
    
    // CSS specific colors
    { token: 'property', foreground: '001080' },
    { token: 'value', foreground: 'A31515' },
    { token: 'selector', foreground: '795E26' },
    { token: 'unit', foreground: '098658' },
    
    // Python specific colors
    { token: 'def', foreground: '795E26' },
    { token: 'class', foreground: '267F99' },
    { token: 'decorator', foreground: '795E26' },
    { token: 'self', foreground: '001080' },
    
    // Rust specific colors
    { token: 'macro', foreground: 'AF00DB' },
    { token: 'lifetime', foreground: '267F99' },
    { token: 'attribute', foreground: '001080' },
    { token: 'derive', foreground: 'AF00DB' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#000000',
    'editor.lineHighlightBackground': '#F0F0F0',
    'editor.selectionBackground': '#ADD6FF',
    'editor.inactiveSelectionBackground': '#E5EBF1',
    'editor.lineHighlightBorder': '#F0F0F0',
    'editorCursor.foreground': '#000000',
    'editorWhitespace.foreground': '#A0A0A0',
    'editorIndentGuide.background': '#D3D3D3',
    'editorIndentGuide.activeBackground': '#939393',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#000000',
    'editorGutter.background': '#FFFFFF',
    'editorBracketMatch.background': '#ADD6FF',
    'editorBracketMatch.border': '#ADD6FF',
    'editorOverviewRuler.border': '#7F7F7F',
    'editorOverviewRuler.findMatchForeground': '#D18616',
    'editorOverviewRuler.selectionHighlightForeground': '#A9A9A9',
    'editorOverviewRuler.wordHighlightForeground': '#A9A9A9',
    'editorOverviewRuler.wordHighlightStrongForeground': '#C9C9C9',
    'editorOverviewRuler.modifiedForeground': '#1B81A8',
    'editorOverviewRuler.addedForeground': '#487E02',
    'editorOverviewRuler.deletedForeground': '#F14C4C',
    'editorOverviewRuler.errorForeground': '#F14C4C',
    'editorOverviewRuler.warningForeground': '#CCA700',
    'editorOverviewRuler.infoForeground': '#3794FF'
  }
};

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
    
    // Register both themes
    monaco.editor.defineTheme('custom-dark', {
      ...darkTheme,
      inherit: true,
      base: 'vs-dark'
    });
    
    monaco.editor.defineTheme('custom-light', {
      ...lightTheme,
      inherit: true,
      base: 'vs'
    });
    
    // Apply the appropriate theme
    monaco.editor.setTheme(isDarkMode ? 'custom-dark' : 'custom-light');
    
    // Force initial layout
    editor.layout();
    
    // Ensure the editor is properly configured
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

    // Force a refresh of the editor
    setTimeout(() => {
      editor.layout();
      monaco.editor.setTheme(isDarkMode ? 'custom-dark' : 'custom-light');
    }, 100);
  };

  // Update theme when isDarkMode changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(isDarkMode ? 'custom-dark' : 'custom-light');
      }
    }
  }, [isDarkMode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      onChange?.(value);
    }
  };

  const updateLayout = useCallback(() => {
    if (isTransitioningRef.current || !editorRef.current) return;
    
    if (layoutTimeoutRef.current) {
      clearTimeout(layoutTimeoutRef.current);
    }

    layoutTimeoutRef.current = setTimeout(() => {
      editorRef.current.layout();
    }, 100);
  }, []);

  useEffect(() => {
    // Update layout when split mode changes
    if (editorRef.current) {
      isTransitioningRef.current = true;
      editorRef.current.layout();
      
      const timeoutId = setTimeout(() => {
        isTransitioningRef.current = false;
        editorRef.current.layout();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (layoutTimeoutRef.current) {
          clearTimeout(layoutTimeoutRef.current);
        }
        isTransitioningRef.current = false;
      };
    }
  }, [splitMode]);

  const handlePanelResize = useCallback(() => {
    if (!isTransitioningRef.current && editorRef.current) {
      editorRef.current.layout();
    }
  }, []);

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
            background: ${isDarkMode ? '#1A1A1A' : '#FFFFFF'};
            color: ${isDarkMode ? '#D4D4D4' : '#000000'};
            margin: 0;
          }
          pre {
            margin: 0;
            padding: 10px;
            background: ${isDarkMode ? '#1A1A1A' : '#FFFFFF'};
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
        bgcolor: isDarkMode ? '#1A1A1A' : '#FFFFFF'
      }} 
      ref={containerRef}
    >
      <PanelGroup 
        direction={splitMode}
        style={{ flex: 1 }}
        onLayout={handlePanelResize}
      >
        <Panel defaultSize={showPreview ? 50 : 100}>
          <Box sx={{ height: '100%', width: '100%', overflow: 'hidden', bgcolor: isDarkMode ? '#1A1A1A' : '#FFFFFF' }}>
            <Editor
              height="100%"
              language={language}
              value={value}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={isDarkMode ? 'custom-dark' : 'custom-light'}
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
                  bgcolor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
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
                    backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF'
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