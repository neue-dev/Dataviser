import * as React from 'react'

// Chakra
import { Button } from '@chakra-ui/react'

export function DButton(props={}) {
  return (
    <Button 
      onClick={props.action}
      colorScheme={props.colorScheme ?? 'teal'} 
      size={props.size ?? 'lg'}
      variant={props.variant ?? 'outline'}
      
      mt={props.mt ?? '0'} 
      pt="0.22em" pb="0.33em">
      
      {props.text}
    </Button>
  )
}