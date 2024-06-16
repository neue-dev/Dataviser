/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-06-17 01:17:40
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';
import { useContext } from 'react'

// Chakra
import { Box, Flex, Grid, Stack } from '@chakra-ui/react'
import { Button, Heading } from '@chakra-ui/react'
import { Toast, useToast } from '@chakra-ui/react'

// Custom
import { DataviserContext } from './Dataviser.ctx.jsx'
import { DVisual } from './DVisual.jsx';

import { ClientFS } from '../client/client.fs.js'
import { ClientToast } from '../client/client.toast.js'
import { ClientPython } from '../client/client.python.js';

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
          <DVisual />
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
    const promise = ClientFS.chooseDirectories({ encoding: 'csv' });

    // Creates a toast that gives feedback on what happened
    ClientToast.createToast(_toast, {
      promise: promise,
      success: 'Files have been loaded in memory.',
      failure: 'Could not load files.',
      loading: 'Loading files from selected folder.',
      position: 'bottom-left'
    });
    
    // Store the file references in the app state
    promise.then(result => {

      // ! maybe not here?
      convertFilesToDataframes();
    })
  }

  // ! todo jsdoc
  function requestDataframes() {
    ClientPython.requestData(['dicts']).then(out => {
      console.log(out)
    });
  }

  /**
   * Converts the loaded files into dataframes within the Pyodide environment.
   * Creates a toast which reflect the status of the request.
   */
  function convertFilesToDataframes() {

    // Promise for the conversion of the data frames
    let onResolve;
    let onReject;
    const promise = new Promise((resolve, reject) => { 
      onResolve = resolve;
      onReject = reject;
    });

    // Request for files first
    ClientFS.requestFiles().then(result => {
      
      // Save the files
      _state.files = result;

      // Send data to Python so we can manipulate it there
      ClientPython.loadLibrary('df_utils');
      ClientPython.sendData({ files: _state.files });

      // Run the script to convert the file data to dataframes
      // ! put this script elsewhere, make it more systematic
      ClientPython.runScript(`
        import pandas as pd

        dfs = {}
        dicts = {}
        #files_py = files.to_py()
          
        for file in files:
          d = files[file]
          dfs[file] = pd.DataFrame(d)
          dicts[file] = dfs[file].to_dict()
      `)

      // If error occurred, reject promise
      .catch(error => {
        onReject(error);
      })
      
      // If successful, resolve promise
      .then(result => {
        onResolve(result);
      });
    })

    // Creates a toast that gives feedback on what happened
    ClientToast.createToast(_toast, {
      promise: promise,

      success: 'Files were converted into dataframes.',
      failure: 'Error converting files.',
      loading: 'Converting files into dataframes.',
      position: 'bottom-left'
    });
  }

  /**
   * This function displays the files loaded into memory as a modal.
   */
  function viewDataframes() {

    // Promise fpr the request for data
    const promise = ClientPython.requestData(['dicts'])
    
    promise.then(out => {
      console.log(typeof out)
      console.log(out);
    });

    // Creates a toast that gives feedback on what happened
    ClientToast.createToast(_toast, {
      promise: promise,

      success: 'Dataframes are loaded.',
      failure: 'Dataframes are broken.',
      loading: 'Requesting dataframes.',
      position: 'bottom-left'
    });
  }
  
  return (
    <Stack spacing="0">
      <_DataviserHeaderTitle />
      <Flex spacing="0" ml="2.8rem">
        <_DataviserHeaderButton action={ chooseThenLoadDirectories } text="open folder" />
        <_DataviserHeaderButton action={ convertFilesToDataframes } text="generate dfs !remove (only for debug)"/>
        <_DataviserHeaderButton action={ viewDataframes } text="view dataframes"/>
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