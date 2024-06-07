import * as React from 'react'

// Custom
import { DButton } from './base/DButton.jsx'
import { ClientIPC } from '../dataviser/ClientIPC.api.js'

/**
 * A component that gives a button the extra functionality to select a folder or a file.
 * 
 * @component
 */
export function FilePicker(props={}) {

  const _HOST = 'filepicker'

  /**
   * This function selects a folder from the current system.
   */
  function chooseDirectories() {
    const message = 'fs:choose-directories';
    const promise = ClientIPC.call(_HOST, message);

    // When the result has been returned, load the dirs
    promise.then(result => loadDirectories(result));
  }

  /**
   * This function selects a file from the current system.
   */
  function chooseFiles() {
    const message = 'fs:choose-files';
    const promise = ClientIPC.call(_HOST, message);

    // When the result has been returned, load the dirs
    promise.then(result => loadFiles(result));
  }

  /**
   * Loads all the files in the provided folder path into memory.
   * 
   * @param   { string[] }  dirpaths  An array of directory paths.
   */
  function loadDirectories(dirpaths) {
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
  function loadFiles(filepaths) {
    const message = 'fs:load-files';
    const args = [ filepaths ];
    const promise = ClientIPC.call(_HOST, message, args);

    // When the result has been returned, load the dirs
    promise.then(result => console.log(result));
  }

  return (
    <DButton 
      text={`choose ${props.type ?? 'folder'}`}
      action={ props.type == 'file' ? chooseFiles : chooseDirectories }>
    </DButton>
  )
}