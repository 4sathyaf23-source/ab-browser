const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch').default;

// Look like regular Chrome (helps Google sign-in and some sites)
app.userAgentFallback =
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

const SHORTCUT_KEYS = ['t', 'w', 'l'];
const ALLOWED_PERMISSIONS = ['fullscreen', 'clipboard-sanitized-write'];

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  // Ad blocker on the main session; don't crash if filter lists fail to download
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
    .then((blocker) => blocker.enableBlockingInSession(win.webContents.session))
    .catch((err) => console.error('Adblock failed to load:', err));

  win.loadFile('index.html');
}

app.on('web-contents-created', (event, contents) => {
  // Deny camera / mic / location etc. by default
  contents.session.setPermissionRequestHandler((wc, permission, callback) => {
    callback(ALLOWED_PERMISSIONS.includes(permission));
  });

  if (contents.getType() === 'webview') {
    // Open popups / target=_blank links as new tabs
    contents.setWindowOpenHandler(({ url }) => {
      if (contents.hostWebContents) {
        contents.hostWebContents.send('open-url', url);
      }
      return { action: 'deny' };
    });

    // Make Ctrl+T / Ctrl+W / Ctrl+L work even when a page has focus
    contents.on('before-input-event', (e, input) => {
      if (
        input.type === 'keyDown' &&
        input.control &&
        !input.alt &&
        !input.shift &&
        SHORTCUT_KEYS.includes(input.key.toLowerCase())
      ) {
        e.preventDefault();
        if (contents.hostWebContents) {
          contents.hostWebContents.send('shortcut', input.key.toLowerCase());
        }
      }
    });
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
