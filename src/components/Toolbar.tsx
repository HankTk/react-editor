import React from 'react';
import { AppBar, Toolbar as MuiToolbar, IconButton, Tooltip, ButtonGroup, Typography } from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatSize as FormatSizeIcon,
  Save as SaveIcon,
  ViewColumn as VerticalIcon,
  ViewStream as HorizontalIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

export interface ToolbarProps {
  onSave: () => void;
  currentFilePath: string | null;
  showPreview: boolean;
  onPreviewToggle: () => void;
  splitMode?: 'horizontal' | 'vertical';
  onSplitModeChange?: (mode: 'horizontal' | 'vertical') => void;
  isDarkMode?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  currentFilePath,
  showPreview,
  onPreviewToggle,
  splitMode = 'horizontal',
  onSplitModeChange,
  isDarkMode = true
}) => {
  const handleSplitModeChange = (mode: 'horizontal' | 'vertical') => {
    console.log('Split mode change requested:', mode); // Debug log
    if (onSplitModeChange) {
      onSplitModeChange(mode);
    }
  };

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
        <IconButton size="small">
          <UndoIcon />
        </IconButton>
        <IconButton size="small">
          <RedoIcon />
        </IconButton>
        <IconButton size="small">
          <FormatSizeIcon />
        </IconButton>
        {showPreview && (
          <ButtonGroup size="small" aria-label="split mode">
            <Tooltip title="Horizontal split">
              <IconButton 
                size="small" 
                onClick={() => handleSplitModeChange('horizontal')}
                color={splitMode === 'horizontal' ? 'primary' : 'default'}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <HorizontalIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vertical split">
              <IconButton 
                size="small" 
                onClick={() => handleSplitModeChange('vertical')}
                color={splitMode === 'vertical' ? 'primary' : 'default'}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <VerticalIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        )}
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar; 