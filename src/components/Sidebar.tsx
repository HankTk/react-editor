import React, { useRef, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import {
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  FolderOpen as FolderOpenIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useElectron } from '../hooks/useElectron';

// Add type declarations for File System Access API
declare global {
  interface Window {
    showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
  }
}

interface OpenFilePickerOptions {
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string): Promise<void>;
  close(): Promise<void>;
}

interface SidebarProps {
  onFileOpen: (content: string, fileName: string) => void;
  currentContent?: string;
  currentFilePath?: string | null;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ onFileOpen, currentContent = '', currentFilePath = null }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { saveFile, openFile, newFile } = useElectron();

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (boxRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        window.requestAnimationFrame(() => {
          if (!entries || !entries.length) {
            return;
          }
        });
      });

      resizeObserver.observe(boxRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const handleNewFile = () => {
    if (onFileOpen) {
      onFileOpen('', 'untitled.mermaid');
    } else {
      console.error('onFileOpen callback is not provided');
    }
  };

  const handleOpenFile = async () => {
    try {
      const result = await openFile();
      if (result) {
        const { content, filePath } = result;
        const fileName = filePath.split('/').pop() || 'untitled.txt';
        onFileOpen(content, filePath);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleSaveFile = async () => {
    try {
      if (!currentContent) {
        console.error('No content to save');
        return;
      }
      const savedPath = await saveFile(currentContent, currentFilePath || undefined);
      if (savedPath) {
        onFileOpen(currentContent, savedPath);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleSettings = () => {
    console.log('Opening settings...');
  };

  // Listen for menu actions
  useEffect(() => {
    const handleNewFileMenu = () => {
      handleNewFile();
    };

    const handleOpenFileMenu = () => {
      handleOpenFile();
    };

    const handleSaveFileMenu = () => {
      handleSaveFile();
    };

    window.electron.ipcRenderer.on('new-file', handleNewFileMenu);
    window.electron.ipcRenderer.on('open-file', handleOpenFileMenu);
    window.electron.ipcRenderer.on('save-file', handleSaveFileMenu);

    return () => {
      window.electron.ipcRenderer.removeListener('new-file', handleNewFileMenu);
      window.electron.ipcRenderer.removeListener('open-file', handleOpenFileMenu);
      window.electron.ipcRenderer.removeListener('save-file', handleSaveFileMenu);
    };
  }, [currentContent, currentFilePath, onFileOpen]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Typography 
        variant="h5" 
        component="div" 
        sx={{ 
          p: 2, 
          textAlign: 'center',
          color: 'inherit',
          fontSize: '1.5rem'
        }}
      >
        React Editor
      </Typography>
      <Divider />
      <Box ref={boxRef} sx={{ overflow: 'auto' }}>
        <List>
          <ListItem component="div" onClick={handleNewFile} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="New File" sx={{ color: 'text.primary' }} />
          </ListItem>
          <ListItem component="div" onClick={handleOpenFile} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText primary="Open" sx={{ color: 'text.primary' }} />
          </ListItem>
          <ListItem component="div" onClick={handleSaveFile} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary="Save" sx={{ color: 'text.primary' }} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem component="div" onClick={handleSettings} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={{ color: 'text.primary' }} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 