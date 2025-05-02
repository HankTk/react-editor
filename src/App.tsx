import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import MarkdownEditor from './components/MarkdownEditor';
import { useElectron } from './hooks/useElectron';
import { THEMES, type Theme } from './constants/theme';

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
  const [currentTheme, setCurrentTheme] = useState<Theme>('Light');
  const { saveFile } = useElectron();

  // Helper function to get theme colors
  const getThemeColor = (theme: Theme) => {
    switch (theme) {
      case 'Light':
        return {
          primary: '#1976d2',
          secondary: '#dc004e',
          background: '#ffffff',
          text: '#000000'
        };
      case 'Dark':
        return {
          primary: '#90caf9',
          secondary: '#f48fb1',
          background: '#1E1E1E',
          text: '#ffffff'
        };
    }
  };

  // Listen for theme changes from the main process
  useEffect(() => {
    const handleThemeChange = (_event: any, theme: string) => {
      console.log('Theme change received:', theme);
      if (THEMES.includes(theme as Theme)) {
        setCurrentTheme(theme as Theme);
        setIsDarkMode(theme === 'Dark');
      }
    };

    window.electron.ipcRenderer.on('theme-change', handleThemeChange);

    return () => {
      window.electron.ipcRenderer.removeListener('theme-change', handleThemeChange);
    };
  }, []);

  // Listen for split mode changes from the menu
  useEffect(() => {
    const handleSplitModeChange = (_event: any, mode: SplitMode) => {
      console.log('Split mode change received:', mode);
      setSplitMode(mode);
    };

    window.electron.ipcRenderer.on('split-mode-change', handleSplitModeChange);

    return () => {
      window.electron.ipcRenderer.removeListener('split-mode-change', handleSplitModeChange);
    };
  }, []);

  // Send current split mode to main process when it changes
  useEffect(() => {
    const mainWindow = window.electron.ipcRenderer;
    if (mainWindow) {
      mainWindow.send('update-split-mode', splitMode);
    }
  }, [splitMode]);

  // Create theme based on current theme
  const theme = React.useMemo(
    () => {
      const colors = getThemeColor(currentTheme);
      return createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: colors.primary,
          },
          secondary: {
            main: colors.secondary,
          },
          background: {
            default: colors.background,
            paper: colors.background,
          },
          text: {
            primary: colors.text,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: isDarkMode ? '#141820' : '#ffffff',
                color: isDarkMode ? '#a8b5d1' : '#000000',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#24283b' : '#ffffff',
                color: isDarkMode ? '#a8b5d1' : '#000000',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#24283b' : '#ffffff',
                color: isDarkMode ? '#a8b5d1' : '#000000',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#24283b' : '#ffffff',
                color: isDarkMode ? '#a8b5d1' : '#000000',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#506686' : '#f5f5f5',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: isDarkMode ? '#a8b5d1' : '#000000',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#506686' : '#f5f5f5',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? '#24283b' : '#ffffff',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: isDarkMode ? '#24283b' : '#ffffff',
                color: isDarkMode ? '#a8b5d1' : '#000000',
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                color: isDarkMode ? '#a8b5d1' : '#000000',
              },
            },
          },
        },
      });
    },
    [currentTheme, isDarkMode]
  );

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
    // Get the current index of the theme
    const currentIndex = THEMES.indexOf(currentTheme);
    // Get the next theme in the list, or go back to the first theme if we're at the end
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setCurrentTheme(nextTheme);
    setIsDarkMode(nextTheme === 'Dark');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar onFileOpen={handleFileOpen} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Toolbar
            onSave={handleSave}
            onSplitModeChange={toggleSplitMode}
            splitMode={splitMode}
            showPreview={showPreview}
            isDarkMode={isDarkMode}
          />
          {currentFilePath?.endsWith('.md') ? (
            <MarkdownEditor
              initialValue={editorContent}
              onChange={handleEditorChange}
            />
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: splitMode === 'horizontal' ? 'row' : 'column' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <CodeEditor
                  initialValue={editorContent}
                  language={editorLanguage}
                  onChange={handleEditorChange}
                  showPreview={showPreview}
                  splitMode={splitMode}
                  isDarkMode={isDarkMode}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 