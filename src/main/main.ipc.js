/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:07:28
 * @ Modified time: 2024-06-30 03:11:13
 * @ Description:
 * 
 * This file contains the IPC handlers for the main process.
 */

// Modules
const { ipcMain } = require('electron'); 

/**
 * The IPC object helps us modularize all the functionality dealing with IPC.
 */
export const IPC = (function() {

  const _ = {};

  // The IPC Monad
  const _IPC = (config) => {
    return {
      
      /**
       * Calls the given function on the IPC.
       * 
       * @param   { function }  f   The function to call on the IPC. 
       */
      map: (f) => {

        // Invalid config object
        if(!config)
          return _IPC(null);

        // It's not yet initted
        if(!config.isInitted)
          return;
        
        // Otherwise, proceed to execute the function
        return _IPC(f(config));
      }  
    }
  }

  // The current IPC object we're using
  let _ipc = _IPC({ mainWindow: null, isInitted: false, callbacks: {} });

  /**
   * Creates a function that initializes the IPC with the given window.
   * 
   * @param     { Window }  mainWindow  The window to provide to the IPC. 
   * @returns   { _IPC }                The initted _IPC object.
   */
  _.init = function(mainWindow) {
    _ipc = _IPC({ mainWindow, isInitted: true, callbacks: {} });
  }

  /**
   * Returns the current IPC.
   * 
   * @return  { _IPC }  The current instance of the ipc object.
   */
  _.get = function() {
    return _ipc;
  }

  /**
   * Sets the current IPC to the one provided.
   * 
   * @param   { _IPC }  ipc   The new ipc to use.
   * @return  { _IPC }        The new value of the ipc.
   */
  _.set = function(ipc) {
    return _ipc = ipc;
  }
  
  /**
   * Registers an event listener we need the main process to listen to.
   * 
   * @param   { string }    event   The event we want to listen to.
   * @return  { function }          A function we call on the IPC object to implement the listener.
   */
  _.eventRegisterer = function(event) {
    return function(config) {

      // Create a slot for the callbacks of that event
      config.callbacks[event] = [];
      
      // Create the event listener
      ipcMain.handle(event, async (e, ...args) => {

        // The result to output
        const results = [];

        // Execute each of the saved callbacks
        config.callbacks[event].forEach(callback => {
          results.push(callback(e, ...args));
        })

        return results;
      });  
      
      // Return the config object
      return config;
    }
  }

  /**
   * Subscribes the given function to the given listener.
   * 
   * @param   { string }    event     The event we want to subscribe to.
   * @param   { function }  callback  The callback we want to execute during this event.
   * @return  { function }            A function that registers the callback.  
   */
  _.eventSubscriber = function(event, callback) {
    return function(config) {
      
      // Register the callback
      config.callbacks[event].push(callback);

      // Return the config object
      return config;
    }
  }
  
  return {
    ..._,
  }
})();

export default IPC;
