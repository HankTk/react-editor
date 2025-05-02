import React, { useRef, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
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
  const { saveFile, openFile } = useElectron();

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
      onFileOpen('', 'untitled.txt');
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
      const savedPath = await saveFile(currentContent, currentFilePath || undefined);
      if (savedPath) {
        console.log('File saved successfully at:', savedPath);
        onFileOpen(currentContent, savedPath);
      } else {
        console.log('Save operation was cancelled or failed');
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleSettings = () => {
    console.log('Opening settings...');
  };

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
      <Box ref={boxRef} sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          <ListItem component="div" onClick={handleNewFile} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="New File" />
          </ListItem>
          <ListItem component="div" onClick={handleOpenFile} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText primary="Open" />
          </ListItem>
          <ListItem component="div" onClick={handleSaveFile} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary="Save" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem component="div" onClick={handleSettings} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 