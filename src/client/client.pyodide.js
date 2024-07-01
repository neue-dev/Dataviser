/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-11 16:30:23
 * @ Modified time: 2024-07-02 04:53:11
 * @ Description:
 */

import { ClientPromise } from "./client.promise";

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
    const { resolveHandle, rejectHandle } = _processes[id];
    
    // The process id done, so remove it
    delete _processes[id];

    // Resolve or reject the promise
    if(e.error) return rejectHandle(e.error);
    if(e.data) return resolveHandle(e.data);
  };

  /**
   * Initiates a process.
   * 
   * @param   { string }  action  What type of process we're starting.
   * @param   { object }  args    The arguments we're passing to the process. 
   */
  const _processCreate = (action, args) => {

    // Increment the id each time
    const id = _processId++;

    // We send a message to the worker to tell it to run the script.
    _pyodideWorker.postMessage({
      action, id,
      ...args,
    });
    
    // Return a promise for the resolution of the process
    const { promise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // The function to call when the process finishes
    // Basically, we resolve the promise we return so the caller can know it's done
    _processes[id] = { resolveHandle, rejectHandle };

    return promise;
  }

  /**
   * We create a method for dispatching processes to the worker.
   * These processes run Python scripts for us. 
   * 
   * @param   { string }    script    The Python script to run in the process.
   * @return  { Promise }             A promise for a complete execution of the script.
   */
  _.processDispatch = (script) => {
    return _processCreate('process-dispatch', { script });
  }

  /**
   * Defines variables (context) within the Pyodide environment that hold our data.
   * 
   * @param   { object }  context   The data and their associated names. 
   * @return  { Promise }           A promise for a complete execution of the script.
   */
  _.processSetContext = function(context={}) {
    return _processCreate('context-set', { context });
  }
  
  /**
   * Wraps dispatch process around a try catch statement.
   * Also allows the user to do something after the process exits.
   * 
   * @param   { string }    script  The string literal representing the python script. 
   * @return  { Promise }           A promise for the execution of the script.
   */
  _.processRun = (script) => {

    // The output promise
    const { promise: outPromise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // Try the script
    try {

      // Create the promise
      _.processDispatch(script).then(output => {
        
        // Grab the details of the output
        const { results, error } = output;

        // We got something back
        if (results) {
          resolveHandle(results); 
          
        // The script encountered an error
        } else if (error) {
          
          // Logs the script that erred
          console.error("Python script error: ", error, script);

          // Reject the returned promise
          rejectHandle(error);
          
        // Results was probably undefined
        } else if(!results) {

          // Log that it returned nothing
          console.log('Python script executed and returned nothing.');
          resolveHandle('');
        }
      })
        
    // Something wrong happened with the JS
    } catch (e) {
      
      // Log the error
      console.error(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`);

      // Reject the returned promise
      rejectHandle(e.message);
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