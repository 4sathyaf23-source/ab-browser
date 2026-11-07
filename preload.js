const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ab', {
  onOpenUrl: (callback) => {
    ipcRenderer.on('open-url', (_event, url) => callback(url));
  }
});
