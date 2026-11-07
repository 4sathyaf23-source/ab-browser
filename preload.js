const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ab', {
  onOpenUrl: (callback) => {
    ipcRenderer.on('open-url', (_event, url) => callback(url));
  },
  onShortcut: (callback) => {
    ipcRenderer.on('shortcut', (_event, key) => callback(key));
  }
});
