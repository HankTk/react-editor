import React from 'react';
import { AppBar, Toolbar as MuiToolbar, IconButton, Tooltip, ButtonGroup } from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatSize as FormatSizeIcon,
  Save as SaveIcon,
  ViewColumn as VerticalIcon,
  ViewStream as HorizontalIcon
} from '@mui/icons-material';

interface ToolbarProps {
  onSave?: () => void;
  splitMode?: 'horizontal' | 'vertical';
  onSplitModeChange?: (mode: 'horizontal' | 'vertical') => void;
  showPreview?: boolean;
  isDarkMode?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onSave, 
  splitMode = 'horizontal',
  onSplitModeChange,
  showPreview = true,
  isDarkMode = true
}) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <MuiToolbar variant="dense" sx={{ justifyContent: 'flex-end' }}>
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
        {showPreview && (
          <ButtonGroup size="small" aria-label="split mode">
            <Tooltip title="Horizontal split">
              <IconButton 
                size="small" 
                onClick={() => onSplitModeChange && onSplitModeChange('horizontal')}
                color={splitMode === 'horizontal' ? 'primary' : 'default'}
              >
                <HorizontalIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vertical split">
              <IconButton 
                size="small" 
                onClick={() => onSplitModeChange && onSplitModeChange('vertical')}
                color={splitMode === 'vertical' ? 'primary' : 'default'}
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