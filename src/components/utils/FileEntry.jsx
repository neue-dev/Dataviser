import * as React from 'react'

// Custom
import { DButton } from '../base/DButton.jsx'
import { ClientIPC } from '../../dataviser/ClientIPC.api.js'

/**
 * A component that represents a file as a single button.
 * 
 * @component
 */
export function FileEntry(props={}) {

  const _HOST = 'fileentry'

  function requestFiles() {

  }

  return (
    <DButton 
      text="file"
      action={ requestFiles }>
    </DButton>
  )
}