/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:35:29
 * @ Modified time: 2024-06-07 17:38:32
 * @ Description:
 * 
 * Creates a file table with file entries containing file details.
 */

// Chakra
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer  } from '@chakra-ui/react'

// Custom

export function FileTable(props={}) {
  
  return (
    <TableContainer>
      <Table>
        <TableCaption>
          loaded files
        </TableCaption>
      </Table>
    </TableContainer>
  )
}
