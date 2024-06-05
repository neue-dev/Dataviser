const { ipcRenderer } = require('electron')

/**
 * Create the event listeners once the preloader has loaded.
 */
process.once('loaded', () => {

  // When a window message is sent
  // Relays the same message to the main process
  window.addEventListener('message', e => {
    const message = e.data.message ?? '-';
    const args = e.data.args ?? [];

    console.log(message)
    console.log(e.data.message);

    // Send a message to invoke the main process
    ipcRenderer.invoke(message, ...args);
  })
})