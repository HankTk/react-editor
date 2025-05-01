import React from 'react';
import { AppBar, Toolbar as MuiToolbar, Typography, IconButton, Tooltip } from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatSize as FormatSizeIcon,
  DarkMode as DarkModeIcon,
  Save as SaveIcon,
  ViewColumn as VerticalIcon,
  ViewStream as HorizontalIcon
} from '@mui/icons-material';

interface ToolbarProps {
  onSave?: () => void;
  splitMode?: 'horizontal' | 'vertical';
  onSplitModeChange?: () => void;
  showPreview?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onSave, 
  splitMode = 'horizontal',
  onSplitModeChange,
  showPreview = true 
}) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <MuiToolbar variant="dense">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          React Editor
        </Typography>
        <IconButton size="small" onClick={onSave}>
          <SaveIcon />
        </IconButton>
        <IconButton size="small">
          <UndoIcon />
        </IconButton>
        <IconButton size="small">
          <RedoIcon />
        </IconButton>
        <IconButton size="small">
          <FormatSizeIcon />
        </IconButton>
        <IconButton size="small">
          <DarkModeIcon />
        </IconButton>
        {showPreview && (
          <Tooltip title={`Switch to ${splitMode === 'horizontal' ? 'vertical' : 'horizontal'} split`}>
            <IconButton size="small" onClick={onSplitModeChange}>
              {splitMode === 'horizontal' ? <VerticalIcon /> : <HorizontalIcon />}
            </IconButton>
          </Tooltip>
        )}
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar; 