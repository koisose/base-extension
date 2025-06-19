# Quick Notes Chrome Extension

A beautiful and modern Chrome extension for quick note-taking with a clean, intuitive interface.

## Features

- **Quick Note Creation**: Add notes instantly with a clean, focused interface
- **Real-time Search**: Find your notes quickly with instant search functionality
- **In-line Editing**: Edit notes directly in the popup with smooth transitions
- **Export Functionality**: Export all your notes as a text file
- **Persistent Storage**: All notes are saved locally and persist across browser sessions
- **Modern Design**: Beautiful glass-morphism design with smooth animations
- **Keyboard Shortcuts**: 
  - `Ctrl + Enter` to save a note
  - `Ctrl + Enter` to finish editing
  - `Escape` to cancel editing

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension folder
4. The Quick Notes icon should appear in your browser toolbar

## Usage

1. Click the Quick Notes icon in your browser toolbar
2. Type your note in the text area
3. Click "Add Note" or press `Ctrl + Enter` to save
4. Use the search box to quickly find specific notes
5. Hover over notes to reveal edit and delete options
6. Click the export button to download all notes as a text file

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage (for saving notes locally)
- **Storage**: Uses Chrome's local storage API
- **Design**: Modern CSS with backdrop-filter and smooth animations
- **Architecture**: Clean, modular JavaScript with ES6+ features

## Development

The extension is built with vanilla JavaScript, HTML, and CSS for maximum performance and minimal overhead. The code follows modern web development practices with:

- Clean separation of concerns
- Async/await for storage operations
- Event delegation for dynamic content
- Responsive design principles
- Accessibility considerations

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Main popup interface
- `popup.css` - Styling and animations
- `popup.js` - Core functionality and logic
- `background.js` - Background service worker
- `icons/` - Extension icons
- `README.md` - Documentation

## Browser Compatibility

This extension is built for Chrome (Chromium-based browsers) using Manifest V3, the latest extension platform.