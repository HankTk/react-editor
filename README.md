# React Editor

A modern desktop editor application built with React and Electron, featuring a sleek and customizable interface.

## Features

- Rich text editing capabilities
- Customizable themes and styles
  - Light and dark mode support
  - Custom color schemes
  - Font size and family options
- Always-on-top window option
- System tray integration with quick actions
- Cross-platform support (Windows, macOS, Linux)
- Modern UI using React and TypeScript
- Desktop application using Electron
- Low CPU usage and memory footprint
- File management and auto-save functionality

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/hidenori/react-editor.git
cd react-editor

# Install dependencies
npm install
```

## Usage

### Development Mode

```bash
# Start development server
npm start
```

### Electron Application Development

```bash
# Start Electron application in development mode
npm run electron-dev
```

### Icon Generation

```bash
# Convert SVG icon to PNG format
svgexport assets/icon.svg assets/icon.png 1024:1024
```

### Build

```bash
# Create production build
npm run build
```

### Electron Application Packaging

```bash
# Package Electron application
npm run electron-pack
```

## Project Structure

```
react-editor/
├── assets/         # Static assets and icons
│   ├── icon.svg    # Application icon in SVG format
│   └── icon.png    # Application icon in PNG format
│
├── build/          # Build output directory
│   ├── index.html  # Generated HTML file
│   ├── static/     # Compiled static assets
│   └── assets/     # Copied static files
│
├── documents/      # Documentation and screenshots
│   └── screenshots/ # Application screenshots
│
├── electron/       # Electron-specific code
│   ├── electron.ts # Main process file for window and app management
│   ├── tsconfig.json # TypeScript configuration for Electron
│   │
│   ├── constants/  # Application constants and configurations
│   │   └── constants.ts # Application-wide constants and settings
│   │
│   ├── dialogs/    # Dialog window implementations
│   │   └── about.html # About dialog window template
│   │
│   ├── handlers/   # Event handlers and IPC implementations
│   │   ├── fileHandler.ts # File processing handlers
│   │   ├── fileHandler.d.ts # Type definitions for file handlers
│   │   └── ipcHandlers.ts # IPC event handlers
│   │
│   ├── menu/       # Application menu configurations
│   │   └── menuBuilder.ts # Menu builder and configuration
│   │
│   ├── preload/    # Preload scripts for secure IPC communication
│   │   └── preload.ts # Preload script for secure IPC
│   │
│   └── windows/    # Window management and configurations
│       ├── mainWindow.ts # Main window implementation
│       ├── aboutWindow.ts # About window implementation
│       └── aboutWindow.d.ts # Type definitions for about window
│
├── public/         # Static files
│   ├── index.html  # Main HTML file
│   ├── manifest.json # Web app manifest
│   └── assets/     # Public assets (favicon, etc.)
│
├── src/           # Source code
│   ├── components/ # React components
│   │   ├── Editor/  # Editor component
│   │   ├── Theme/  # Theme related components
│   │   └── common/ # Shared components
│   │
│   ├── styles/    # CSS and styling files
│   │   ├── themes/ # Theme definitions
│   │   └── global/ # Global styles
│   │
│   ├── utils/     # Utility functions
│   │   ├── editor.ts # Editor-related utilities
│   │   └── theme.ts # Theme utilities
│   │
│   ├── App.tsx    # Main application component
│   ├── index.tsx  # Application entry point
│   └── types.ts   # TypeScript type definitions
│
├── .gitignore     # Git ignore file
├── package.json   # Project dependencies and scripts
└── tsconfig.json  # TypeScript configuration
```

### Key Directories and Files

- **assets/**: Contains application icons and other static assets. The SVG icon can be converted to PNG format using the Icon Generation command.

- **electron/**: Contains Electron-specific code that runs in the main process.
  - `electron.ts`: The main process file that initializes the Electron application
  - `constants/`: Application-wide constants and configuration values
    - `constants.ts`: Defines application settings, window configurations, and other constants
  - `dialogs/`: Dialog window implementations
    - `about.html`: Template for the about dialog window
  - `handlers/`: Event handlers and IPC implementations
    - `fileHandler.ts`: Handles file operations and processing
    - `ipcHandlers.ts`: Manages IPC communication between main and renderer processes
  - `menu/`: Application menu configurations
    - `menuBuilder.ts`: Builds and configures the application menu structure
  - `preload/`: Security-focused scripts
    - `preload.ts`: Provides secure communication between renderer and main processes
  - `windows/`: Window management and configurations
    - `mainWindow.ts`: Implements the main application window
    - `aboutWindow.ts`: Implements the about window functionality

- **src/**: Contains the main application source code.
  - `components/`: React components organized by feature
  - `styles/`: CSS modules and theme definitions
  - `utils/`: Helper functions and utilities
  - `App.tsx`: Root component that manages the application state
  - `index.tsx`: Entry point that renders the React application

- **public/**: Contains static files that are served as-is.
  - `index.html`: The HTML template for the application
  - `manifest.json`: Web app manifest for PWA support

- **build/**: Contains the production build output, generated by `npm run build`

- **documents/**: Contains project documentation and screenshots

## Tech Stack

- React 18
- TypeScript 4.9+
- Electron 28+
- Create React App
- CSS Modules for styling
- React Context for state management
- Electron Builder for packaging
- Jest and React Testing Library for testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the React and Electron communities for their excellent documentation and support
- Inspired by various modern text editors
- Icons and assets from [IconBu](https://iconbu.com/)

## Screenshots

![React Editor Screenshot](./documents/screenshots/main.png)
