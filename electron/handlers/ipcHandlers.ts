import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { getMainWindow } from '../windows/mainWindow';
import { saveFile, openFile } from './fileHandler';

function setupIpcHandlers(): void {
  console.log('Setting up IPC handlers...');

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