import { Menu, screen, dialog, MenuItemConstructorOptions, BrowserWindow, ipcMain } from 'electron';
import { IMAGE } from '../constants/constants';
import { getMainWindow } from '../windows/mainWindow';
import { createAboutWindow } from '../windows/aboutWindow';
import { handleImageSelection } from '../handlers/imageHandler';

// Theme options
const THEMES = ['Light', 'Dark'] as const;
type Theme = typeof THEMES[number];

let currentSplitMode = 'horizontal';

function createApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send('new-file');
            }
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send('open-file');
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send('save-file');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Theme',
          submenu: createThemeSubmenu()
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Alt+F4',
          click: () => require('electron').app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      id: 'view-menu',
      submenu: createViewSubmenu()
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: createAboutWindow
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

const createThemeSubmenu = (): MenuItemConstructorOptions[] => {
  return THEMES.map(theme => ({
    label: theme,
    type: 'radio' as const,
    checked: false,
    click: () => {
      const mainWindow = BrowserWindow.getFocusedWindow();
      if (mainWindow) {
        mainWindow.webContents.send('theme-change', theme);
      }
    }
  }));
};

function createViewSubmenu(): MenuItemConstructorOptions[] {
  const baseItems: MenuItemConstructorOptions[] = [
    { type: 'separator' },
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ];

  return process.env.NODE_ENV === 'development' ? [
    { role: 'reload' },
    { role: 'forceReload' },
    { role: 'toggleDevTools' },
    { type: 'separator' },
    ...baseItems
  ] : baseItems;
}

// Initialize menu with default state
createApplicationMenu();

export {
  createApplicationMenu
}; 