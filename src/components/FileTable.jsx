/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:35:29
 * @ Modified time: 2024-06-07 18:25:28
 * @ Description:
 * 
 * Creates a file table with file entries containing file details.
 */

import * as React from 'react'
import { useState } from 'react';

// Chakra
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Checkbox  } from '@chakra-ui/react'

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
  
  return (
    <TableContainer overflowX="hidden" overflowY="auto" maxHeight="320px">
      <Table variant="striped" scheme="light-gray" size="sm">
        <TableCaption>
          loaded files
        </TableCaption>
        <Thead>
          <Tr>
            <Th>filename</Th>
            <Th>view</Th>
            <Th>select</Th>
          </Tr>
        </Thead>
        <Tbody>
          { 
            files.map(file => {

              // Parse the file entry
              // ! fix the filename parsing line; it looks bad
              const id = file.id;
              const filename = file.filepath.split('\\')[file.filepath.split('\\').length - 1];

              // Create the file entry component
              return (<Tr key={ id }>
                <Td>{ filename }</Td>
                <Td> <DButton colorScheme="blackAlpha" text="view" size="xs" variant="ghost"></DButton> </Td>
                <Td> <Checkbox colorScheme="teal" defaultChecked></Checkbox> </Td>
              </Tr>)
            }) 
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
}
