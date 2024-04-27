/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 20:29:25
 * @ Modified time: 2024-04-27 22:34:42
 * @ Description:
 * 
 * This file has some helper functions for interacting with Pyodide.
 */

import { PyodideAPI } from "./Pyodide";

export const DataviserPyAPI = (function() {

  const _ = {
    scripts: {

      // Unpickles an array of bytes and converts to df
      // The df is returned in JSON
      'read_pickle': 
      `
      import pickle
      import pandas as pd
      from js import byte_array

      # Convert to a byte string 
      byte_string = bytes(byte_array)

      # Convert to a dataframe
      df = pd.DataFrame(pickle.loads(byte_string))

      # Return a JSON version of the dataframe
      df.to_json(orient='index')
      `,

      // Unpickles a bunch of arrays of bytes and converts them to dfs
      // The dfs are returned in JSON
      'read_pickles': 
      `
      import json
      import pickle
      import pandas as pd
      from js import byte_arrays

      # Convert to Python-readable structures
      print('Comverting JS byte_arrays to Py objects...')
      byte_arrays = byte_arrays.to_py()

      # Where we store the resulting byte strings
      # Also where we store the dataframes
      byte_strings = {}
      dfs = {}

      # Convert to byte strings 
      print('Converting byte_arrays to byte_strings...')
      for key, byte_array in byte_arrays.items():
        byte_strings[key] = bytes(byte_array)

      # Convert to dataframes
      print('Depickling byte_strings and converting to dataframes...')
      for key, byte_string in byte_strings.items():
        dfs[key] = pd.DataFrame(pickle.loads(byte_string)).to_dict('index')

      # Returns a JSON version of the dataframes
      print('Returning results.')
      json.dumps(dfs)
      `,

      // Inserts a new column into a dataframe
      // The column will usually be defined by the filename
      'df_serialize': 
      `
      import json
      import pandas as pd
      from js import json_dfs

      # All our resulting dataframes
      dfs = {}

      # Convert each of the json objects into a df 
      for key, json_df in json_dfs.items():
        dfs[key] = pd.DataFrame(json_df)
        dfs[key]['serial'] = [ key ] * len(dfs[key].index)
        dfs[key] = dfs[key].to_dict('index')

      # Return the final collection of dfs
      json.dumps(dfs)
      `,

      // Concatenates two dataframes together
      'df_concat':
      `
      import pandas as pd
      from js import json_dfs

      # All our resulting dataframes
      dfs = []

      # Convert each of the json objects into a df 
      for key, json_df in json_dfs.items():
        dfs.append(pd.DataFrame(json_df))

      # Concatenate all the dataframes
      result = pd.concat(dfs).to_json(orient='index')

      # Return the JSON version of the result
      result
      `,
    }
  };

  /**
   * Reads a raw byte array and spits out a JSON object.
   * The JSON object is the depickled version of the file.
   * 
   * @param   { Uint8Array }  byteArray   An array of bytes to be depickled.
   * @param   { function }    callback    A callback to be given the resulting JSON. 
   */
  _.readPickle = function(byteArray, callback) {
    PyodideAPI.runProcess(
      _.scripts['read_pickle'], 
      { byte_array: byteArray }, 
      data => callback(JSON.parse(data))
    );
  }

  /**
   * Reads a bunch of raw byte arrays and spits out JSON objects.
   * The JSON object is the depickled version of the file.
   * 
   * @param   { object }      byteArrays    A dictionary of array of bytes to be depickled.
   * @param   { function }    callback      A callback to be given the resulting JSON. 
   */
  _.readPickles = function(byteArrays, callback) {
    PyodideAPI.runProcess(
      _.scripts['read_pickles'], 
      { byte_arrays: byteArrays }, 
      data => callback(JSON.parse(data))
    );
  }

  /**
   * 
   */
  _.dfConcat = function(jsonDataFrames, callback) {
    PyodideAPI.runProcess(
      _.scripts['df_concat'], 
      { json_dataframes: jsonDataFrames }, 
      data => callback(JSON.parse(data))
    );
  }

  return {
    ..._,
  }
})();