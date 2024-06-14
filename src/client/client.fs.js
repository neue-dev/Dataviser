/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:58:25
 * @ Modified time: 2024-06-14 22:47:35
 * @ Description:
 * 
 * Handles our references to files and the data they store.
 */

// Custom
import { ClientIPC } from './client.ipc'

export const ClientFS = (function() {

  const _ = {};
  const _refs = {};
  const _HOST = 'fs';

  /**
   * This function requests a select-folder prompt from the current system.
   * It then calls _.loadDirectories, which loads the files in the folder unto memory.
   * 
   * @param   { object }    options   The options to be passed to the main process.
   * @return  { Promise }             A promise indicating the status of the request.
   */
  _.chooseDirectories = function(options={}) {

    // Some constants
    const message = 'fs:choose-directories';
    const promise = ClientIPC.call(_HOST, message);
    
    // The output promise for the files to load
    let outResolve;
    let outReject;
    let outPromise = new Promise((resolve, reject) => {
      outResolve = resolve;
      outReject = reject;
    });

    // When the result has been returned, load the dirs
    promise.then(result => _.loadDirectories(result, options)
      .then(result => outResolve(result)));

    // Return the promise so we can wait for it elsewhere
    return outPromise;
  }

  /**
   * This function requests a select-file from the current system.
   * It then loads the file contents unto memory.
   * 
   * @param   { object }    options   The options to be passed to the main process.
   * @return  { Promise }             A promise indicating the status of the request.
   */
  _.chooseFiles = function(options={}) {

    // Some constants
    const message = 'fs:choose-files';
    const promise = ClientIPC.call(_HOST, message);
    
    // The output promise for the files to load
    let outResolve;
    let outReject;
    let outPromise = new Promise((resolve, reject) => {
      outResolve = resolve;
      outReject = reject;
    });

    // When the result has been returned, load the dirs
    promise.then(result => _.loadFiles(result, options)
      .then(result => outResolve(result)));

    // Return the promise so we can wait for it elsewhere
    return outPromise;
  }

  /**
   * Requests to load all the files in the provided folder paths into memory.
   * 
   * @param   { string[] }  dirpaths  An array of directory paths.
   * @param   { object }    options   The options to be passed to the main process.
   * @return  { Promise }             A promise indicating the status of the request.
   */
  _.loadDirectories = function(dirpaths, options={}) {

    // Some constants
    const message = 'fs:load-directories';
    const args = [ dirpaths, options ];
    const outPromise = ClientIPC.call(_HOST, message, args);

    // Return the promise so we can wait for it elsewhere
    return outPromise;
  }

  /**
   * Requests to load all the files in the provided filepaths into memory.
   * 
   * @param   { string[] }  filepaths   An array of filepaths.
   * @return  { Promise }               A promise indicating the status of the request.
   */
  _.loadFiles = function(filepaths, options={}) {

    // Some constants
    const message = 'fs:load-files';
    const args = [ filepaths, options ];
    const outPromise = ClientIPC.call(_HOST, message, args);

    // When the result has been returned, store the file references
    outPromise.then(result => result.forEach(entry => {
      _refs[entry.id] = entry;
    }));

    // Return the promise so we can wait for it elsewhere
    return outPromise;
  }

  /**
   * Requests for the actual data stored by the files.
   * If no file ids are provided, it retrieves all the files by default.
   * 
   * @param   { array }     ids       The ids of the files to load.
   * @param   { object }    options   The options to be passed to the main process.
   * @return  { Promise }             A promise indicating the status of the request.
   */
  _.requestFiles = function(ids=[], options={}) {

    // Some constants
    const message = 'fs:request-files';
    const args = [ ids, options ];
    const outPromise = ClientIPC.call(_HOST, message, args);

    outPromise.then(result => {
      console.log(result)
    })

    return outPromise;
  }

  /**
   * Returns a list of all the files references.
   * Each entry in the list contains the file id and the filepath.
   * 
   * @return  { object[] }  A list of all the file references.  
   */
  _.getRefList = function() {
    const refs = [];
    const ids = Object.keys(_refs);

    // Creates a list of all the references
    for(let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const filepath = _refs[id].filepath;

      // Push a file data entry
      refs.push({ 
        id: id, 
        filepath: filepath,
      });
    }

    return refs;
  }

  return {
    ..._,
  }
})();