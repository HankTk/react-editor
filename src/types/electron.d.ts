export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, listener: (...args: any[]) => void) => void;
        removeListener: (channel: string, listener: (...args: any[]) => void) => void;
        send: (channel: string, data: any) => void;
        resetImage: () => void;
        saveFile: (content: string, filePath?: string) => Promise<string | null>;
      };
    };
  }
} 