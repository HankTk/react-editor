import React from 'react';
import { AppBar, Toolbar as MuiToolbar, IconButton, Tooltip, Typography } from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatSize as FormatSizeIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

export interface ToolbarProps {
  onSave: () => void;
  currentFilePath: string | null;
  showPreview: boolean;
  onPreviewToggle: () => void;
  isDarkMode?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  currentFilePath,
  showPreview,
  onPreviewToggle,
  isDarkMode = true
}) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <MuiToolbar>
        <IconButton onClick={onSave} color="inherit">
          <SaveIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
          {currentFilePath || 'Untitled'}
        </Typography>
        <IconButton onClick={onPreviewToggle} color="inherit">
          {showPreview ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar; 