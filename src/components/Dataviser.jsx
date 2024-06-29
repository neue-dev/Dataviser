/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-06-30 02:11:30
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';

// Chakra
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

// Redux
// ! remoe ?
import { useDispatch, useSelector } from 'react-redux';

// Client stuff
import { FS } from '../client/client.fs'


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

  const filenames = useSelector(state => Object.values(state.fs.filenames));
  const dispatch = useDispatch();
  const toast = useToast();

  function addFiles() {
    FS.chooseDirectories()(toast);
  }

  function viewFiles() {
    console.log(filenames);

    // ! remove this, chain it after chooseDirectories
    FS.loadFiles();
  }

  function addCharts() {
    console.log('added charts');
  }

  return (
    <HStack>
      <DraftButton text="add files" action={ addFiles } />
      <DraftButton text="view files" action={ viewFiles } />
      <DraftButton text="add charts" action={ addCharts } />
    </HStack>
  )
}

/**
 * A draft button component
 * 
 * @component
 */
function DraftButton(props={}) {
  
  // Grab the props
  const text = props.text ?? '';
  const action = props.action ?? (d => d);

  return (
    <Button 
      w="10em" h="5em" 
      fontSize="0.8rem" 
      onClick={ action }>
      
      <Text>        
        { text }
      </Text>
    </Button>
  )
}