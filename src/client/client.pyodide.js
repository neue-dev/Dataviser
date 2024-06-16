/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-11 16:30:23
 * @ Modified time: 2024-06-17 01:15:22
 * @ Description:
 */

/**
 * Our own API for interacting with the Pyodide worker.
 * This is adapated from an implementation I found online.
 * Note that I wrapped it around its own IIFE to enclose its data.
*/
export const ClientPyodide = (function() {
  
  // Create the worker from its URL
  const _pyodideWorkerURL = new URL('./client.pyodide.worker.js', import.meta.url);
  const _pyodideWorker = new Worker(_pyodideWorkerURL);

  // The api object 
  const _ = {};
  let _processId = 0;
  let _processes = {};
  let _workerURL = _pyodideWorkerURL;
  let _worker = _pyodideWorker;

  /**
   * This primarily responds to the messages sent by the worker after executing a script.
   * 
   * @param   { event }   e   The event object. 
   */
  _pyodideWorker.onmessage = e => {
  
    // Retrieve the data sent by the worker and the resolving callback
    const { id } = e.data;
    
    // The process already ended
    if(!_processes[id])
      return;

    // Get the callbacks
    const { onResolve, onReject } = _processes[id];
    
    // The process id done, so remove it
    delete _processes[id];

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
    const id = _processId++;

    // We send a message to the worker to tell it to run the script.
    _pyodideWorker.postMessage({
      message: 'process-dispatch',
      python: script,
      context: context,
      id: id,
    });
    
    // Return a promise for the resolution of the process
    const promise = new Promise((resolve, reject) => {
      
      // The function to call when the process finishes
      // Basically, we resolve the promise we return so the caller can know it's done
      _processes[id] = {
        onResolve: resolve,
        onReject: reject,
      };
    });

    return promise;
  }

  /**
   * Defines variables (context) within the Pyodide environment that hold our data.
   * 
   * @param   { object }  context   The data and their associated names. 
   */
  _.processSetContext = function(context={}) {

    // Sets the context of the environment
    _pyodideWorker.postMessage({
      message: 'context-set',
      context, 
    });
  }
  
  /**
   * Wraps dispatch process around a try catch statement.
   * Also allows the user to do something after the process exits.
   * 
   * @param   { string }    script          The string literal representing the script. 
   * @param   { object }    context         The data we want to pass to the script.
   * @param   { function }  callback        The function we want to execute upon the end of the script.
   *                                            Note that we pass the result of the script to the callback.
   * @param   { function }  errorCallback   An optional parameter for handling errors.
   */
  _.processRun = async(script, context, callback=d=>d) => {

    // The output promise
    let onResolve;
    let onReject;
    const outPromise = new Promise((resolve, reject) => {
      onResolve = resolve;
      onReject = reject;
    });

    // Try the script
    try {

      // Create the promise
      const promise = _._processDispatch(script, context);

      // Wait for the promise
      promise.then(output => {
        
        // Grab the details of the output
        const { results, error } = output;

        // We got something back
        if (results) {
          onResolve(callback(results)); 
          
        // The script encountered an error
        } else if (error) {
          console.error("Python script error: ", error, script);
          onReject(error);
          
        // Results was probably undefined
        } else if(!results) {
          console.log('Python script executed and returned nothing.');
          onResolve();
        }
      })
        
    // Something wrong happened with the JS
    } catch (e) {
      console.error(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`);

      // Reject the returned promise
      onReject(e);
    }

    // Return the promise
    return outPromise;
  }

  // Ensures pyodide runs faster on subsequent calls
  _.processRun(`
    import pandas as pd
    print('Warm-up script...')
    print('Pyodide configured.')
  `, { }, e => e);
  
  return {
    ..._,
  }
})();

export default {
  ClientPyodide,
}