/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-06-29 23:13:25
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';

// Chakra
import { Button, Flex, HStack, Text } from '@chakra-ui/react';

/**
 * Dataviser component class.
 * 
 * @class
 */
export function Dataviser() {
  return (
    <Flex p="2em" placeItems="left">
      <DraftHeader />  
    </Flex>
  )
}

/**
 * A draft header component 
 * 
 * @returns 
 */
function DraftHeader() {
  return (
    <HStack>
      <DraftButton text="add files" />
      <DraftButton text="view files"/>
      <DraftButton text="add charts"/>
    </HStack>
  )
}

/**
 * A draft button component
 * 
 * @param {*} props 
 * @returns 
 */
function DraftButton(props={}) {
  
  // Grab the props
  const text = props.text ?? '';

  return (
    <Button w="10em" h="5em" fontSize="0.8rem">
      <Text>        
        { text }
      </Text>
    </Button>
  )
}