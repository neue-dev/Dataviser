import * as React from 'react'

// Chakra
import { CardFooter } from '@chakra-ui/react'

/**
 * Creates a composite of the card footer offered by Chakra.
 * 
 * @component
 */
export function DCardFooter(props={}) {
  return (
    <CardFooter>
      {props.children}
    </CardFooter>
  )
}