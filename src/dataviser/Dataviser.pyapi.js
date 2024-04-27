/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-27 20:29:25
 * @ Modified time: 2024-04-27 21:02:27
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
      df.to_json()
      `,

      // Inserts a new column into a dataframe
      // The column will usually be defined by the filename
      'df_serialize': 
      `
      import pandas as pd
      from js import json_dfs

      # All our resulting dataframes
      dfs = {}

      # Convert each of the json objects into a df 
      for key, json_df in json_dfs.items():
        dfs[key] = pd.DataFrame(json_df)
        dfs[key]['serial'] = [ key ] * len(dfs[key].index)
        dfs[key] = dfs[key].to_json

      # Return the final collection of dfs
      dfs
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
      result = pd.concat(dfs)

      # Return the JSON version of the result
      result.to_json()
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