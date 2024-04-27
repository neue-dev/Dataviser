/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 20:29:25
 * @ Modified time: 2024-04-28 01:45:09
 * @ Description:
 * 
 * This file has some helper functions for interacting with Pyodide.
 */

import { PyodideAPI } from "./Pyodide.api";

export const DataviserPyAPI = (function() {

  const _ = {
    scripts: {

      // Unpickles an array of bytes and converts to df
      // The df is returned in JSON
      // ! add print statements, convert to py obj first
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

      // Filters the dataframes by the specified rows
      'dfs_filter_rows': 
      `
      import json
      import pandas as pd
      from js import json_dfs
      from js import rows

      # Convert to something Python can understand
      print('Converting JSON to Python objects...')
      json_dfs = json_dfs.to_py()

      # All our resulting dataframes
      dfs = {}

      # Convert each of the json objects into a df 
      print('Filtering rows...')
      for key, json_df in json_dfs.items():
        dfs[key] = pd.DataFrame(json_df)                      # Convert the JSON objects into dataframes
        dfs[key] = dfs[key][dfs[key].index.isin(rows)]        # Filter the df by the specified rows
        dfs[key] = dfs[key].to_dict('index')                  # Convert the dfs into dicts

      # Return the final collection of dfs
      print('Returning results.')
      json.dumps(dfs)
      `,

      // Filters the dataframes by the specified cols
      'dfs_filter_cols': 
      `
      import json
      import pandas as pd
      from js import json_dfs
      from js import cols

      # Convert to something Python can understand
      print('Converting JSON to Python objects...')
      json_dfs = json_dfs.to_py()

      # All our resulting dataframes
      dfs = {}

      # Convert each of the json objects into a df 
      print('Filtering cols...')
      for key, json_df in json_dfs.items():
        dfs[key] = pd.DataFrame(json_df)                      # Convert the JSON objects into dataframes
        dfs[key] = dfs[key].filter(items=list(cols))          # Filter the df by the specified cols
        dfs[key] = dfs[key].to_dict('index')                  # Convert the dfs into dicts

      # Return the final collection of dfs
      print('Returning results.')
      json.dumps(dfs)
      `,

      // Concatenates two dataframes together
      'dfs_concat':
      `
      import pandas as pd
      from js import json_dfs
      from js import keys

      # Convert JSON data into Python compatible objects
      print('Converting JSON to Python objects...')
      json_dfs = json_dfs.to_py()

      # All our resulting dataframes
      dfs = []

      # Convert each of the json objects into a df 
      print('Converting dicts to dataframes...')
      for key, json_df in json_dfs.items():
        dfs.append(pd.DataFrame(json_df))

      # Concatenate all the dataframes
      print('Concatenating dataframes...')
      result = pd.concat(dfs, keys=list(keys)).to_json(orient='index')

      # Return the JSON version of the result
      print('Returning results.')
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
   * Filters the dataframes by the specified rows.
   * Returns the result to the callback.
   * 
   * @param   { object }    jsonDataFrames  A dict of JSON dataframes.
   * @param   { array }     rows            An array of row names to include.
   * @param   { function }  callback        The callback to receive the resulting filtered dfs.  
   */
  _.dfsFilterRows = function(jsonDataFrames, rows, callback) {
    PyodideAPI.runProcess(
      _.scripts['dfs_filter_rows'],
      { 
        json_dfs: jsonDataFrames, 
        rows: rows 
      },
      data => callback(JSON.parse(data))
    )
  }

  /**
   * Filters the dataframes by the specified cols.
   * Returns the result to the callback.
   * 
   * @param   { object }    jsonDataFrames  A dict of JSON dataframes.
   * @param   { array }     cols            An array of column names to include.
   * @param   { function }  callback        The callback to receive the resulting filtered dfs.  
   */
  _.dfsFilterCols = function(jsonDataFrames, cols, callback) {
    PyodideAPI.runProcess(
      _.scripts['dfs_filter_cols'],
      { 
        json_dfs: jsonDataFrames, 
        cols: cols
      },
      data => callback(JSON.parse(data))
    )
  }

  /**
   * Concatenates dataframes together.
   * 
   * @param   { object }    jsonDataFrames  A dict of JSON dataframes.
   * @param   { function }  callback        The callback to receive the resulting concatenated df.  
   */
  _.dfsConcat = function(jsonDataFrames, callback) {
    PyodideAPI.runProcess(
      _.scripts['dfs_concat'], 
      { 
        json_dfs: jsonDataFrames,
        keys: Object.keys(jsonDataFrames),
      }, 
      data => callback(JSON.parse(data))
    );
  }

  return {
    ..._,
  }
})();