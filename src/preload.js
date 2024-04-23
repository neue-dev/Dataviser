const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fileManager', {
  openFolder: folder => ipcRenderer.send('open-folder', folder)
})