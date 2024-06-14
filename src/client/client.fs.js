/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:58:25
 * @ Modified time: 2024-06-14 19:31:18
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
   * This function selects a folder from the current system.
   * It then calls _.loadDirectories, which loads the files in the folder unto memory.
   */
  _.chooseDirectories = function() {
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
    promise.then(result => _.loadDirectories(result)
      .then(result => outResolve(result)));

    // Return the promise so we can wait for it elsewhere
    return outPromise;
  }

  /**
   * This function selects a file from the current system.
   * It then loads the file contents unto memory.
   */
  _.chooseFiles = function() {
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
    promise.then(result => _.loadFiles(result)
      .then(result => outResolve(result)));

    // Return the promise so we can wait for it elsewhere
    return outPromise;
  }

  /**
   * Loads all the files in the provided folder path into memory.
   * 
   * @param   { string[] }  dirpaths  An array of directory paths.
   */
  _.loadDirectories = function(dirpaths) {
    const message = 'fs:load-directories';
    const args = [ dirpaths ];
    const promise = ClientIPC.call(_HOST, message, args);

    // When the result has been returned, store the file references
    promise.then(result => result.forEach(entry => {
      _refs[entry.id] = entry;
    }));

    // Return the promise so we can wait for it elsewhere
    return promise;
  }

  /**
   * Loads all the files in the provided folder path into memory.
   * 
   * @param   { string[] }  filepaths  An array of filepaths.
   */
  _.loadFiles = function(filepaths) {
    const message = 'fs:load-files';
    const args = [ filepaths ];
    const promise = ClientIPC.call(_HOST, message, args);

    // When the result has been returned, store the file references
    promise.then(result => result.forEach(entry => {
      _refs[entry.id] = entry;
    }));

    // Return the promise so we can wait for it elsewhere
    return promise;
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