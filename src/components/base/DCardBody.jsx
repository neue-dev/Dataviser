import * as React from 'react'

// Chakra
import { CardBody } from '@chakra-ui/react'
import { Stack, StackDivider } from '@chakra-ui/react'

/**
 * Creates a composite of the card header offered by Chakra.
 * 
 * @component
 */
export function DCardBody(props={}) {
  return (
    <CardBody>
      <Stack divider={<StackDivider />} spacing={props.spacing ?? "1.5em"}>
        {props.children}
      </Stack>
    </CardBody>
  )
}