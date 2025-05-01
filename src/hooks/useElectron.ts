import { useCallback } from 'react';

interface ElectronAPI {
  ipcRenderer: {
    on: (channel: string, listener: (...args: any[]) => void) => void;
    removeListener: (channel: string, listener: (...args: any[]) => void) => void;
    send: (channel: string, data: any) => void;
    resetImage: () => void;
    saveFile: (content: string, filePath?: string) => Promise<string | null>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export function useElectron() {
  const saveFile = useCallback(async (content: string, filePath?: string) => {
    if (!window.electron?.ipcRenderer?.saveFile) {
      throw new Error('Electron API not available');
    }
    return await window.electron.ipcRenderer.saveFile(content, filePath);
  }, []);

  const resetImage = useCallback(() => {
    if (!window.electron?.ipcRenderer?.resetImage) {
      throw new Error('Electron API not available');
    }
    window.electron.ipcRenderer.resetImage();
  }, []);

  return {
    saveFile,
    resetImage
  };
} 