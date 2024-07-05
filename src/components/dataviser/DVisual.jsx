/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-15 22:13:05
 * @ Modified time: 2024-07-06 06:01:11
 * @ Description:
 * 
 * A wrapper around our d3 visualizations.
 */

import * as React from 'react'
import { useState } from 'react'
import { useRef } from 'react'

// Redux
import { useSelector } from 'react-redux'

// Chakra
import { Card, Box, Flex, Spacer, Tooltip, Heading } from '@chakra-ui/react'
import { Button, Text } from '@chakra-ui/react'
import { Divider, HStack, VStack } from '@chakra-ui/react'
import { Popover, Portal, PopoverTrigger } from '@chakra-ui/react'
import { PopoverBody, PopoverContent } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

// Icons
import { BiSlider } from 'react-icons/bi'
import { BiPencil } from 'react-icons/bi'
import { BiSolidXCircle } from 'react-icons/bi'

// Custom components
import { DVisualD3 } from './DVisualD3.jsx'

// Custom hooks and contexts
import { DVisualCtx, DVisualManager } from './DVisual.ctx'
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx'
import { useParentDimensions } from '../../hooks/useParentDimensions'

// Client stuff
import { ClientDF } from '../../client/client.df.js'
import { ClientStore } from '../../client/client.store.api.js'

/**
 * The DVisual component houses a D3-backed component.
 * 
 * @component 
 */
export function DVisual(props={}) {

  // The contexts we're using
  const _dvisualState = DVisualCtx.newCtx();
  const _dvisualContext = DVisualCtx.getCtx();
  const _dataviserState = DataviserCtx.useCtx();
  const _toast = useToast();

  // Some primary properties of the vis
  const [ _data, _setData ] = useState(null);
  const _ref = useRef(null);
  const _id = props.id ?? '';
  const _name = props.name ?? '_';

  // The dimensions of the visual,
  const [ _width, _setWidth ] = useState(0);
  const [ _height, _setHeight ] = useState(0);
  const _mx = 8, _my = 10;
  const _px = 24, _py = 32;

  // Grab some of the props
  const _title = props.title ?? 'Graph';
  const _subtitle = props.subtitle ?? 'This is a graph about the thing in the thing.';

  // Use the parent dimensions
  useParentDimensions(_ref, _setWidth, _setHeight);

  // Compute the other dimensions we need
  const _cardWidth = _width - _mx * 2;
  const _cardHeight = _height - _my * 2;
  const _chartWidth = _cardWidth - _px * 4; 
  const _chartHeight = _cardHeight - _py * 5;

  // Init the state
  DVisualManager.init(_dvisualState, {

    // Primary details
    id: _id,
    data: _data,
    title: _title,
    subtitle: _subtitle,
    
    // Dimensions and sizing
    cardWidth: _cardWidth, cardHeight: _cardHeight,
    chartWidth: _chartWidth, chartHeight: _chartHeight,
    mx: _mx, my: _my,
    px: _px, py: _py,
  });

  /**
   * Retrieves the data associated with the dvisual instance.
   * Grabs the data from the store based on the group name.
   */
  function updateData() {
    const result = ClientDF.dfGet({ group: _name });
    _setData(result);
  }

  /**
   * Loads the data for the visual.
   */
  function loadData() {
    ClientDF.dfLoad({ group: _name })(_toast)
      .then(() => updateData())
  }
  
  // Return the DVisual component
  return (
    <_dvisualContext.Provider value={ _dvisualState }>
      <Card className={ _id } ref={ _ref } boxShadow="lg" style={{

        // Dimensions
        width: _cardWidth,
        height: _cardHeight,

        // Add the margins
        paddingLeft: _px, paddingRight: _px,
        paddingTop: _py, paddingBottom: 0,
        marginLeft: _mx, marginRight: _mx,
        marginTop: _my, marginBottom: _my,
      }}>

        <_DVisualHeader/>
        <Button onClick={ loadData }> { 
          // ! remove 
          // ! this should happen automatically after a graph is created, ORR prompt user for data if no files
          // ! otherwise, it should also only happen when the refresh button is clicked
          'load dfs'
        } </Button>
        <DVisualD3 />
      </Card>
    </_dvisualContext.Provider>
  )
}

