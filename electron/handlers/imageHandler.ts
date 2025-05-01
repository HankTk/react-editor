import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';

// Constants
const SUPPORTED_EXTENSIONS: string[] = ['.png', '.jpg', '.jpeg'];
const MIME_TYPES: { [key: string]: string } = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

/**
 * Converts an image file to base64 data URL
 * @param filePath - Path to the image file
 * @returns Base64 data URL or null if conversion fails
 */
function imageToBase64(filePath: string): string | null {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      throw new Error(`Unsupported file extension: ${ext}`);
    }

    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = MIME_TYPES[ext];
    
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting image to base64:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Handles image selection and sends the image data to the renderer process
 * @param mainWindow - The main application window
 * @param filePath - Path to the selected image file
 */
function handleImageSelection(mainWindow: BrowserWindow, filePath: string): void {
  try {
    if (!mainWindow || !mainWindow.webContents) {
      throw new Error('Invalid main window reference');
    }

    const dataUrl = imageToBase64(filePath);
    if (!dataUrl) {
      throw new Error('Failed to convert image to base64');
    }

    mainWindow.webContents.send('custom-image-selected', dataUrl);
  } catch (error) {
    console.error('Error handling image selection:', error instanceof Error ? error.message : 'Unknown error');
    // Optionally notify the user about the error
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('image-selection-error', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export {
  imageToBase64,
  handleImageSelection,
  SUPPORTED_EXTENSIONS
}; 