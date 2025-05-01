import { contextBridge, ipcRenderer } from 'electron';

// Constants for IPC channels
interface Channels {
  INCOMING: {
    THEME_CHANGE: string;
    CUSTOM_IMAGE_SELECTED: string;
    RESET_IMAGE: string;
    IMAGE_SELECTION_ERROR: string;
    FILE_SAVE_ERROR: string;
  };
  OUTGOING: {
    RESET_IMAGE: string;
    SAVE_FILE: string;
  };
}

const CHANNELS: Channels = {
  INCOMING: {
    THEME_CHANGE: 'theme-change',
    CUSTOM_IMAGE_SELECTED: 'custom-image-selected',
    RESET_IMAGE: 'reset-image',
    IMAGE_SELECTION_ERROR: 'image-selection-error',
    FILE_SAVE_ERROR: 'file-save-error'
  },
  OUTGOING: {
    RESET_IMAGE: 'reset-image',
    SAVE_FILE: 'save-file'
  }
};

/**
 * Validates if a channel is in the allowed list
 * @param channel - The channel to validate
 * @param allowedChannels - List of allowed channels
 * @returns Whether the channel is allowed
 */
const isValidChannel = (channel: string, allowedChannels: string[]): boolean => {
  return allowedChannels.includes(channel);
};

// Define the type for the exposed electron API
interface ElectronAPI {
  ipcRenderer: {
    on: (channel: string, listener: (...args: any[]) => void) => void;
    removeListener: (channel: string, listener: (...args: any[]) => void) => void;
    send: (channel: string, data: any) => void;
    resetImage: () => void;
    saveFile: (content: string, filePath?: string) => Promise<string | null>;
  };
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      on: (channel: string, listener: (...args: any[]) => void) => {
        if (isValidChannel(channel, Object.values(CHANNELS.INCOMING))) {
          ipcRenderer.on(channel, listener);
        } else {
          console.warn(`Attempted to listen to unauthorized channel: ${channel}`);
        }
      },
      removeListener: (channel: string, listener: (...args: any[]) => void) => {
        if (isValidChannel(channel, Object.values(CHANNELS.INCOMING))) {
          ipcRenderer.removeListener(channel, listener);
        } else {
          console.warn(`Attempted to remove listener from unauthorized channel: ${channel}`);
        }
      },
      send: (channel: string, data: any) => {
        if (isValidChannel(channel, Object.values(CHANNELS.OUTGOING))) {
          ipcRenderer.send(channel, data);
        } else {
          console.warn(`Attempted to send to unauthorized channel: ${channel}`);
        }
      },
      resetImage: () => {
        ipcRenderer.send(CHANNELS.OUTGOING.RESET_IMAGE);
      },
      saveFile: async (content: string, filePath?: string) => {
        return await ipcRenderer.invoke(CHANNELS.OUTGOING.SAVE_FILE, content, filePath);
      }
    }
  } as ElectronAPI
); 