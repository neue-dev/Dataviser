/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 21:53:19
 * @ Modified time: 2024-07-01 17:46:06
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
    promise.then(scripts => dispatch(scripts))

    // Return 
    return promise;
  }

  /**
   * Requests for particular data from Pyodide.
   * Note that we do this by specifying the variable names of the data we want within Pyodide.
   * 
   * @param   { object }    data  The names of the data we want from Pyodide. 
   * @return  { Promise }         A promise for the requested data.
   */
  _.dataRequest = function(data=[]) {

    // Create a script to return the data
    const string = data.map(key => `'${key}': ${key}`).join(',\n');
    const script = `
      out = {
        ${string}
      }

      print(out)

      json.dumps(out)
    `;

    // Return a promise for the requested data
    // Convert the final data into a JS-readable object
    return _.scriptRun(script, data => JSON.parse(data));
  }

  /**
   * Defines the given variables in the Python namespace.
   * 
   * @param   { object }  data  The variables to define within the namespace.
   */
  _.dataSend = function(data={}) {
    ClientPyodide.processSetContext(data);
  }

  /**
   * Runs a custom Python script.
   * 
   * @param   { string }    scriptName  The name of the script to run. 
   * @param   { function }  callback    An optional callback to deal with the data.
   * @return  { Promise }               A promise for the execution of the script. 
   */
  _.scriptRun = function(scriptName, callback=d=>d) {

    // Get the scripts from the store and run the 
    const scripts = ClientStore.select(state => state.py.scripts);
    const script = scripts[scriptName];

    // Execute the script
    return ClientPyodide.processRun(script, {}, callback)
  }

  _scriptInit();

  return {
    ..._,
  }
})();

