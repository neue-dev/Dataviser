/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 21:53:19
 * @ Modified time: 2024-07-06 07:49:47
 * @ Description:
 * 
 * This file holds all the Python scripts our program will be running.
 */

import { ClientIPC } from './client.ipc'
import { ClientPyodide } from "./client.pyodide";
import { ClientStore } from './client.store.api';
import { ClientPromise } from './client.promise';

export const ClientPython = (function() {

  const _ = {};

  // Makes sure scripts only run after everything is initted
  const { 
    promise: _initPromise, 
    resolveHandle: _resolveHandle, 
    rejectHandle: _rejectHandle 
  } = ClientPromise.createPromise();

  /**
   * Requests scripts from the main process.
   * Returns the gathered scripts.
   * 
   * @return  { Promise }   A promise for the saved scripts.
   */
  const _scriptInit = function() {

    // Create the request and return the promise
    const promise = ClientIPC.requestSender('py', 'py/request-scripts')();
    const dispatch = ClientStore.storeDispatcher('py/pyScriptSave');

    // Dispatch the action to the store afterwards
    promise.then(scripts => dispatch({ scripts }))

    // Return 
    return promise;
  }

  /**
   * Requests for particular data from Pyodide.
   * Note that we do this by specifying the variable names of the data we want within Pyodide.
   * 
   * @param   { ...string }   variables   The names of the data we want from Pyodide. 
   * @return  { Promise }                 A promise for the requested data.
   */
  _.dataRequest = function(...variables) {

    // Create a script to return the data
    const string = variables.map(v => `'${v}': ${v}`).join(', ');
    const script = `
      import json

      out = {
        ${string}
      }

      print('PYTHON:', out)

      json.dumps(out)
    `;

    // Return a promise for the requested data
    // Convert the final data into a JS-readable object
    return _.scriptRun(script).then(data => JSON.parse(data));
  }

  /**
   * Defines the given variables in the Python namespace.
   * 
   * @param   { object }    data        The variables to define within the namespace.
   * @param   { boolean }   isInitting  Tells us that we're doing an init and shouldn't chain the promise to _initPromise.
   * @return  { Promise }               A promise for the completion of the action.
   */
  _.dataSend = function(data={}, isInitting) {

    // If we're doing the init, the just call it directly
    if(isInitting)
      return ClientPyodide.processSetContext(data)

    // Execute the script if init done
    return _initPromise.then(() => ClientPyodide.processSetContext(data));
  }

  /**
   * Runs a custom Python script.
   * 
   * @param   { string }    script      The script we want to execute.
   * @param   { boolean }   isInitting  Tells us that we're doing an init and shouldn't chain the promise to _initPromise.
   * @return  { Promise }               A promise for the execution of the script.
   */
  _.scriptRun = function(script, isInitting) {

    // If we're doing the init, the just call it directly
    if(isInitting)
      return ClientPyodide.processRun(script)
    
    // Execute the script if init done
    return _initPromise.then(() => ClientPyodide.processRun(script));
  }

  /**
   * Runs a particular file from the ones we have.
   * 
   * @param   { string }    filename    The name of the file to run. 
   * @param   { boolean }   isInitting  Tells us that we're doing an init and shouldn't chain the promise to _initPromise.
   * @return  { Promise }               A promise for the execution of the script. 
   */
  _.fileRun = function(filename, isInitting) {

    // Get the scripts from the store and run the 
    const scripts = ClientStore.select(state => state.py.scripts);
    const script = scripts[filename];

    // If we're doing the init, the just call it directly
    if(isInitting)
      return ClientPyodide.processRun(script)

    // Execute the script if init done
    return _initPromise.then(() => ClientPyodide.processRun(script));
  }

  // Load all the script files
  // This is the only time we set isInitting to true
  _scriptInit()
    .then(() => _.fileRun('df', true))
    .then(() => _.fileRun('df_filters', true))
    .then(() => _.fileRun('df_transformers', true))
    .then(() => _resolveHandle())

  return {
    ..._,
  }
})();

