export type Theme = 'Light' | 'Dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: ThemeColors;
} 