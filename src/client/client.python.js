/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 21:53:19
 * @ Modified time: 2024-07-05 05:43:01
 * @ Description:
 * 
 * This file holds all the Python scripts our program will be running.
 */

import { ClientIPC } from './client.ipc'
import { ClientPyodide } from "./client.pyodide";
import { ClientStore } from './client.store.api';

export const ClientPython = (function() {

  const _ = {};

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
   * @param   { object }  data  The variables to define within the namespace.
   * @return  { Promise }       A promise for the completion of the action.
   */
  _.dataSend = function(data={}) {
    return ClientPyodide.processSetContext(data);
  }

  /**
   * Runs a custom Python script.
   * 
   * @param   { string }    script  The script we want to execute.
   * @return  { Promise }           A promise for the execution of the script.
   */
  _.scriptRun = function(script) {
    return ClientPyodide.processRun(script);
  }

  /**
   * Runs a particular file from the ones we have.
   * 
   * @param   { string }    filename    The name of the file to run. 
   * @return  { Promise }               A promise for the execution of the script. 
   */
  _.fileRun = function(filename) {

    // Get the scripts from the store and run the 
    const scripts = ClientStore.select(state => state.py.scripts);
    const script = scripts[filename];

    // Execute the script
    return ClientPyodide.processRun(script);
  }

  // Load all the script files
  _scriptInit()
    .then(result => _.fileRun('df'))
    .then(result => _.fileRun('df_filters'))
    .then(result => console.log(result));

  return {
    ..._,
  }
})();

