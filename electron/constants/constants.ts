// Application constants
interface AppConfig {
  NAME: string;
  ID: string;
  CLOCK_SIZE: number;
}

const APP: AppConfig = {
  NAME: 'Chrono Clock',
  ID: 'com.electron.react-editor',
  CLOCK_SIZE: 1400
};

// Window sizes
interface WindowSize {
  WIDTH: number;
  HEIGHT: number;
}

interface WindowSizes {
  MAIN: WindowSize;
  IMAGE_FINDER: WindowSize;
  ABOUT: WindowSize;
}

const WINDOW_SIZES: WindowSizes = {
  MAIN: {
    WIDTH: 1400,
    HEIGHT: 900
  },
  IMAGE_FINDER: {
    WIDTH: 800,
    HEIGHT: 600
  },
  ABOUT: {
    WIDTH: 400,
    HEIGHT: 300
  }
};

// Supported image types
interface ImageConfig {
  SUPPORTED_EXTENSIONS: string[];
  MIME_TYPES: {
    [key: string]: string;
  };
}

const IMAGE: ImageConfig = {
  SUPPORTED_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
  MIME_TYPES: {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg'
  }
};

// IPC Channels
interface Channels {
  INCOMING: {
    THEME_CHANGE: string;
    CUSTOM_IMAGE_SELECTED: string;
    RESET_IMAGE: string;
    IMAGE_SELECTION_ERROR: string;
  };
  OUTGOING: {
    IMAGE_SELECTED: string;
    CLOSE_IMAGE_FINDER: string;
    SELECT_IMAGE: string;
    RESET_IMAGE: string;
  };
}

const CHANNELS: Channels = {
  INCOMING: {
    THEME_CHANGE: 'theme-change',
    CUSTOM_IMAGE_SELECTED: 'custom-image-selected',
    RESET_IMAGE: 'reset-image',
    IMAGE_SELECTION_ERROR: 'image-selection-error'
  },
  OUTGOING: {
    IMAGE_SELECTED: 'image-selected',
    CLOSE_IMAGE_FINDER: 'close-image-finder',
    SELECT_IMAGE: 'select-image',
    RESET_IMAGE: 'reset-image'
  }
};

// Theme options
const THEMES = ['Light', 'Dark'] as const;
type Theme = typeof THEMES[number];

export {
  APP,
  WINDOW_SIZES,
  IMAGE,
  CHANNELS,
  THEMES,
  type Theme
};
