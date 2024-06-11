import * as React from 'react';
import { useState } from 'react'

// Chakra
import { Center } from '@chakra-ui/react'

// Spring
import { animated, useSpring } from '@react-spring/web'

// Custom
import { DRevealer } from '../base/DRevealer.jsx';

/**
 * The startup component contains the prompt we give to the user.
 * It asks them to select a folder or file before we begin the datavis.
 * 
 * @component 
 */
export function StartMenu() {
  const [ isOpen, setIsOpen ] = useState(true);

  function open() {
    console.log('opened');
  }

  function close() {
    console.log('closed');
  }

  return (
    <animated.div>
      <DRevealer onHover={ open } onLeave={ close }/>
    </animated.div>
  )
}