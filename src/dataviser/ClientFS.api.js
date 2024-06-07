/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:58:25
 * @ Modified time: 2024-06-07 18:02:57
 * @ Description:
 * 
 * Handles our references to files and the data they store.
 */

// Custom
import { ClientIPC } from './ClientIPC.api'

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

    // When the result has been returned, load the dirs
    promise.then(result => _.loadDirectories(result));
  }

  /**
   * This function selects a file from the current system.
   * It then loads the file contents unto memory.
   */
  _.chooseFiles = function() {
    const message = 'fs:choose-files';
    const promise = ClientIPC.call(_HOST, message);

    // When the result has been returned, load the dirs
    promise.then(result => _.loadFiles(result));
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

    // When the result has been returned, load the dirs
    promise.then(result => console.log(result));
  }

  /**
   * Loads all the files in the provided folder path into memory.
   * ! to code change the console log and make sure this works
   * 
   * @param   { string[] }  filepaths  An array of filepaths.
   */
  _.loadFiles = function(filepaths) {
    const message = 'fs:load-files';
    const args = [ filepaths ];
    const promise = ClientIPC.call(_HOST, message, args);

    // When the result has been returned, load the dirs
    promise.then(result => console.log(result));
  }

  return {
    ..._,
  }
})();