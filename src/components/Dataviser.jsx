/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-06-14 21:39:12
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';
import { useState } from 'react'
import { useContext } from 'react'

// Chakra
import { Box, Flex, Grid, Stack } from '@chakra-ui/react'
import { Button, Heading } from '@chakra-ui/react'
import { Toast, useToast } from '@chakra-ui/react'

// Custom
import { DataviserContext } from './Dataviser.ctx.jsx'
import { ClientFS } from '../client/client.fs.js'
import { ClientToast } from '../client/client.toast.js'
import ClientIPC from '../client/client.ipc.js';

/**
 * Dataviser component class.
 * 
 * @class
 */
export function Dataviser() {
  
  // This is the initial app state
  const _state = {
    showTitle: true,
    files: [], 
  };

  // Wrap the app in a context provider
  return (
    <DataviserContext.Provider value={ _state }>
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

  // Create the toast object cuz we need to create those
  const _toast = useToast();
  const _state = useContext(DataviserContext);

  /**
   * This function communicates with the main thread.
   * It asks to create a prompt for the user to select a folder.
   * After a folder is chosen, the files inside it are loaded and a reference to these are returned.
   */
  function chooseThenLoadDirectories() {

    // This promise resolves and returns handles to all the loaded files
    const promise = ClientFS.chooseDirectories({ encoding: null });

    // Creates a toast that gives feedback on what happened
    ClientToast.createToast(_toast, {
      promise: promise,
      success: 'Successfully loaded files.',
      failure: 'Could not load files.',
      loading: 'Loading files from selected folder.',
      position: 'bottom-left'
    });
    
    // Store the file references in the app state
    promise.then(result => { 
      _state.files = result;
    })
  }

  /**
   * Convert the loaded binaries into their respective dataframes in memory.
   */
  function processLoadedFiles() {
    // const setInterval(() => ClientFS.requestFiles(ids).then(result => console.log(result)), 1000)
  }

  /**
   * This function displays the files loaded into memory as a modal.
   * 
   * ! to implement
   */
  function viewLoadedFiles() {
    
  }
  
  return (
    <Stack spacing="0">
      <_DataviserHeaderTitle />
      <Flex spacing="0" ml="2.8rem">
        <_DataviserHeaderButton action={ chooseThenLoadDirectories } text="open folder" />
        <_DataviserHeaderButton action={ ClientFS.chooseDirectories } text="view files"/>
        <_DataviserHeaderButton action={ () => {} } text="add visual"/>
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