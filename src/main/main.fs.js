/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-06 16:30:31
 * @ Modified time: 2024-06-17 02:20:47
 * @ Description:
 * 
 * This module has some file system handling utilities.
 */

// Modules
const path = require('node:path');
const fs = require('node:fs');
const { parse } = require('csv-parse/sync');

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
   * @param   { object }    options   The options for caching the file.
  */
  _.cacheFile = function(id, filepath, options={}) {

    // Parse the options
    const encoding = options.encoding ?? 'utf-8';
    const cacheCallback = options.cacheCallback ?? (d => d);
    const filenameCallback = options.filenameCallback ? 
      new Function('return ' + options.filenameCallback)() : (d => d);
    const fileheadCallback = options.fileheadCallback ? 
      new Function('return ' + options.fileheadCallback)() : (d => d);

    // The encoding we pass to the filereader
    const fileCodec = encoding == 'csv' ? 'utf-8' : encoding;
    const filename = filenameCallback(filepath);
    const filehead = fileheadCallback(filepath);

    // Read the file
    // This part is asynchronous
    // That let's us return the result dict faster
    fs.readFile(filepath, fileCodec, (err, data) => {
      
      // An error occured
      if(err) return console.error(err);

      // Save the data according to encoding
      switch(encoding) {
          
        // Save the data as is
        case 'utf-8':
          _cache[id].data = data;
          break;

        // Parse the csv
        case 'csv':
          _cache[id].data = parse(data, { columns: false, trim: true })

          // Clean up the data
          // Make sure numeric data stay numeric
          for(let i = 0; i < _cache[id].data.length; i++)
            for(let j = 0; j < _cache[id].data[i].length; j++)
              if(!isNaN(parseFloat(_cache[id].data[i][j])))
                _cache[id].data[i][j] = parseFloat(_cache[id].data[i][j]);

          break;
          
        // Convert the data into a binary array
        default: 
          _cache[id].data = new Uint8Array(data);
          break;
      }
      
      // Set the file to loaded
      _cache[id].loaded = true;

      // Execute the callback
      cacheCallback(_cache[id].data);
    });

    // Allocate a slot for the file
    _cache[id] = {
      filepath: filepath,
      filename: filename,
      filehead: filehead,
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
    const filenameCallback = options.filenameCallback ?? (d => d).toString();
    const fileheadCallback = options.fileheadCallback ?? (d => d).toString();

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
        _.cacheFile(id, filepath, {
          encoding: encoding, 
          filenameCallback: filenameCallback,
          fileheadCallback: fileheadCallback,

          // Checks whether or not all files are loaded each time
          cacheCallback: () => {
            if(_.checkCacheLoadState())
              onResolve(_cache);
          }
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
   * @param   { string[] }  ids       The ids of the files. 
   * @param   { object }    options   Options for reading the file.  
   * @return  { object }              The data stored by the files.
   */
  _.requestFiles = function(ids, options={}) {
    const result = {};

    // Return all the files if no ids provided
    if(!ids.length)
      ids = Object.keys(_cache);

    // Retrieve each of the references
    ids.forEach(id => {

      // Invalid id
      if(!_cache[id])
        return console.error('Invalid Id.', id);
      
      // Grab the filename
      const filename = _cache[id].filename;

      // Inform the client that that file is pending
      if(!_cache[id].loaded)
        return result[filename] = 'pending...'

      // Give back the file data
      return result[filename] = {
        head: _cache[id].filehead,
        data: _cache[id].data,
      };
    });

    return result;
  }

  return {
    ..._,
  }

})();
