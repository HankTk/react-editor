import { BrowserWindow, dialog, app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * Handles opening a file from disk
 * @param mainWindow - The main application window
 * @returns Promise that resolves to the file content and path, or null if cancelled/error
 */
async function openFile(mainWindow: BrowserWindow): Promise<{ content: string; filePath: string } | null> {
  try {
    if (!mainWindow) {
      console.error('Main process: Invalid main window reference');
      throw new Error('Invalid main window reference');
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Open File',
      properties: ['openFile'],
      filters: [
        { name: 'Text Files', extensions: ['txt', 'md', 'mmd', 'mermaid', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled || !result.filePaths.length) {
      return null;
    }

    const filePath = result.filePaths[0];
    const content = await fs.promises.readFile(filePath, 'utf8');
    return { content, filePath };
  } catch (error) {
    console.error('Main process: Error opening file:', error instanceof Error ? error.message : 'Unknown error');
    if (mainWindow) {
      mainWindow.webContents.send('file-open-error', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

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
      console.error('Main process: Invalid main window reference');
      throw new Error('Invalid main window reference');
    }

    let finalFilePath: string | null = filePath || null;

    if (!finalFilePath || finalFilePath === '' || 
        path.basename(finalFilePath) === 'untitled' || path.basename(finalFilePath) === 'untitled.txt') {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save File',
        defaultPath: path.join(app.getPath('documents'), 'untitled'),
        filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'Text Files', extensions: ['txt'] }
        ],
        properties: ['showOverwriteConfirmation']
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      finalFilePath = result.filePath;
      if (!path.extname(finalFilePath)) {
        finalFilePath = `${finalFilePath}.txt`;
      }
    }

    if (!finalFilePath) {
      throw new Error('No valid file path provided');
    }

    await fs.promises.writeFile(finalFilePath, content, 'utf8');
    mainWindow.webContents.send('file-saved', finalFilePath);
    
    return finalFilePath;
  } catch (error) {
    console.error('Main process: Error saving file:', error instanceof Error ? error.message : 'Unknown error');
    if (mainWindow) {
      mainWindow.webContents.send('file-save-error', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

export {
  openFile,
  saveFile
}; 