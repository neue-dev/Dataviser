/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-11 16:30:23
 * @ Modified time: 2024-06-11 17:39:03
 * @ Description:
 */

/**
 * Our own API for interacting with the Pyodide worker.
 * This is adapated from an implementation I found online.
 * Note that I wrapped it around its own IIFE to enclose its data.
*/
export const ClientPyodide = (function() {
  
  // Create the worker from its URL
  const pyodideWorkerURL = new URL('./client.pyodide.worker.js', import.meta.url);
  const pyodideWorker = new Worker(pyodideWorkerURL);

  // The api object 
  const _ = {
    workerURL: pyodideWorkerURL,
    worker: pyodideWorker,
    processes: {},
    processId: 0,
  };

  /**
   * This primarily responds to the messages sent by the worker after executing a script.
   * 
   * @param   { event }   e   The event object. 
   */
  pyodideWorker.onmessage = e => {
  
    // Retrieve the data sent by the worker and the resolving callback
    const { id } = e.data;
    
    // The process already ended
    if(!_.processes[id])
      return;

    // Get the callbacks
    const { onResolve, onReject } = _.processes[id];
    
    // The process id done, so remove it
    delete _.processes[id];

    // Resolve or reject the promise
    if(e.error) return onReject(e.error);
    if(e.data) return onResolve(e.data);
  };

  /**
   * We create a method for dispatching processes to the worker.
   * These processes run Python scripts for us. 
   * 
   * @param   { string }    script    The Python script to run in the process.
   * @param   { object }    context   The variables and data we want to pass to the script.
   * @return  { Promise }             A promise for a complete execution of the script.
   */
  _._processDispatch = (script, context) => {

    // Increment the id each time
    const id = _.processId += _.processId + 1;
    
    // Return a promise for the resolution of the process
    return new Promise((resolve, reject) => {
      
      // The function to call when the process finishes
      // Basically, we resolve the promise we return so the caller can know it's done
      _.processes[id] = {
        onResolve: resolve,
        onReject: reject,
      };
      
      // We send a message to the worker to tell it to run the script.
      pyodideWorker.postMessage({
        message: 'process-dispatch',
        python: script,
        context, 
        id,
      });
    });
  }

  // ! to implement
  _.processSetContext = function() {

    // Sets the context of the environment
    pyodideWorker.postMessage({
      message: 'context-set',
      context, 
    });
  }

  _.processGetContext = function() {
    
  }
  
  /**
   * Wraps dispatch process around a try catch statement.
   * Also allows the user to do something after the process exits.
   * 
   * @param   { string }    script          The string literal representing the script. 
   * @param   { object }    context         The data we want to pass to the script.
   * @param   { function }  callback        The function we want to execute upon the end of the script.
   *                                        Note that we pass the result of the script to the callback.
   * @param   { function }  errorCallback   An optional parameter for handling errors.
   */
  _.processRun = async(script, context, callback, errorCallback) => {

    // Try the script
    try {
      const { results, error } = await _._processDispatch(script, context);

      // We got something back
      if (results)
        callback(results);

      // The script encountered an error
      else if (error)
        console.error("Python script error: ", error, script);
 
    // Something wrong happened with the JS
    } catch (e) {
      console.error(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`);
    }
  }

  // Ensures pyodide runs faster on subsequent calls
  _.processRun(`
    import pandas as pd
    print('Warm-up script...')
    print('Pyodide configured.')
    print(test)
  `, {
    test: 'hello?'
  }, e => e);
  
  return {
    ..._,
  }
})();

export default {
  ClientPyodide,
}