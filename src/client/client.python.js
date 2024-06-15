/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 21:53:19
 * @ Modified time: 2024-06-15 18:47:54
 * @ Description:
 * 
 * This file holds all the Python scripts our program will be running.
 */

import { ClientPyodide } from "./client.pyodide";

export const ClientPython = (function() {
  
  const _ = {};

  // Some default dependencies we import if they haven't been defined
  const _dependencies = `
    try:
      pickle
    except:
      import pickle

    try:
      pd
    except:
      import pandas as pd

    try:
      json
    except:
      import json

    try:
      np
    except:
      import numpy as np
  `;

  // Depickler functions
  const _depickler = `
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

  // Utilities for parsing 'CSV' (here it's just a 2d array)
  const _df_utils = `
    import pandas as pd

    def df_from_arr2d(arr2d):
      return pd.DataFrame(arr2d)
      
    def df_to_dict(df):
      return df.to_dict()
  `;

  /**
   * Includes one of the sets of library functions we have here.
   * By include, we mean we load it into the currently running Pyodide context.
   * The library functions are just utilities to help us deal with data.
   * For instance, the 'depickler' contains scripts for converting byte arrays into dataframes.
   * 
   * @param   { string }  library   The name of the library we want. 
   */
  _.loadLibrary = function(library) {

    // Always import the dependencies first
    ClientPyodide.processRun(_dependencies, {}, d=>d);

    // Import the provided library
    switch(library) {
      
      // A library for deserializing data
      case 'depickler':
        ClientPyodide.processRun(_depickler, {}, d=>d);
        break;

      // A library for dealing with dataframes 
      case 'df_utils':
        ClientPyodide.processRun(_df_utils, {}, d=>d);
        break;
      
      // The name the user entered doesn't match any lib
      default:
        console.log('The library selected is not present in the Dataviser Python scripts catalogue.');
        break;
    }
  }

  /**
   * Requests for particular data from Pyodide.
   * Note that we do this by specifying the variable names of the data we want within Pyodide.
   * 
   * @param   { object }    data  The names of the data we want from Pyodide. 
   * @return  { Promise }         A promise for the requested data.
   */
  _.requestData = function(data=[]) {

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
    return _.runScript(script);
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
   * @param   { string }    script    The script to run. 
   * @param   { function }  callback  An optional callback to deal with the data.
   * @return  { Promise }             A promise for the execution of the script. 
   */
  _.runScript = function(script, callback=d=>d) {

    // Execute the script
    return ClientPyodide.processRun(script, {}, callback)
  }

  return {
    ..._,
  }
})();

