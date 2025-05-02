import React, { useState, useEffect, useCallback } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import { ThemeProvider } from './components/ThemeProvider';
import { useFileOperations } from './hooks/useFileOperations';
import { Theme } from './types/theme';
import { THEMES } from './constants/theme';

type SplitMode = 'horizontal' | 'vertical';

const initialContent = `// Welcome to the Code Editor
// Start editing your code here...`;

const initialMermaidContent = `graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    B -- No --> D[End]`;

function App() {
  const [showPreview, setShowPreview] = useState(true);
  const [splitMode, setSplitMode] = useState<SplitMode>('horizontal');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<Theme>('Light');
  
  const {
    editorContent,
    setEditorContent,
    editorLanguage,
    currentFilePath,
    handleFileOpen,
    handleSave
  } = useFileOperations();

  // Initialize editor content
  useEffect(() => {
    if (!currentFilePath && !editorContent) {
      setEditorContent(initialContent);
    }
  }, [currentFilePath, editorContent, setEditorContent]);

  // Listen for split mode changes from the menu
  useEffect(() => {
    const handleSplitModeChange = (_event: any, mode: SplitMode) => {
      console.log('Menu split mode change:', mode); // Debug log
      setSplitMode(mode);
    };

    window.electron.ipcRenderer.on('split-mode-change', handleSplitModeChange);
    return () => {
      window.electron.ipcRenderer.removeListener('split-mode-change', handleSplitModeChange);
    };
  }, []);

  // Send current split mode to main process when it changes
  useEffect(() => {
    console.log('Split mode changed to:', splitMode); // Debug log
    window.electron.ipcRenderer.send('update-split-mode', splitMode);
  }, [splitMode]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setIsDarkMode(theme === 'Dark');
  };

  const handleSplitModeChange = useCallback((mode: SplitMode) => {
    console.log('Toolbar split mode change:', mode); // Debug log
    setSplitMode(mode);
  }, []);

  return (
    <ThemeProvider
      currentTheme={currentTheme}
      isDarkMode={isDarkMode}
      onThemeChange={handleThemeChange}
    >
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar 
          onFileOpen={handleFileOpen} 
          currentContent={editorContent}
          currentFilePath={currentFilePath}
        />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Toolbar
            onSave={handleSave}
            currentFilePath={currentFilePath}
            showPreview={showPreview}
            onPreviewToggle={() => setShowPreview(!showPreview)}
            splitMode={splitMode}
            onSplitModeChange={handleSplitModeChange}
            isDarkMode={isDarkMode}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <CodeEditor
              value={editorContent}
              language={editorLanguage}
              onChange={setEditorContent}
              showPreview={showPreview}
              splitMode={splitMode}
              isDarkMode={isDarkMode}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 