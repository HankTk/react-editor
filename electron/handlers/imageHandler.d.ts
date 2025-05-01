import { BrowserWindow } from 'electron';

export function imageToBase64(filePath: string): string | null;
export function handleImageSelection(mainWindow: BrowserWindow, filePath: string): void;
export const SUPPORTED_EXTENSIONS: string[]; 