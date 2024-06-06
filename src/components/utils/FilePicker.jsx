import * as React from 'react'

// Custom
import { DButton } from '../base/DButton.jsx'

/**
 * A component that gives a button the extra functionality to select a folder or a file.
 * 
 * @component
 */
export function FilePicker(props={}) {

  const _HOST = 'filepicker'
  const _responses = {};

  /**
   * This function selects a folder from the current system.
   */
  function chooseDirectory() {
    const message = 'fs:choose-directory';

    window.postMessage({
      host: _HOST,
      message: message,
    });

    // Create a new promise for that
    let resolveHandle;
    let rejectHandle;

    // Create a response message
    _responses[message] = {

      // Create a new promise
      promise: new Promise((resolve, reject) => {
        resolveHandle = resolve;
        rejectHandle = reject;
      }),

      // Handles to the resolve and reject
      resolve: resolveHandle,
      reject: rejectHandle, 
    }

    // Respond to the resolution
    _responses[message].promise.then(result => loadDirectories(result));
  }

  /**
   * This function selects a file from the current system.
   */
  function chooseFile() {
    window.postMessage({ 
      host: _HOST,
      message: 'fs:choose-file' 
    });
  }

  /**
   * Loads all the files in the provided folder path into memory.
   * 
   * @param   { string[] }  dirpaths  An array of directory paths.
   */
  function loadDirectories(dirpaths) {
    window.postMessage({
      host: _HOST,
      message: 'fs:load-directories',
      args: [ dirpaths ],
    })
  }

  /**
   * Loads all the files in the provided folder path into memory.
   * 
   * @param   { string[] }  filepaths  An array of filepaths.
   */
  function loadFiles(filepaths) {
    window.postMessage({
      host: _HOST,
      message: 'fs:load-files',
      args: [ filepaths ],
    })
  }

  window.addEventListener('message', e => {
    
    // Parse the message
    const target = e.data?.target ?? '';
    const message = e.data?.message ?? '';
    const result = e.data?.result ?? '';

    // It's not for us
    if(target != 'filepicker')
      return;

    console.log(_responses[message]);

    // Resolve the promise
    _responses[message].resolve(result);
  })

  return (
    <DButton 
      text={`choose ${props.type ?? 'folder'}`}
      action={ props.type == 'file' ? chooseFile : chooseDirectory }>
    </DButton>
  )
}