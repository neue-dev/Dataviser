const { ipcRenderer } = require('electron')

const PRELOADER = (function() {

  const _ = {};

  /**
   * Resolves a IPC invocation to the caller.
   * 
   * @param   { string }  source    The name of the host.
   * @param   { object }  action    The type of action.
   */
  _.responseSender = function(source, action) {
    return function(result) {
      
      // Send it back to the host
      window.postMessage({
        source: 'preloader',  // So we don't have the preloader respond to its own event
        target: source,       // So the host can listen for the event
        action: action,       // The actual response
        result: result,
      });
    }
  }

  /**
   * Create the event listeners once the preloader has loaded.
   * The event listener here listen for requests from the client.
   * It then relays those requests to the main process, which it wait for.
   * The resulting response is forwarded back to the client.
   */
  process.once('loaded', () => {
    window.addEventListener('message', e => {

      // Parse the message contents
      const data = e.data;
      const { source, target, action, args } = data;

      // Invalid event
      if(!action)
        return console.error('Invalid action.');

      // The IPC won't know who to give the result to
      if(!source)
        return console.error('No return host provided.');

      // So we don't listen to our own events
      if(source == 'preloader')
        return;

      // It's not intended for us
      if(target != 'preloader')
        return;

      // Args must not be undefined
      if(!args)
        args = [];

      // Wrap the invocation around a promise to make sure it's always thenable
      Promise.resolve(ipcRenderer.invoke(action, ...args))
        .then(_.responseSender(source, action));
    })
  })

  return {
    ..._,
  }
})();
