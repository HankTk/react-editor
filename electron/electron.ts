import { app, protocol, BrowserWindow } from 'electron';
import { createMainWindow, loadMainWindowContent } from './windows/mainWindow';
import { createApplicationMenu } from './menu/menuBuilder';
import { setupIpcHandlers } from './handlers/ipcHandlers';

// Debug logging
function logDebugInfo(): void {
  console.log('Starting application...');
  console.log('Current directory:', __dirname);
  console.log('App path:', app.getAppPath());
  console.log('Process type:', process.type);
  console.log('Process platform:', process.platform);
  console.log('Process arch:', process.arch);
}

// App lifecycle handlers
app.whenReady().then(() => {
  logDebugInfo();
  
  // Register custom protocol for loading local images
  protocol.handle('local-image', async (request) => {
    const url = request.url.replace('local-image://', '');
    try {
      return new Response(null, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error loading local image:', error);
      return new Response(null, {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  });

  // Initialize application
  createMainWindow();
  loadMainWindowContent();
  createApplicationMenu();
  setupIpcHandlers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
}); 