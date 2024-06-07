import * as React from 'react'

// Chakra
import { CardHeader } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'

/**
 * Creates a composite of the card header offered by Chakra.
 * 
 * @component
 */
export function DCardHeader(props={}) {
  return (
    <CardHeader>
      <Heading fontSize={props.fontSize ?? '4xl'} textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
        {props.text}
      </Heading>
    </CardHeader>
  )
}