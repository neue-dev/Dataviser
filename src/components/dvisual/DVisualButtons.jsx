/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 06:06:48
 * @ Modified time: 2024-07-10 03:20:36
 * @ Description:
 */

import * as React from 'react'
import { useState } from 'react'

// Chakra
import { Box, Heading, HStack } from '@chakra-ui/react'
import { Button, Text, Tooltip } from '@chakra-ui/react'
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal } from '@chakra-ui/react'
import { RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack } from '@chakra-ui/react'

// Icons
import { BiSlider } from 'react-icons/bi'
import { BiPencil } from 'react-icons/bi'
import { BiSolidXCircle } from 'react-icons/bi'

// Custom components and contexts
import { DVisualCtx } from './DVisual.ctx'
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx'
import { DVisualFilterSlider, DVisualFilterTags } from './DVisualFilter.jsx'

/**
 * This contains the edit and remove buttons for the dvisual.
 * 
 * @component 
 */
export const DVisualButtons = function(props={}) {
  return (
    <HStack>
      <_DVisualButtonFilters />
      <_DVisualButtonUpdate />
      <_DVisualButtonRemove />
    </HStack>
  )
}


/**
 * The button that lets us edit chart details.
 * 
 * @component
 */
const _DVisualButtonFilters = function() {

  // ! remove
  const suggestions = [
    { value: 0, label: 'hi', },
    { value: 1, label: 'perhaps', },
    { value: 2, label: 'another dummy', },
    { value: 3, label: 'dummy', },
    { value: 5, label: 'hello', },
    { value: 6, label: 'suggestion', },
  ]

  /**
   * Brings up the popup for updating a chart when clicking the pencil.
   */
  function onClickFilter() {

  }

  return (
    <_DPopover 
      label="change chart filters"
      onClick={ onClickFilter } 
      Icon={ BiSlider }
      fontSize='0.5em'
      p='2em'>

      date:
      <RangeSlider defaultValue={[120, 240]} min={0} max={300} step={30}>
        <RangeSliderTrack bg='red.100'>
          <RangeSliderFilledTrack bg='tomato' />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0} />
        <RangeSliderThumb boxSize={6} index={1} />
      </RangeSlider>
      <DVisualFilterTags 
        label="Select a province."
        suggestions={ suggestions } />

    </_DPopover>
  )
}

/**
 * The button that lets us edit chart details.
 * 
 * @component
 */
const _DVisualButtonUpdate = function() {

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
const _DVisualButtonRemove = function() {

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