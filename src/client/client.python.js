/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-14 21:53:19
 * @ Modified time: 2024-06-14 22:28:05
 * @ Description:
 * 
 * This file holds all the Python scripts our program will be running.
 */

const ClientPython = (function() {
  
  const _ = {};

  // Depickler functions
  _.depickler = `
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

  return {
    ..._,
  }
})();

