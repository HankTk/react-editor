import { app } from 'electron';
import fs from 'fs';
import path from 'path';

interface AppState {
  editorContent: string;
  editorLanguage: string;
  currentFilePath: string | null;
  splitMode: 'horizontal' | 'vertical';
  isDarkMode: boolean;
}

const STATE_FILE = 'app-state.json';

function getStateFilePath(): string {
  return path.join(app.getPath('userData'), STATE_FILE);
}

export async function saveAppState(state: AppState): Promise<void> {
  try {
    const statePath = getStateFilePath();
    const stateDir = path.dirname(statePath);
    
    // Ensure the directory exists
    if (!fs.existsSync(stateDir)) {
      await fs.promises.mkdir(stateDir, { recursive: true });
    }
    
    // Write the state file
    await fs.promises.writeFile(statePath, JSON.stringify(state, null, 2), 'utf8');
    console.log('State saved successfully to:', statePath);
  } catch (error) {
    console.error('Error saving app state:', error);
    throw error; // Propagate error to handle it in the renderer
  }
}

export async function loadAppState(): Promise<AppState | null> {
  try {
    const statePath = getStateFilePath();
    if (fs.existsSync(statePath)) {
      const data = await fs.promises.readFile(statePath, 'utf8');
      const state = JSON.parse(data);
      console.log('State loaded successfully from:', statePath);
      return state;
    }
    console.log('No saved state found at:', statePath);
  } catch (error) {
    console.error('Error loading app state:', error);
    // If there's an error reading the state file, try to remove it
    try {
      const statePath = getStateFilePath();
      if (fs.existsSync(statePath)) {
        await fs.promises.unlink(statePath);
        console.log('Removed corrupted state file');
      }
    } catch (cleanupError) {
      console.error('Error cleaning up corrupted state file:', cleanupError);
    }
  }
  return null;
} 