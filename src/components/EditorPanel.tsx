import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

interface EditorPanelProps {
  editor: React.ReactNode;
  preview?: React.ReactNode;
  showPreview: boolean;
  splitMode: 'horizontal' | 'vertical';
  isDarkMode: boolean;
}

const ResizeHandle: React.FC<{ splitMode: 'horizontal' | 'vertical'; isDarkMode: boolean }> = ({ splitMode, isDarkMode }) => (
  <PanelResizeHandle
    className={`resize-handle ${isDarkMode ? 'dark' : 'light'}`}
    style={{
      width: splitMode === 'horizontal' ? '4px' : '100%',
      height: splitMode === 'horizontal' ? '100%' : '4px',
      cursor: splitMode === 'horizontal' ? 'col-resize' : 'row-resize'
    }}
  />
);

export const EditorPanel: React.FC<EditorPanelProps> = ({
  editor,
  preview,
  showPreview,
  splitMode,
  isDarkMode
}) => {
  const panelGroupRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSizeRef = useRef<{ width: number; height: number } | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSplitMode, setCurrentSplitMode] = useState(splitMode);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Track window size
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Update current split mode when prop changes
  useEffect(() => {
    console.log('Split mode prop changed:', splitMode);
    setCurrentSplitMode(splitMode);
  }, [splitMode]);

  // Add styles for resize handle
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .resize-handle {
        transition: background-color 0.2s;
      }
      .resize-handle.dark {
        background: #404040;
      }
      .resize-handle.dark:hover {
        background: #505050;
      }
      .resize-handle.light {
        background: #e0e0e0;
      }
      .resize-handle.light:hover {
        background: #d0d0d0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLayout = useCallback(() => {
    if (!containerRef.current || isTransitioning) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const lastSize = lastSizeRef.current;

    // Only trigger update if size actually changed
    if (!lastSize || lastSize.width !== width || lastSize.height !== height) {
      lastSizeRef.current = { width, height };
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (panelGroupRef.current) {
          const event = new Event('resize');
          window.dispatchEvent(event);
        }
      }, 150);
    }
  }, [isTransitioning]);

  // Setup ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new ResizeObserver((entries) => {
      if (entries.length > 0 && !isTransitioning) {
        requestAnimationFrame(() => {
          handleLayout();
        });
      }
    });

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleLayout, isTransitioning]);

  // Handle split mode changes
  useEffect(() => {
    if (panelGroupRef.current) {
      console.log('Handling split mode change:', currentSplitMode);
      setIsTransitioning(true);
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      requestAnimationFrame(() => {
        handleLayout();
        
        setTimeout(() => {
          if (containerRef.current && observerRef.current) {
            observerRef.current.observe(containerRef.current);
          }
          setIsTransitioning(false);
        }, 300);
      });
    }
  }, [currentSplitMode, handleLayout]);

  // Calculate default sizes based on window size
  const getDefaultSizes = useCallback(() => {
    const isSmallScreen = windowSize.width < 1024;
    const isVertical = currentSplitMode === 'vertical';
    
    if (isSmallScreen) {
      return {
        editor: isVertical ? 60 : 50,
        preview: isVertical ? 40 : 50
      };
    }
    
    return {
      editor: isVertical ? 50 : 60,
      preview: isVertical ? 50 : 40
    };
  }, [windowSize.width, currentSplitMode]);

  const defaultSizes = getDefaultSizes();

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF'
      }}
    >
      <PanelGroup 
        ref={panelGroupRef}
        direction={currentSplitMode}
        onLayout={handleLayout}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: currentSplitMode === 'horizontal' ? 'row' : 'column'
        }}
      >
        <Panel 
          defaultSize={showPreview ? defaultSizes.editor : 100}
          minSize={30}
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {editor}
          </Box>
        </Panel>
        {showPreview && preview && (
          <>
            <ResizeHandle splitMode={currentSplitMode} isDarkMode={isDarkMode} />
            <Panel 
              defaultSize={defaultSizes.preview}
              minSize={30}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'auto',
                  p: 2
                }}
              >
                {preview}
              </Box>
            </Panel>
          </>
        )}
      </PanelGroup>
    </Box>
  );
}; 