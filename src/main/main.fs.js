/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-06-06 17:18:21
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
   * Loads all the files in a folder and saves its contents into memory.
   * Generates a unique id for each file.
   * 
   * @param   { string }  dirpath   The path to the folder.
   * @param   { object }  options   Options for reading the file.  
   */
  _.loadDirectory = function(dirpath, options={}) {

    // The options
    const encoding = options.encoding ?? 'utf-8';

    // The output
    const output = [];
    
    // Save the file contents
    fs.readdir(dirpath, (err, filepaths) => {
      
      // An error occured
      if(err) return console.error(err);
      
      // Read each of the files
      filepaths.forEach(filepath => {

        // Generate a random ID and the complete path
        const id = crypto.randomUUID();
        const path = `${dirpath}\\\\${filepath}`;

        // Read the file
        fs.readFile(path, encoding, (err, data) => {

          // An error occured
          if(err) return console.error(err);
          
          // Save the data
          _cache[id] = { data, path };

          // Append to the output
          output.push({ id, path });
        });
      })
    })

    // Return the list of all files and their ids
    return output;
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
