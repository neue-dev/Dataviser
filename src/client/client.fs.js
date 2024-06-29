/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-30 00:11:35
 * @ Modified time: 2024-06-30 02:29:21
 * @ Description:
 * 
 * Links the store and the fs management together.
 * This file makes requests to the main process via the IPC for the file data.
 */

// IPC and store api
import { ClientIPC } from './client.ipc'
import { ClientStore } from './client.store.api'

// Toaster
import { ClientToast } from './client.toast'

export const FS = (function() {
  
  const _ = {};

  /**
   * Creates the filenames within the store.
   * 
   * @param   { array }   filepaths   The array of filenames to save.
   */
  const _storeFileCreate = function(filepaths) {
    
    // Create a dispatch function for that action
    const dispatch = ClientStore.storeDispatcher('fs/fsFileCreate');

    // For each filepath
    filepaths.forEach(filepath => dispatch({ filepath }))
  }

  /**
   * Saves the data for each of the files within the store.
   * 
   *  
   */
  const _storeFileSave = function(files) {
    
    // Make a request to load the filepaths
    const dispatch = ClientStore.storeDispatcher('fs/fsLoadFile');

    // Save the data for each filepath
    files.forEach(filedata => dispatch(filedata))
  }

  /**
   * Picks files for us.
   * Stores the names of the picked files in the store.
   */
  _.chooseFiles = function() {

    // Make a request to select files
    const promise = ClientIPC.requestSender('fs', 'fs/choose-files')([])

    // Grab the filepaths returnd, which is in results[0]
    promise.then(results => _storeFileCreate(results[0]))

    // Return a toaster
    return ClientToast.createToaster({ 
      promise, 
      success: 'Files were chosen.',
      loading: 'Choosing files...',
      failure: 'No files were chosen.'
    });
  }

  /**
   * Picks folders for us.
   * Stores the names of the files within the picked folder in the store.
   */
  _.chooseDirectories = function(args=[]) {

    // Make a request to select files
    const promise = ClientIPC.requestSender('fs', 'fs/choose-directories')([])

    // Grab the filepaths returnd, which is in results[0]
    promise.then(results => _storeFileCreate(results[0]))

    // Return a toaster
    return ClientToast.createToaster({ 
      promise, 
      success: 'Files were chosen.',
      loading: 'Choosing files...',
      failure: 'No files were chosen.'
    });
  }

  /**
   * Loads all the files we currently have in the store.
   */
  _.loadFiles = function() {
    
    // Grab the filepaths we have in the store
    const filepaths = ClientStore.select(state => Object.keys(state.fs.filenames));

    const promise = ClientIPC.requestSender('fs', 'fs/load-files')(filepaths);

    promise.then(r => console.log(r));
  }

  return {
    ..._,
  }
})();

export default {
  FS,
}
