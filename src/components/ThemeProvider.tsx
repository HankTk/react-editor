import React, { useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { Theme } from '../types/theme';
import { THEMES, THEME_COLORS, COMPONENT_STYLES } from '../constants/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  currentTheme: Theme;
  isDarkMode: boolean;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  currentTheme,
  isDarkMode,
  onThemeChange
}) => {
  useEffect(() => {
    const handleThemeChange = (_event: any, theme: string) => {
      if (THEMES.includes(theme as Theme)) {
        onThemeChange(theme as Theme);
      }
    };

    window.electron.ipcRenderer.on('theme-change', handleThemeChange);
    return () => {
      window.electron.ipcRenderer.removeListener('theme-change', handleThemeChange);
    };
  }, [onThemeChange]);

  const theme = useMemo(() => {
    const colors = THEME_COLORS[currentTheme];
    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
          main: colors.primary,
        },
        secondary: {
          main: colors.secondary,
        },
        background: {
          default: colors.background,
          paper: colors.background,
        },
        text: {
          primary: colors.text,
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: COMPONENT_STYLES.body[isDarkMode ? 'dark' : 'light'],
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: COMPONENT_STYLES.appBar[isDarkMode ? 'dark' : 'light'],
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: COMPONENT_STYLES.appBar[isDarkMode ? 'dark' : 'light'],
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              ...COMPONENT_STYLES.button[isDarkMode ? 'dark' : 'light'],
              '&:hover': {
                backgroundColor: COMPONENT_STYLES.button[isDarkMode ? 'dark' : 'light'].hover.backgroundColor,
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: COMPONENT_STYLES.button[isDarkMode ? 'dark' : 'light'].color,
              '&:hover': {
                backgroundColor: COMPONENT_STYLES.button[isDarkMode ? 'dark' : 'light'].hover.backgroundColor,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: COMPONENT_STYLES.appBar[isDarkMode ? 'dark' : 'light'].backgroundColor,
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: COMPONENT_STYLES.appBar[isDarkMode ? 'dark' : 'light'].backgroundColor,
              color: COMPONENT_STYLES.appBar[isDarkMode ? 'dark' : 'light'].color,
            },
          },
        },
        MuiListItemText: {
          styleOverrides: {
            primary: {
              color: COMPONENT_STYLES.appBar[isDarkMode ? 'dark' : 'light'].color,
            },
          },
        },
      },
    });
  }, [currentTheme, isDarkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
}; 