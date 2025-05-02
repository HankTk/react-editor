import { BrowserWindow } from 'electron';
import { getMainWindow } from '../windows/mainWindow';

export function handleThemeChange(theme: string): void {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    mainWindow.webContents.send('theme-change', theme);
  }
} 