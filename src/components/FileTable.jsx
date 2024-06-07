/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:35:29
 * @ Modified time: 2024-06-07 21:02:34
 * @ Description:
 * 
 * Creates a file table with file entries containing file details.
 */

import * as React from 'react'
import { useState } from 'react';

// Chakra
import { Container, Center, Stack, HStack, Spacer } from '@chakra-ui/react'

// Custom
import { ClientFS } from '../dataviser/ClientFS.api'
import { DButton } from './base/DButton.jsx';

export function FileTable(props={}) {

  // Stores the files contained by the table
  const [ files, setFiles ] = useState([]);

  // ! to a better solution instead of listening for a message thats not intended for this component
  window.addEventListener('message', e => {
    if(e.data.target == 'fs')
      setFiles(ClientFS.getRefList());
  });

  // If no files, don't show the table
  if(!files.length)
    return (<></>);
  
  // Display the table with the file contents
  return (
    <Container overflowX="hidden" overflowY="auto" maxHeight="320px">
      <Stack>
        { 
          files.map(file => {

            // Parse the file entry
            // ! fix the filename parsing line; it looks bad
            const id = file.id;
            const filename = file.filepath.split('\\')[file.filepath.split('\\').length - 1];

            // Create the file entry component
            return (
              <HStack p="0" spacing="0em" key={ id }>
                <Center fontSize="0.6em">{ filename }</Center>
                <Spacer />
                <Center fontSize="0.6em"> 
                  <DButton colorScheme="blackAlpha" text="view" size="xs" variant="ghost"></DButton> 
                </Center>
              </HStack>
            )
          }) 
        }
      </Stack>
    </Container>
  )
}
