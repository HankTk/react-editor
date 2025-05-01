import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { WINDOW_SIZES } from '../constants/constants';

function createAboutWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.size;

  const aboutWindow = new BrowserWindow({
    width: WINDOW_SIZES.ABOUT.WIDTH,
    height: WINDOW_SIZES.ABOUT.HEIGHT,
    modal: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Center the window on the full screen
  aboutWindow.setPosition(
    Math.floor((screenWidth - WINDOW_SIZES.ABOUT.WIDTH) / 2),
    Math.floor((screenHeight - WINDOW_SIZES.ABOUT.HEIGHT) / 2)
  );

  aboutWindow.loadFile(path.join(__dirname, '../dialogs/about.html'));
}

export {
  createAboutWindow
}; 