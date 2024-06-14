/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-06-14 19:15:43
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';
import { useState } from 'react'

// Chakra
import { Box, Button, Flex, Grid, Heading, Stack } from '@chakra-ui/react'

// Custom
import { DataviserContext } from './Dataviser.ctx.jsx'
import { ClientFS, ClientToast } from '../client/client.fs.js'

/**
 * Dataviser component class.
 * 
 * @class
 */
export function Dataviser() {
  
  // This is the initial app state
  const _state = {
    showTitle: true
  };
  
  // A handle to that state which React manages for us
  const [ dataviserContext, setDataviserContext ] = useState(_state);

  // Wrap the app in a context provider
  return (
    <DataviserContext.Provider value={ dataviserContext }>
      <div className="dataviser">
        <_DataviserHeader />
        <Grid>
          
        </Grid>
      </div>      
    </DataviserContext.Provider>)
}

/**
 * Contains the header of the app.
 * 
 * @component
 */
const _DataviserHeader = function() {

  // ! todo
  // ! make sure chooseDirectories returns a promise
  // ! use toast to indicate progress of promise
  
  return (
    <Stack spacing="0">
      <_DataviserHeaderTitle />
      <Flex spacing="0" ml="2.8rem">
        <_DataviserHeaderButton action={ ClientFS.chooseDirectories } text="open folder" />
        <_DataviserHeaderButton action={ ClientFS.chooseDirectories } text="view files"/>
      </Flex>
    </Stack>)
}

/**
 * Holds the title information of the app.
 * 
 * @component
 */
const _DataviserHeaderTitle = function() {
  return (
    <Box px="2.8rem" pt="2.1rem">
      <Heading fontSize="3.2rem">
        Dataviser
      </Heading>
    </Box>)
}

/**
 * Creates a button within the header.
 * 
 * @component
 */
const _DataviserHeaderButton = function(props={}) {

  // Grab stuff from the props
  const action = props.action ?? (e => e);
  const style = props.style ?? {};
  const text = props.text ?? 'button';

  // Create the button
  return (
    <Box pr="0.5rem" mt="-0.25rem" pb="0.8rem">
      <Button 
        pt="0.4rem" pb="0.45rem"
        variant="outline" 
        fontSize="0.5rem"
        size="xs"

        // CSS and JS
        style = {{ ...style }}
        onClick={ action }>
        { text }
      </Button>
    </Box>)
}

export default {
  Dataviser
}