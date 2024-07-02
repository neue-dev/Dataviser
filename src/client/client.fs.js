/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-30 00:11:35
 * @ Modified time: 2024-07-02 15:14:11
 * @ Description:
 * 
 * Links the store and the fs management together.
 * This file makes requests to the main process via the IPC for the file data.
 */

// IPC and store api
import { ClientIPC } from './client.ipc'
import { ClientStore } from './client.store.api'

// Toaster and promise
import { ClientPromise } from './client.promise'
import { ClientToast } from './client.toast'

export const ClientFS = (function() {
  
  const _ = {};

  /**
   * Creates the filenames within the store.
   * 
   * @param   { array }   files   The array of filenames and filepaths to save.
   */
  const _storeFileCreate = function(files) {
    
    // Create a dispatch function for that action
    const dispatch = ClientStore.storeDispatcher('fs/fsFileCreate');

    // For each filepath
    files.forEach(file => dispatch(file))
  }

  /**
   * Saves the data for each of the files within the store.
   * 
   * @param   { array }   files   The files to save.
   */
  const _storeFileSave = function(files) {
    
    // Make a request to load the filepaths
    const dispatchLoad = ClientStore.storeDispatcher('fs/fsFileLoad');
    const dispatchMeta = ClientStore.storeDispatcher('fs/fsFileMeta');

    // Save the data for each filepath
    files.forEach(file => dispatchLoad(file))
    files.forEach(file => dispatchMeta(file))
  }

  /**
   * Picks files or folders for us.
   * Stores the names of the picked files in the store.
   * 
   * @param   { object }  options   Specifies whether or not to open files or directories.
   */
  _.fileChoose = function(options={}) {

    // Whether we're picking folders or files
    const type = options.type ?? 'directories';
    const action = [ 'files', 'file', 'f' ].includes(type) ?
      'fs/choose-files' : 
      'fs/choose-directories';

    // The toast promise
    const { promise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // Grab the filepaths returnd, which is in results[0]
    ClientIPC.requestSender('fs', action)([]).then(results => {

      // Reject the promise
      if(!results[0].length) {
        rejectHandle('No files were chosen');

      // Resolve the promise
      } else { 
        resolveHandle();
        _storeFileCreate(results[0])
      } 
    })

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
   * Also accepts a callback within the options for parsing metadata.
   * 
   * @param   { object }  options   Options for loading the files, such as encoding, etc..
   */
  _.fileLoad = function(options={}) {
    
    // Grab the filepaths we have in the store
    const filepaths = ClientStore.select(state => Object.keys(state.fs.filenames));

    // The toast promise
    const { promise, resolveHandle, rejectHandle } = ClientPromise.createPromise();

    // Save to the store after
    ClientIPC.requestSender('fs', 'fs/load-files')(filepaths, options).then(results => {
      
      // Reject the promise
      if(!results[0].length) {
        rejectHandle('Files could not be loaded.');

      // Resolve the promise
      } else { 
        resolveHandle();
        _storeFileSave(results[0])
      }
    });

    // Return a toaster
    return ClientToast.createToaster({ 
      promise, 
      success: 'Files were loaded.',
      loading: 'Loading files...',
      failure: 'Files could not be loaded.'
    });
  }

  return {
    ..._,
  }
})();

export default {
  FS: ClientFS,
}
