/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-06-07 05:32:22
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
   * Note that a null encoding tells the file reader to read the contents in binary.
   * 
   * @param   { string }  dirpath   The path to the folder.
   * @param   { object }  options   Options for reading the file.  
   */
  _.loadDirectories = function(dirpaths, options={}) {

    // The options
    const encoding = options.encoding ?? 'utf-8';

    // The output
    const result = [];

    // Load the file contents
    // We can do this synchronously
    // From the POV of the client this is async anyway
    dirpaths.forEach(dirpath => {

      // Grab the files in the directory
      const filenames = fs.readdirSync(dirpath);

      // Read each of the files
      filenames.forEach(filename => {

        // Generate the file path
        const id = crypto.randomUUID();
        const filepath = `${dirpath}\\${filename}`;

        // Read the file
        // This part is asynchronous
        // That let's us return the result dict faster
        fs.readFile(filepath, encoding, (err, data) => {
          
          // An error occured
          if(err) return console.error(err);

          // Save the data
          _cache[id].data = data;
          _cache[id].loaded = true;
        });

        // Allocate a slot for the file
        _cache[id] = {
          filepath: filepath,
          loaded: false,
          data: [],
        }

        // Append to the output
        result.push({
          id, filepath
        });
      });
    })

    // Return the list of all files and their ids
    return result;
  }

  // ! to code: the loadFiles function

  /**
   * Requests for the data of loaded files through their ids.
   * Note that binary data is stored as an array buffer and will be returned as such.
   * 
   * @param   { string[] }  ids   The id of the files. 
   * @return  { object }          The data stored by the files.
   */
  _.requestFiles = function(ids) {
    const result = {};

    ids.forEach(id => {

      // Invalid id
      if(!_cache[id])
        return console.error('Invalid Id.', id);

      // Inform the client that that file is pending
      if(!_cache[id].loaded)
        return result[id] = 'pending...'

      // Give back the file data
      return result[id] = _cache[id].data;
    });

    return result;
  }

  return {
    ..._,
  }

})();
