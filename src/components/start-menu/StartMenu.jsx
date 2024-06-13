import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';

// Chakra
import { Container, Center, Box, Heading, Button, Stack, Text } from '@chakra-ui/react'

// Spring
import { Controller, animated, useSpring } from '@react-spring/web'

// APIs
import { ClientFS } from '../../client/client.fs'

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
  const initialX = '-12rem';
  const defaultX = '0';

  // Our animations for the component
  const animations = {
    panel: new Controller({ x: defaultX, }),
  };

  /**
   * Opens the start menu.
   */
  function open() {
    
    // Prevents glitchy anim
    if(isOpen)
      return;

    animations.panel.start({
      from: { x: initialX, },
      to:   { x: defaultX, }
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
      from: { x: defaultX, },
      to:   { x: initialX, }
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
        width: '14rem',
        height: '100vh',
        background: '#CCCCCC',
        ...animations.panel.springs,
      }}

      // Callback
      onMouseLeave={ close }
      onMouseEnter={ open }>

      <_StartMenuTitle />
      <_StartMenuButton />
      <_StartMenuFiles />
    </animated.div>
  )
}

/**
 * The start menu title
 * 
 * @component
 */
const _StartMenuTitle = function() {
  return (
    <Box
      px="1.6rem"
      py="3.2rem">
      <Heading
        fontSize="2.5rem">
        dataviser
      </Heading>
    </Box>
  )
}

/**
 * The start menu description
 * 
 * @component 
 */
const _StartMenuButton = function() {
  return (
    <Box px="1.6rem" py="0" my="0">
      <Button 
        onClick={ ClientFS.chooseDirectories }>
        open folder
      </Button>
    </Box>
  )
}

/**
 * Displays the files loaded by the start menu.
 * 
 * @component 
 */
const _StartMenuFiles = function() {

  // Stores the files contained by the table
  const [ files, setFiles ] = useState([]);
  let i = 0;

  // ! to a better solution instead of listening for a message thats not intended for this component
  window.addEventListener('message', e => {
    if(e.data.target == 'fs') {
      setFiles(ClientFS.getRefList());
      i = 0;
    }
  });

  // If no files, don't show the table
  if(!files.length)
    return (<></>);

  return (
    <Container 
      px="3.6rem" py="0" my="2rem" mx="-2rem"
      overflowX="hidden" overflowY="auto" 
      maxHeight="60vh">
      
      <Stack> { 
        files.map(file => {

          // Parse the file entry
          // ! fix the filename parsing line; it looks bad
          const id = file.id;
          const filename = file.filepath.split('\\')[file.filepath.split('\\').length - 1];

          // Create the file entry component
          return (
            <Box key={ id }>
              <Text fontSize="0.5em" fontWeight="400">
                { `${filename}\t(${++i})` }
              </Text>
            </Box>
          )
        }) 
      } </Stack>
    </Container>
  )
}