/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 01:31:00
 * @ Modified time: 2024-07-02 01:54:55
 * @ Description:
 * 
 * This represents the header of the application.
 * It manages the main data we'll be visualizing.
 */

import * as React from 'react'

// Chakra components
import { Button, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';

// Icons
import { BiFolderPlus, BiFolderOpen, BiLayerPlus, BiWindowClose } from "react-icons/bi";

// Redux
import { useSelector } from 'react-redux';

// Client stuff
import { ClientFS } from '../../client/client.fs'
import { ClientDF } from '../../client/client.df'
import { ClientOps } from '../../client/client.ops'

/**
 * The header component 
 * 
 * @returns 
 */
export function DHeader() {

  // Grab the filenames for display, toast for toasting
  const filenames = useSelector(state => state);
  const toast = useToast();

  // The action of the add files button
  function addFiles() {
    ClientFS.fileChoose({ type: 'directory' })(toast)
      .then(() => ClientFS.fileLoad({ encoding: 'utf-8' })(toast))
      .catch((e) => console.error(e))
  }

  // The action of the view files button
  function viewFiles() {
    console.log(Object.values(filenames));
  }

  // The action of the add chart button
  function addChart() {
    console.log('added chart');
  }

  // Closes the app
  function appExit() {
    ClientOps.appExit();
  }

  return (
    <VStack align="left" pb="1.5em">
      <HStack spacing={ 3 } pt="1.5em" pl="2.4em">
        <DHeaderButton text="add files" action={ addFiles } Icon={ BiFolderPlus } />
        <DHeaderButton text="view files" action={ viewFiles } Icon={ BiFolderOpen } />
        <DHeaderButton text="add chart" action={ addChart } Icon={ BiLayerPlus } />
        <DHeaderButton text="exit app" action={ appExit } Icon={ BiWindowClose } />
        <Heading className="title" mt="0.01em" ml="0.5em" opacity="0.7">dataviser</Heading>
      </HStack>
      <Divider orientation="horizontal"/>
    </VStack>
  )
}

/**
 * The header button component
 * 
 * @component
 */
function DHeaderButton(props={}) {
  
  // Grab the props
  const text = props.text ?? '';
  const action = props.action ?? (d => d);
  const Icon = props.Icon ?? (d => (<div />));

  // Create the button
  return (
    <Button w="10em" h="5em" fontSize="0.5rem" onClick={ action }>
      <VStack spacing="0" fontSize="0.6rem" align="left">
        <div style={{ marginBottom: '0.1em', display: 'block' }}> <Icon /> </div>
        <Text fontSize="0.8em"> { text } </Text>
      </VStack>
    </Button>
  )
}

export default {
  DHeader
}