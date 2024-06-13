import * as React from 'react';
import { useRef } from 'react'

// Chakra
import { Center, background } from '@chakra-ui/react'

// Spring
import { Controller, animated, useSpring } from '@react-spring/web'

/**
 * The startup component contains the prompt we give to the user.
 * It asks them to select a folder or file before we begin the datavis.
 * 
 * @component 
 */
export function StartMenu() {

  // Component state
  let isOpen = useRef(false);

  // Some start menu constants
  const initialWidth = '2vw';
  const defaultWidth = '20vw';

  // Our animations for the component
  const animations = {
    panel: new Controller({ width: defaultWidth, }),
  };

  /**
   * Opens the start menu.
   */
  function open() {
    
    // Prevents glitchy anim
    if(isOpen)
      return;

    animations.panel.start({
      from: { width: initialWidth, },
      to:   { width: defaultWidth, }
    });

    isOpen = true;
  }

  /**
   * Closes the start menu.
   */
  function close() {

    // Prevents glitchy anim
    if(!isOpen)
      return;

    animations.panel.start({
      from: { width: defaultWidth, },
      to:   { width: initialWidth, }
    });

    isOpen = false;
  }

  /**
   * The component JSX.
   */
  return (
    <animated.div
      
      // Styling
      style={{
        height: '100vh',
        background: '#81E6D9',
        ...animations.panel.springs,
      }}

      // Callback
      onMouseLeave={ close }
      onMouseEnter={ open }>
    </animated.div>
  )
}