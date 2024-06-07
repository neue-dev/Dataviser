import * as React from 'react'

// Custom
import { DButton } from './base/DButton.jsx'
import { ClientFS } from '../dataviser/ClientFS.api.js'

/**
 * A component that gives a button the extra functionality to select a folder or a file.
 * 
 * @component
 */
export function FilePicker(props={}) {
  return (
    <DButton 
      text={`choose ${props.type ?? 'folder'}`}
      action={ props.type == 'file' ? ClientFS.chooseFiles : ClientFS.chooseDirectories }>
    </DButton>
  )
}