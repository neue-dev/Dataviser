/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-07-02 19:49:12
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
import { DVisual } from './DVisual.jsx';

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
