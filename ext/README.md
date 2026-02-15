# Chrome Extension

A Chrome extension built with Manifest V3.

## Project Structure

```
ext/
├── manifest.json          # Extension configuration
├── popup/                 # Popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── background/            # Background service worker
│   └── background.js
├── content/               # Content scripts
│   ├── content.js
│   └── content.css
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Features

- **Popup UI**: Interactive popup when clicking the extension icon
- **Background Service Worker**: Handles background tasks and events
- **Content Scripts**: Inject JavaScript and CSS into web pages
- **Chrome Storage API**: Store and retrieve data
- **Message Passing**: Communication between popup, background, and content scripts

## Development

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the extension directory (`ext/`)

## Testing

After loading the extension:
- Click the extension icon to open the popup
- Click the button to send a message to the content script
- Check the console logs in:
  - Popup: Right-click popup → Inspect
  - Background: Extensions page → Details → Inspect views: service worker
  - Content: Regular page console (F12)

## Permissions

- `storage`: Access to chrome.storage API
- `activeTab`: Access to the currently active tab

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
