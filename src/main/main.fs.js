/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-06-06 16:52:20
 * @ Description:
 * 
 * This module has some file system handling utilities.
 */

// Modules
const path = require('node:path');
const fs = require('node:fs');

/**
 * The file system object provides us with utilities to manage files opened by the user.
 * It stores their contents here too, and manages some of their states.
 */
export const FS = (function() {
  
  const _ = {};
  const _cache = {};

  /**
   * Loads a file and saves its contents into memory.
   * Generates a unique id for the file.
   * 
   * @param   { string }  filepath  The path to the file.
   * @param   { object }  options   Options for reading the file.  
   */
  _.load = function(filepath, options={}) {
    const id = crypto.randomUUID();
    const encoding = options.encoding ?? 'utf-8';

    // Save the file contents
    fs.readFile(filepath, encoding, (err, data) => {
      
      // An error occured
      if(err)
        return console.error(err);

      // Save the data onto the cache
      _cache[id] = data;

      // ! remove
      // Also log the data
      console.log('file data', data);
    })

    // Return the file information
    return {
      id, filepath
    }
  }

  /**
   * Requests for the data of a loaded file through it's id.
   * 
   * @param   { string }  id  The id of the file. 
   */
  _.request = function(id) {
    
  }

  return {
    ..._,
  }

})();
