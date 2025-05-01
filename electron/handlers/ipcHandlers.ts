import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { getMainWindow } from '../windows/mainWindow';
import { saveFile } from './fileHandler';

function setupIpcHandlers(): void {
  ipcMain.on('ping', (event: IpcMainEvent) => {
    event.reply('pong', 'pong');
  });

  ipcMain.handle('save-file', async (event: IpcMainInvokeEvent, content: string, filePath?: string) => {
    const mainWindow = getMainWindow();
    if (!mainWindow) {
      throw new Error('Main window not found');
    }
    return await saveFile(mainWindow, content, filePath);
  });
}

export {
  setupIpcHandlers
}; 