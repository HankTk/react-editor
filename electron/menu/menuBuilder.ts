import { Menu, screen, dialog, MenuItemConstructorOptions } from 'electron';
import { THEMES, IMAGE } from '../constants/constants';
import { getMainWindow } from '../windows/mainWindow';
import { createAboutWindow } from '../windows/aboutWindow';
import { handleImageSelection } from '../handlers/imageHandler';

function createApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Select Clock Image',
          click: () => {
            const mainWindow = getMainWindow();
            if (!mainWindow) return;

            const primaryDisplay = screen.getPrimaryDisplay();
            const { width: screenWidth, height: screenHeight } = primaryDisplay.size;

            // Calculate dialog dimensions
            const dialogWidth = 800;
            const dialogHeight = 600;

            // Calculate center position relative to screen
            const x = Math.floor((screenWidth - dialogWidth) / 2);
            const y = Math.floor((screenHeight - dialogHeight) / 2);

            dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [
                { name: 'Images', extensions: IMAGE.SUPPORTED_EXTENSIONS.map(ext => ext.slice(1)) }
              ],
              defaultPath: mainWindow.getTitle(),
              buttonLabel: 'Select',
              title: 'Select Clock Image'
            }).then(result => {
              if (!result.canceled && result.filePaths.length > 0) {
                handleImageSelection(mainWindow, result.filePaths[0]);
              }
            }).catch(err => {
              console.error('Error selecting image:', err);
            });
          }
        },
        {
          label: 'Reset Image',
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send('reset-image');
            }
          }
        },
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

function createThemeSubmenu(): MenuItemConstructorOptions[] {
  return THEMES.map(theme => ({
    label: theme,
    click: () => {
      const mainWindow = getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('theme-change', theme);
      }
    }
  }));
}

function createViewSubmenu(): MenuItemConstructorOptions[] {
  const baseItems: MenuItemConstructorOptions[] = [
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

export {
  createApplicationMenu
}; 