/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-30 00:11:35
 * @ Modified time: 2024-06-30 01:11:17
 * @ Description:
 * 
 * Links the store and the fs management together.
 * This file makes requests to the main process via the IPC for the file data.
 */

import { ClientIPC } from './client.ipc'
import { store } from '../data/store'

export const FS = (function() {
  
  const _ = {};

  /**
   * Creates the filenames within the store.
   * 
   * @param   { array }   filenames   The array of filenames to save.
   */
  const _storeFileCreate = function(filenames) {

    // For each filename
    filenames.forEach(filename => {

      // Generates a random if do the filename
      const id = crypto.randomUUID();
      
      // Requests to save the filename in the store
      store.dispatch({ 
        type: 'fs/fsFileCreate', 
        payload: { id, filename }
      })
    })
  }

  /**
   * Picks files for us.
   * Stores the names of the picked files in the store.
   * 
   * @param   { array }   args  Some additional args.
   */
  _.chooseFiles = function(args=[]) {

    // Make a request to select files
    ClientIPC.requestSender('fs', 'fs/choose-files')(args)

      // Grab the filepaths returnd, which is in results[0]
      .then(results => _storeFileCreate(results[0]))
  }

  /**
   * Picks folders for us.
   * Stores the names of the files within the picked folder in the store.
   * 
   * @param   { array }   args  Some additional args.   
   */
  _.chooseDirectories = function(args=[]) {

    // Make a request to select files
    ClientIPC.requestSender('fs', 'fs/choose-directories')(args)

      // Grab the filepaths returnd, which is in results[0]
      .then(results => _storeFileCreate(results[0]))
  }

  return {
    ..._,
  }
})();

export default {
  FS,
}
