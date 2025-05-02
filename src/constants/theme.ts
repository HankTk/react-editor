import { Theme, ThemeColors } from '../types/theme';

export const THEMES: Theme[] = ['Light', 'Dark'];

export const THEME_COLORS: Record<Theme, ThemeColors> = {
  Light: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    text: '#000000'
  },
  Dark: {
    primary: '#90caf9',
    secondary: '#f48fb1',
    background: '#1E1E1E',
    text: '#ffffff'
  }
};

export const COMPONENT_STYLES = {
  body: {
    light: {
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    dark: {
      backgroundColor: '#141820',
      color: '#a8b5d1'
    }
  },
  appBar: {
    light: {
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    dark: {
      backgroundColor: '#24283b',
      color: '#a8b5d1'
    }
  },
  button: {
    light: {
      backgroundColor: '#ffffff',
      color: '#000000',
      hover: {
        backgroundColor: '#f5f5f5'
      }
    },
    dark: {
      backgroundColor: '#24283b',
      color: '#a8b5d1',
      hover: {
        backgroundColor: '#506686'
      }
    }
  }
}; 