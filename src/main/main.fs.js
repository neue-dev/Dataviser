/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-06-14 22:46:13
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
   * Returns whether or not all the files within the cache have fully loaded.
   * 
   * @return  { boolean }   Whether or not all the files have loaded. 
   */
  _.checkCacheLoadState = function() {

    // Get the ids of the loaded files
    const ids = Object.keys(_cache);

    // Check if all files have been loaded
    for(let i = 0; i < ids.length; i++)
      if(!_cache[ids[i]].loaded)
        return false;
      
    return true;
  }

  /**
   * Writes a file to the memory cache.
   * 
   * @param   { string }    id        A unique id for the file.
   * @param   { string }    filepath  The filepath of the file.
   * @param   { function }  callback  A callback to execute after each file cache.
   */
  _.cacheFile = function(id, filepath, encoding, callback=d=>d) {

    // Read the file
    // This part is asynchronous
    // That let's us return the result dict faster
    fs.readFile(filepath, encoding, (err, data) => {
      
      // An error occured
      if(err) return console.error(err);

      // Save the data according to encoding
      switch(encoding) {
          
        // Save the data as is
        case 'utf-8':
          _cache[id].data = data;
          break;
          
        // Convert the data into a binary array
        default: 
          _cache[id].data = new Uint8Array(data);
          break;
      }
      
      // Set the file to loaded
      _cache[id].loaded = true;

      // Execute the callback
      callback();
    });

    // Allocate a slot for the file
    _cache[id] = {
      filepath: filepath,
      loaded: false,
      data: [],
    }
  }

  /**
   * Loads all the files in a folder and saves its contents into memory.
   * Generates a unique id for each file.
   * Note that a null encoding tells the file reader to read the contents in binary.
   * 
   * @param   { string }    dirpath   The path to the folder.
   * @param   { object }    options   Options for reading the file.  
   * @return  { Promise }             The promise for loading the files into memory.
   */
  _.loadDirectories = function(dirpaths, options={}) {

    // The options
    // Note that we have to check whether or not the encoding is in the options ('null' means binary encoding)
    const encoding = 'encoding' in options ? options.encoding : 'utf-8';

    // Creates a new promise which we return
    let onResolve;
    let onReject;
    const outPromise = new Promise((resolve, reject) => {
      onResolve = resolve;
      onReject = reject;
    })

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

        // We cache the file and pass a callback to it
        _.cacheFile(id, filepath, encoding, () => {
          if(_.checkCacheLoadState())
            onResolve(_cache);
        });
      });
    })

    // Return a promise for loading the data 
    return outPromise;
  }

  // ! to code: the loadFiles function

  /**
   * Requests for the data of loaded files through their ids.
   * Note that binary data is stored as an array buffer and will be returned as such.
   * 
   * @param   { string[] }  ids       The id of the files. 
   * @param   { object }    options   Options for reading the file.  
   * @return  { object }              The data stored by the files.
   */
  _.requestFiles = function(ids, options={}) {
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
