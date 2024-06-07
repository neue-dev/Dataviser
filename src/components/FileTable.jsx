/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:35:29
 * @ Modified time: 2024-06-07 17:57:18
 * @ Description:
 * 
 * Creates a file table with file entries containing file details.
 */

import * as React from 'react'
import { useState } from 'react';

// Chakra
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer  } from '@chakra-ui/react'

export function FileTable(props={}) {

  // Stores the files contained by the table
  const [ files, setFiles ] = useState([]);

  // function addEntries
  
  return (
    <TableContainer overflowX="hidden">
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
              return (<Tr key={file.id}>
                <Td>{ file.name }</Td>
                <Td> test </Td>
                <Td> test </Td>
              </Tr>)
            }) 
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
}
