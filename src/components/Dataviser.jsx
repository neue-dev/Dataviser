/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-07-02 01:35:04
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';

// Chakra and others
import { Heading, Text } from '@chakra-ui/react';

// Custom components
import { DLayout } from './dataviser/DLayout.jsx';
import { DHeader } from './dataviser/DHeader.jsx'

/**
 * Dataviser component class.
 * 
 * @class
 */
export function Dataviser() {
  return (
    <DLayout> 
      <DHeader i="ha" static="true" w="max" h="2" />  
      <DVisual i="hmm" w="7" h="4" />
      <DVisual i="smth" w="3" h="5" />
    </DLayout>
  )
}

// ! move this into its own file
import { Container } from '@chakra-ui/react'

function DVisual() {
  return (
    <Container>
      <Heading>
        hmm
      </Heading>
      <Text>
        le quick brown fox jumped over the laxy dog.
      </Text>
    </Container>
  )
}