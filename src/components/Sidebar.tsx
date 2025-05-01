import React, { useRef, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import {
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  FolderOpen as FolderOpenIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Add type declarations for File System Access API
declare global {
  interface Window {
    showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
  }
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
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

const drawerWidth = 240;

interface SidebarProps {
  onFileOpen?: (content: string, fileName: string) => void;
  currentContent?: string;
  currentFileName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onFileOpen, currentContent = '', currentFileName = 'untitled.txt' }) => {
  const currentFileHandleRef = useRef<FileSystemFileHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (boxRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to prevent multiple rapid updates
        window.requestAnimationFrame(() => {
          if (!entries || !entries.length) {
            return;
          }
          // Handle resize if needed
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
    currentFileHandleRef.current = null;
    if (onFileOpen) {
      onFileOpen('', 'untitled.txt');
    } else {
      console.error('onFileOpen callback is not provided');
    }
  };

  const handleOpenFile = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [{
            description: 'Text Files',
            accept: {
              'text/plain': ['.txt'],
              'text/markdown': ['.md'],
              'text/javascript': ['.js', '.jsx'],
              'text/typescript': ['.ts', '.tsx'],
              'text/html': ['.html'],
              'text/css': ['.css'],
              'application/json': ['.json']
            }
          }]
        });
        
        currentFileHandleRef.current = fileHandle;
        const file = await fileHandle.getFile();
        const content = await file.text();
        
        if (onFileOpen) {
          onFileOpen(content, file.name);
        }
      } else {
        // Fallback to traditional file input
        fileInputRef.current?.click();
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('File open cancelled');
      } else {
        console.error('Error opening file:', error);
        // Fallback to traditional file input
        fileInputRef.current?.click();
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (onFileOpen) {
          onFileOpen(content, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'txt':
        return 'text/plain';
      case 'md':
        return 'text/markdown';
      case 'js':
        return 'text/javascript';
      case 'jsx':
        return 'text/javascript';
      case 'ts':
        return 'text/typescript';
      case 'tsx':
        return 'text/typescript';
      case 'html':
        return 'text/html';
      case 'css':
        return 'text/css';
      case 'json':
        return 'application/json';
      default:
        return 'text/plain';
    }
  };

  const handleSaveFile = () => {
    try {
      // Ensure the file has an extension
      const fileName = currentFileName.includes('.') ? currentFileName : `${currentFileName}.txt`;
      const mimeType = getMimeType(fileName);
      
      // Create blob with proper MIME type
      const blob = new Blob([currentContent], { type: mimeType });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error: unknown) {
      console.error('Error saving file:', error);
    }
  };

  const handleSettings = () => {
    // TODO: Implement settings dialog
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
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept=".txt,.md,.js,.jsx,.ts,.tsx,.html,.css,.json"
      />
      <Box ref={boxRef} sx={{ overflow: 'auto', mt: 8 }}>
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