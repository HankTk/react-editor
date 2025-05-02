import { useState, useCallback, useEffect } from 'react';
import { useElectron } from './useElectron';

const LANGUAGE_MAP: { [key: string]: string } = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'html': 'html',
  'css': 'css',
  'json': 'json',
  'md': 'markdown',
  'py': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'cs': 'csharp',
  'go': 'go',
  'rs': 'rust',
  'php': 'php',
  'rb': 'ruby',
  'sh': 'shell',
  'sql': 'sql',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml'
};

export const useFileOperations = () => {
  const [editorContent, setEditorContent] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('plaintext');
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const { saveFile } = useElectron();

  const updateLanguageFromPath = useCallback((filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (extension === 'mermaid') {
      setEditorLanguage('mermaid');
    } else {
      setEditorLanguage(LANGUAGE_MAP[extension || ''] || 'plaintext');
    }
  }, []);

  const handleFileOpen = useCallback((content: string, fileName: string) => {
    setEditorContent(content);
    setCurrentFilePath(fileName);
    updateLanguageFromPath(fileName);
  }, [updateLanguageFromPath]);

  const handleSave = useCallback(async () => {
    try {
      console.log('Saving file with content:', editorContent);
      const savedPath = await saveFile(editorContent, currentFilePath || undefined);
      console.log('Save result:', savedPath);
      if (savedPath) {
        setCurrentFilePath(savedPath);
        updateLanguageFromPath(savedPath);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }, [editorContent, currentFilePath, saveFile, updateLanguageFromPath]);

  // Listen for file-saved event
  useEffect(() => {
    const handleFileSaved = (_event: any, filePath: string) => {
      console.log('File saved event received:', filePath);
      setCurrentFilePath(filePath);
      updateLanguageFromPath(filePath);
    };

    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('file-saved', handleFileSaved);
    }

    return () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.removeListener('file-saved', handleFileSaved);
      }
    };
  }, [updateLanguageFromPath]);

  return {
    editorContent,
    setEditorContent,
    editorLanguage,
    currentFilePath,
    handleFileOpen,
    handleSave
  };
}; 