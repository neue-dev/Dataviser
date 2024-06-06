import * as React from 'react'

// Custom
import { DButton } from '../base/DButton.jsx'
import { ClientIPC } from '../../dataviser/ClientIPC.api.js'

/**
 * A component that gives a button the extra functionality to view a specific file
 * 
 * @component
 */
export function FileViewer(props={}) {

  const _HOST = 'fileviewer'

  function requestFiles() {

  }

  return (
    <DButton 
      text="load file"
      action={ requestFiles }>
    </DButton>
  )
}