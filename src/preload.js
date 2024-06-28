const { ipcRenderer } = require('electron')

const PRELOADER = (function() {

  const _ = {};

  /**
   * Resolves a IPC invocation to the caller.
   * 
   * @param   { string }  host      The name of the host.
   * @param   { object }  message   The type of message.
   * @param   { result }  result    The result of the invocation.
   */
  _.respond = function(host, message, result) {

    // Send it back to the host
    window.postMessage({
      host: 'preloader',    // So we don't have the preloader respond to its own event
      target: host,         // So the host can listen for the event
      message: message,     // The actual response
      result: result,
    });
  }

  /**
   * Create the event listeners once the preloader has loaded.
   */
  process.once('loaded', () => {

    // When a window message is sent
    // Relays the same message to the main process
    // The host is the caller and receives the response of the invocation
    window.addEventListener('message', e => {

      // Parse the message contents
      const message = e.data?.message ?? '-';
      const args = e.data?.args ?? [];
      const source = e.data?.source ?? '';
      const host = e.data?.host ?? ''; 

      // Invalid event
      if(message == '-')
        return console.error('Invalid message.');

      // The IPC won't know who to give the result to
      if(host == '')
        return console.error('No return host provided.');

      // So we don't listen to our own events
      if(host == 'preloader')
        return;

      // Send a message to invoke the main process
      ipcRenderer.invoke(message, ...args)
        .then(result => _.respond(host, message, result));
    })
  })

  return {
    ..._,
  }
})();

// ! remove
ipcRenderer.invoke('test')
  .then(result => console.log(result));