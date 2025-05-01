import { BrowserWindow, dialog, app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * Handles saving file content to disk
 * @param mainWindow - The main application window
 * @param content - The content to save
 * @param filePath - Optional path to save the file. If not provided, a save dialog will be shown
 * @returns Promise that resolves to the saved file path or null if cancelled/error
 */
async function saveFile(mainWindow: BrowserWindow, content: string, filePath?: string): Promise<string | null> {
  try {
    if (!mainWindow) {
      throw new Error('Invalid main window reference');
    }

    // If no file path is provided, show save dialog
    if (!filePath) {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save File',
        defaultPath: path.join(app.getPath('documents'), 'untitled.txt'),
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      filePath = result.filePath;
    }

    // Write the content to the file
    await fs.promises.writeFile(filePath, content, 'utf8');
    return filePath;
  } catch (error) {
    console.error('Error saving file:', error instanceof Error ? error.message : 'Unknown error');
    if (mainWindow) {
      mainWindow.webContents.send('file-save-error', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

export {
  saveFile
}; 