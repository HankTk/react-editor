import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { getMainWindow } from '../windows/mainWindow';
import { saveFile, openFile } from './fileHandler';
import { handleThemeChange } from './themeHandler';
import { CHANNELS } from '../constants/constants';

function setupIpcHandlers(): void {
  console.log('Setting up IPC handlers...');

  // Theme change handler
  ipcMain.on(CHANNELS.INCOMING.THEME_CHANGE, (_event, theme: string) => {
    console.log('Received theme change request:', theme);
    handleThemeChange(theme);
  });

  // New file handler
  ipcMain.on('new-file', (event: IpcMainEvent) => {
    console.log('Received new-file request from renderer');
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('new-file');
    }
  });

  // Open file handler
  ipcMain.on('open-file', (event: IpcMainEvent) => {
    console.log('Received open-file request from renderer');
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('open-file');
    }
  });

  // Save file handler
  ipcMain.on('save-file', (event: IpcMainEvent) => {
    console.log('Received save-file request from renderer');
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('save-file');
    }
  });

  ipcMain.on('ping', (event: IpcMainEvent) => {
    console.log('Received ping from renderer');
    event.reply('pong', 'pong');
  });

  ipcMain.handle('open-file', async (event: IpcMainInvokeEvent) => {
    console.log('Received open-file request from renderer');
    const mainWindow = getMainWindow();
    if (!mainWindow) {
      console.error('Main window not found in open-file handler');
      throw new Error('Main window not found');
    }
    return await openFile(mainWindow);
  });

  ipcMain.handle('save-file', async (event: IpcMainInvokeEvent, content: string, filePath?: string) => {
    console.log('Received save-file request from renderer');
    const mainWindow = getMainWindow();
    if (!mainWindow) {
      console.error('Main window not found in save-file handler');
      throw new Error('Main window not found');
    }
    return await saveFile(mainWindow, content, filePath);
  });

  console.log('IPC handlers setup complete');
}

export {
  setupIpcHandlers
}; 