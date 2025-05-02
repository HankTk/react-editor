import { BrowserWindow, screen, app } from 'electron';
import path from 'path';
import { APP, WINDOW_SIZES } from '../constants/constants';

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): BrowserWindow {
  console.log('Creating main window...');
  const dpr = screen.getPrimaryDisplay().scaleFactor || 1;

  mainWindow = new BrowserWindow({
    width: Math.round(WINDOW_SIZES.MAIN.WIDTH * dpr),
    height: Math.round(WINDOW_SIZES.MAIN.HEIGHT * dpr),
    frame: true,
    movable: true,
    transparent: false,
    resizable: true,
    icon: path.join(__dirname, '../icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, '../preload/preload.js'),
      enableBlinkFeatures: 'CSSBackdropFilter',
      experimentalFeatures: false,
      backgroundThrottling: false
    }
  });

  configureMainWindow();
  return mainWindow;
}

function configureMainWindow(): void {
  if (!mainWindow) return;

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setBackgroundColor('#00000000');
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setHasShadow(false);
  mainWindow.setOpacity(1);

  if (process.platform === 'win32') {
    app.setAppUserModelId(APP.ID);
  }
}

function loadMainWindowContent(): void {
  if (!mainWindow) return;

  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    console.log('Loading URL:', process.env.ELECTRON_START_URL || 'http://localhost:3000');
    mainWindow.loadURL(process.env.ELECTRON_START_URL || 'http://localhost:3000');
  } else {
    console.log('Running in production mode');
    const indexPath = path.join(__dirname, '../../index.html');
    const staticPath = path.join(__dirname, '../../static');

    configureStaticFileHandling(staticPath);
    mainWindow.loadFile(indexPath);
  }
}

function configureStaticFileHandling(staticPath: string): void {
  if (!mainWindow) return;

  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.startsWith('file:///static/')) {
      const newUrl = `file://${staticPath}${details.url.replace('file:///static/', '/')}`;
      callback({ redirectURL: newUrl });
    } else {
      callback({});
    }
  });
}

function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export {
  createMainWindow,
  loadMainWindowContent,
  getMainWindow
}; 