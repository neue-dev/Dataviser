import * as React from 'react'

// Chakra
import { Text } from '@chakra-ui/react'

// Custom
import { DButton } from './base/DButton.jsx'
import { DEntry } from './base/DEntry.jsx'
import { ClientIPC } from '../client/client.ipc.js'

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
    <DEntry>
      <DButton text="test"></DButton>
      <Text> hello world </Text>
    </DEntry>
  )
}