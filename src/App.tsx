import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import { useElectron } from './hooks/useElectron';

type SplitMode = 'horizontal' | 'vertical';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const initialContent = `// Welcome to the Code Editor
// Start editing your code here...`;

function App() {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [editorLanguage, setEditorLanguage] = useState('plaintext');
  const [showPreview, setShowPreview] = useState(true);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('horizontal');
  const { saveFile } = useElectron();

  const handleEditorChange = (value: string) => {
    setEditorContent(value);
  };

  const handleFileOpen = (content: string, fileName: string) => {
    setEditorContent(content);
    setCurrentFilePath(fileName);
    // Detect language based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        setEditorLanguage('javascript');
        break;
      case 'ts':
      case 'tsx':
        setEditorLanguage('typescript');
        break;
      case 'jsx':
        setEditorLanguage('javascript');
        break;
      case 'html':
        setEditorLanguage('html');
        break;
      case 'css':
        setEditorLanguage('css');
        break;
      case 'json':
        setEditorLanguage('json');
        break;
      case 'md':
        setEditorLanguage('markdown');
        break;
      case 'py':
        setEditorLanguage('python');
        break;
      case 'java':
        setEditorLanguage('java');
        break;
      case 'c':
      case 'cpp':
        setEditorLanguage('cpp');
        break;
      case 'go':
        setEditorLanguage('go');
        break;
      case 'rs':
        setEditorLanguage('rust');
        break;
      default:
        setEditorLanguage('plaintext');
    }

    // Only show preview for certain file types
    setShowPreview(['html', 'markdown'].includes(extension || ''));
  };

  const handleSave = async () => {
    try {
      const savedPath = await saveFile(editorContent, currentFilePath || undefined);
      if (savedPath) {
        setCurrentFilePath(savedPath);
        console.log('File saved successfully at:', savedPath);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const toggleSplitMode = () => {
    setSplitMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
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
        />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar onFileOpen={handleFileOpen} />
          <Box sx={{ flexGrow: 1 }}>
            <CodeEditor 
              initialValue={editorContent}
              onChange={handleEditorChange}
              language={editorLanguage}
              showPreview={showPreview}
              splitMode={splitMode}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 