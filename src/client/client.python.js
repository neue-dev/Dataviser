/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 21:53:19
 * @ Modified time: 2024-06-15 20:28:24
 * @ Description:
 * 
 * This file holds all the Python scripts our program will be running.
 */

import { ClientPyodide } from "./client.pyodide";

export const ClientPython = (function() {
  
  const _ = {};

  // Depickler functions
  const _depickler = `
    import pickle

    def depickle_byte_array(byte_array):
      '''
      This function depickles a single byte array.
      It converts it into a dataframe and returns this.
      '''
      
      # Convert the byte array to a byte string
      byte_string = bytes(byte_array)

      # Load the data using pickle
      data = pickle.loads(byte_string)

      # Convert the loaded data into a dataframe
      df = pd.DataFrame(data)

      return df

    def depickle_byte_arrays(byte_arrays):
      '''
      This function depickles a bunch of different byte arrays.
      It converts them into dataframes and returns them.
      Note that a dict of byte_arrays must be passed, with the ids as the keys.
      '''

      # Output variable
      dfs = {}

      # Convert each into a dataframe and save into output var
      for id in byte_arrays:
        dfs[id] = depickle_byte_array(bytes_arrays[i])

      return dfs
  `;

  /**
   * Includes one of the sets of library functions we have here.
   * By include, we mean we load it into the currently running Pyodide context.
   * The library functions are just utilities to help us deal with data.
   * For instance, the 'depickler' contains scripts for converting byte arrays into dataframes.
   * 
   * @param   { string }  library   The name of the library we want. 
   */
  _.includeLibrary = function(library) {

    // Import the provided library
    switch(library) {
      
      // A library for deserializing data
      case 'depickler':
        ClientPyodide.processRun(_depickler, {}, d=>d);
        break;
      
      // The name the user entered doesn't match any lib
      default:
        console.log('The library selected is not present in the Dataviser Python scripts catalogue.');
        break;
    }
  }

  /**
   * Defines the given variables in the Python namespace.
   * 
   * @param   { object }  data  The variables to define within the namespace.
   */
  _.sendData = function(data={}) {
    ClientPyodide.processSetContext(data);
  }

  /**
   * Runs a custom Python script.
   * 
   * @param   { string }  script  The script to run. 
   */
  _.runScript = function(script) {
    ClientPyodide.processRun(script, {}, d=>d);
  }

  return {
    ..._,
  }
})();

