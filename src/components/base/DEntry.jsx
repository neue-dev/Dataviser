/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-07 17:17:43
 * @ Modified time: 2024-06-07 17:27:29
 * @ Description:
 * 
 * Represents a table entry.
 */

// Chakra
import { Container, Center } from '@chakra-ui/react'

export function DEntry(props={}) {
  return (
    <Container>
      <Flex>
        {props.children.map(child => {
          (<Center flex='1'>
            {child}
          </Center>)
        })}
      </Flex>
    </Container>
  )
}

export default DEntry;