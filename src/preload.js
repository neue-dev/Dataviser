const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  unpickle: async (data, callback) => {
    ipcRenderer
      .invoke('unpickle', data)
      .then(() => { callback() });

    return true;
  },
})