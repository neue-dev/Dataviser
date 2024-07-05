/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 01:31:00
 * @ Modified time: 2024-07-05 07:50:54
 * @ Description:
 * 
 * This represents the header of the application.
 * It manages the main data we'll be visualizing.
 */

import * as React from 'react'

// Chakra components
import { Heading, Text } from '@chakra-ui/react'
import { Button, Divider, HStack, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';

// Icons
import { BiFolderPlus } from "react-icons/bi";
import { BiFolderOpen } from "react-icons/bi";
import { BiLayerPlus } from "react-icons/bi";
import { BiWindowClose } from "react-icons/bi";

// Redux
import { useSelector } from 'react-redux';

// Client stuff
import { ClientFS } from '../../client/client.fs'
import { ClientDF } from '../../client/client.df'
import { ClientOps } from '../../client/client.ops'

// Our logic
import { ourMetaParser } from '../../our/our'

// Comps and contexts
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx';

/**
 * The header component 
 * 
 * @component
 */
export function DHeader() {

  // Grab the filenames for display, toast for toasting
  const _filenames = useSelector(state => state);
  const _toast = useToast();
  const _dataviserState = DataviserCtx.useCtx();

  /**
   * Prompts the user to select files from their device.
   * Adds the files to the store.
   */
  function addFiles() {

    // Callback options
    const chooseOptions = { type: 'directory' };
    const loadOptions = { encoding: 'utf-8', metaParser: ourMetaParser };

    // Select the files, save them, then load them as dfs
    ClientFS.fileChoose(chooseOptions)(_toast)
      .then(() => ClientFS.fileLoad(loadOptions)(_toast))
      .then(() => ClientDF.dfInit()(_toast))
      .catch((e) => console.error(e))
  }

  /**
   * Evokes a popup that displays the files saved in the store.
   * //! todo
   */
  function viewFiles() {
    console.log(Object.values(_filenames));
  }

  /**
   * Adds a new visualization to our state. 
   * // ! todo
   */
  function addChart() {
    DataviserManager.dvisualCreate(_dataviserState, { 
      title: 'new graph',
    });
  }

  /**
   * Closes the app.
   */
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
        <Heading className="title" mt="0.01em" ml="0.5em" opacity="0.6">dataviser</Heading>
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
    <Button w="10em" h="5.4em" fontSize="0.5rem" onClick={ action }>
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