/**
 * Defines the header of a visualization.
 * 
 * @component
 */
const _DVisualHeader = function(props={}) {

  // Get the state of the visual
  const _dvisualState = DVisualCtx.useCtx();
  const _title = _dvisualState.get('title');
  const _subtitle = _dvisualState.get('subtitle');

  return (
    <VStack align="left">
      <Flex>
        <VStack p="0" m="0" mr="1em" spacing="0" align="left">
          <_DVisualTitle text={ _title } />
          <_DVisualSubtitle text={ _subtitle } />
        </VStack>
        <Spacer />
        <_DVisualTitleButtons />
      </Flex>
      <Divider />
    </VStack> 
  );
}

/**
 * The title component for a given visualization.
 * 
 * @component
 */
const _DVisualTitle = function(props={}) {
  const _text = props.text ?? '';

  return (
    <b><Heading fontSize="1rem">
      { _text }
    </Heading></b>
  )
}

/**
 * The subtitle component for a given visualization
 * 
 * @component
 */
const _DVisualSubtitle = function(props={}) {
  const _text = props.text ?? '';

  return (
    <Text fontSize="0.5rem">
      { _text }
    </Text>
  )
}

/**
 * This contains the edit and remove buttons for the dvisual.
 * 
 * @component 
 */
const _DVisualTitleButtons = function(props={}) {
  return (
    <HStack>
      <_DVisualTitleButtonFilter />
      <_DVisualTitleButtonUpdate />
      <_DVisualTitleButtonRemove />
    </HStack>
  )
}

/**
 * The button that lets us edit chart details.
 * 
 * @component
 */
const _DVisualTitleButtonFilter = function() {

  /**
   * Brings up the popup for updating a chart when clicking the pencil.
   */
  function onClickFilter() {

  }

  return (
    <_DPopover 
      label="change chart filters"
      onClick={ onClickFilter } 
      Icon={ BiSlider }>
      insert filters here
    </_DPopover>
  )
}

/**
 * The button that lets us edit chart details.
 * 
 * @component
 */
const _DVisualTitleButtonUpdate = function() {

  /**
   * Brings up the popup for updating a chart when clicking the pencil.
   */
  function onClickUpdate() {

  }

  return (
    <_DPopover 
      label="edit chart details"
      onClick={ onClickUpdate } 
      Icon={ BiPencil }>

      <Heading fontSize="1rem">title</Heading>
      <Text fontSize="0.5rem">subtitle</Text>
    </_DPopover>
  )
}

/**
 * The button for removing the current visual.
 * 
 * @component
 */
const _DVisualTitleButtonRemove = function() {
  const _dataviserState = DataviserCtx.useCtx();
  const _dvisualState = DVisualCtx.useCtx();
  const _id = _dvisualState.get('id');

  /**
   * Removes the visual from the dataviser state object.
   */
  function onClickRemove() {
    DataviserManager.dvisualRemove(_dataviserState, { id: _id });
  }

  return (
    <Tooltip label="remove chart" fontSize="xs">
      <Button size="sm" variant="ghost" colorScheme="red" onClick={ onClickRemove }>
        <BiSolidXCircle />
      </Button>
    </Tooltip>
  )
}

/**
 * A template for popover components.
 * 
 * @component
 */
const _DPopover = function(props={}) {

  // Grab the props
  const onClick = props.onClick ?? (d => d);
  const Icon = props.Icon ?? (d => (<div />));
  const label = props.label ?? '';

  // Return the popover
  return (
    <Popover>
      <Tooltip label={ label } fontSize="xs">
        <Box><PopoverTrigger>
          <Button size="sm" onClick={ onClick }>
            <Icon />
          </Button>
        </PopoverTrigger></Box>
      </Tooltip>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            { props.children }
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}