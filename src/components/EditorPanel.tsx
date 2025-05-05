import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

interface EditorPanelProps {
  editor: React.ReactNode;
  preview?: React.ReactNode;
  showPreview: boolean;
  isDarkMode: boolean;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  editor,
  preview,
  showPreview,
  isDarkMode
}) => {
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = editorWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - startXRef.current;
    const deltaPercent = (deltaX / containerRect.width) * 100;
    const newWidth = startWidthRef.current + deltaPercent;
    
    // Limit the width between 20% and 80%
    if (newWidth >= 20 && newWidth <= 80) {
      requestAnimationFrame(() => {
        setEditorWidth(newWidth);
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: showPreview ? `${editorWidth}% 4px 1fr` : '1fr',
        overflow: 'hidden',
        bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF'
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0
        }}
      >
        {editor}
      </Box>
      {showPreview && preview && (
        <>
          <Box
            sx={{
              height: '100%',
              cursor: 'col-resize',
              bgcolor: isDarkMode ? '#404040' : '#e0e0e0',
              '&:hover': {
                bgcolor: isDarkMode ? '#505050' : '#d0d0d0',
              }
            }}
            onMouseDown={handleMouseDown}
          />
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              p: 2,
              minWidth: 0
            }}
          >
            {preview}
          </Box>
        </>
      )}
    </Box>
  );
}; 