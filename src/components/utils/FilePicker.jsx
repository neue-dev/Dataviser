import * as React from 'react'

// Custom
import { DButton } from '../base/DButton.jsx'

/**
 * A component that gives a button the extra functionality to select a folder or a file.
 * 
 * @component
 */
export function FilePicker(props={}) {

  /**
   * This function selects a folder from the current system.
   */
  function chooseFolder() {
    window.postMessage({
      message: 'fs:load-directory'
    });
  }

  /**
   * This function selects a file from the current system.
   */
  function chooseFile() {
    window.postMessage({ 
      message: 'fs:load-file' 
    });
  }

  return (
    <DButton 
      text={`choose ${props.type ?? 'folder'}`}
      action={ props.type == 'file' ? chooseFile : chooseFolder }>
    </DButton>
  )
}