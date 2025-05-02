import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import { useElectron } from './hooks/useElectron';

type SplitMode = 'horizontal' | 'vertical';

const initialContent = `// Welcome to the Code Editor
// Start editing your code here...`;

function App() {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [editorLanguage, setEditorLanguage] = useState('plaintext');
  const [showPreview, setShowPreview] = useState(true);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('horizontal');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { saveFile } = useElectron();

  // Create theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  // Listen for theme changes from the main process
  useEffect(() => {
    const handleThemeChange = (_event: any, newTheme: string) => {
      setIsDarkMode(newTheme === 'Dark');
    };

    window.electron.ipcRenderer.on('theme-change', handleThemeChange);

    return () => {
      window.electron.ipcRenderer.removeListener('theme-change', handleThemeChange);
    };
  }, []);

  const handleEditorChange = (value: string) => {
    setEditorContent(value);
  };

  const handleFileOpen = (content: string, fileName: string) => {
    setEditorContent(content);
    setCurrentFilePath(fileName);
    // Detect language based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    let detectedLanguage = 'plaintext';
    
    switch (extension) {
      case 'js':
        detectedLanguage = 'javascript';
        break;
      case 'ts':
      case 'tsx':
        detectedLanguage = 'typescript';
        break;
      case 'jsx':
        detectedLanguage = 'javascript';
        break;
      case 'html':
        detectedLanguage = 'html';
        break;
      case 'css':
        detectedLanguage = 'css';
        break;
      case 'json':
        detectedLanguage = 'json';
        break;
      case 'md':
        detectedLanguage = 'markdown';
        break;
      case 'py':
        detectedLanguage = 'python';
        break;
      case 'java':
        detectedLanguage = 'java';
        break;
      case 'c':
      case 'cpp':
        detectedLanguage = 'cpp';
        break;
      case 'go':
        detectedLanguage = 'go';
        break;
      case 'rs':
        detectedLanguage = 'rust';
        break;
      default:
        detectedLanguage = 'plaintext';
    }
    
    console.log('Setting language to:', detectedLanguage);
    setEditorLanguage(detectedLanguage);

    // Only show preview for certain file types
    setShowPreview(['html', 'markdown'].includes(extension || ''));
  };

  const handleSave = async () => {
    try {
      console.log('Attempting to save file...');
      console.log('Current file path:', currentFilePath);
      console.log('Content length:', editorContent.length);
      const savedPath = await saveFile(editorContent, currentFilePath || undefined);
      console.log('Save result:', savedPath);
      if (savedPath) {
        setCurrentFilePath(savedPath);
        console.log('File saved successfully at:', savedPath);
      } else {
        console.log('Save operation was cancelled or failed');
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const toggleSplitMode = () => {
    setSplitMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar 
          onSave={handleSave}
          splitMode={splitMode}
          onSplitModeChange={toggleSplitMode}
          showPreview={showPreview}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
        />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar 
            onFileOpen={handleFileOpen} 
            currentContent={editorContent}
            currentFilePath={currentFilePath}
          />
          <Box sx={{ flexGrow: 1 }}>
            <CodeEditor 
              initialValue={editorContent}
              onChange={handleEditorChange}
              language={editorLanguage}
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