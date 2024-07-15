/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 06:06:48
 * @ Modified time: 2024-07-15 10:30:33
 * @ Description:
 */

import * as React from 'react'
import { useState } from 'react'

// Chakra
import { Box, Heading, HStack } from '@chakra-ui/react'
import { Button, Text, Tooltip } from '@chakra-ui/react'
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal } from '@chakra-ui/react'

// Icons
import { BiSlider } from 'react-icons/bi'
import { BiExpand } from "react-icons/bi";
import { BiSolidXCircle } from 'react-icons/bi'

// Custom components and contexts
import { DVisualCtx } from './DVisual.ctx'
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx'
import { DVisualFilterSlider, DVisualFilterTags } from './DVisualFilter.jsx'

// Client stuff
import { ClientDF } from '../../client/client.df.js'

// User logic
import { UserLogic } from '../../user/user.logic.js'

/**
 * This contains the edit and remove buttons for the dvisual.
 * 
 * @component 
 */
export const DVisualButtons = function(props={}) {
  return (
    <HStack>
      <_DVisualButtonFilters />
      <_DVisualButtonExpand />
      <_DVisualButtonRemove />
    </HStack>
  )
}

/**
 * The button that lets us edit chart filters.
 * 
 * @component
 */
const _DVisualButtonFilters = function() {

  // The ranges we'll use to filter the data
  const _meta = ClientDF.dfMetaGet();
  const _metaMin = UserLogic.getMetaMin(_meta) ?? {};
  const _metaMax = UserLogic.getMetaMax(_meta) ?? {};
  
  // Compute slider props
  const _minDate = _metaMin.date ?? 0;
  const _maxDate = _metaMax.date ?? 1;
  const _stepDate = (_minDate - _maxDate) / 100;

  // ! remove
  // console.log(_meta, _metaMin, _metaMax)

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
   * Retrieves the metadata stored in the dvisual state.
   * Consider this a selector for the dvisualState.
   * 
   * @param   { State }   state   The current value of dvisualState. 
   * @return  { object }          The metadata from the state. 
   */
  function metaAccessor(state) {
    return state.meta;
  }

  /**
   * The date filter we pass to the slider.
   * // ! move this to user logic file
   * 
   * @param   { object }    d     The metadata to filter. 
   * @param   { object }    args  The args passed to the filter.
   * @return  { boolean }         Whether or not the metadata passed the filter.
   */
  function metaFilter(d, args={}) {
    return d.date >= args.min && d.date <= args.max;
  }

  return (
    <_DPopover 
      label="change chart filters"
      Icon={ BiSlider }
      fontSize='0.5em'
      p='2em'>
      <DVisualFilterSlider 
        name="filter-date-slider" 
        type="values"
        dataCallback={ metaAccessor } filterCallback={ metaFilter } 
        min={ _minDate } max={ _maxDate } step={ _stepDate }
      />
      <DVisualFilterTags 
        name="filter-province-tags"
        label="Select a province."
        suggestions={ suggestions } 
      />
    </_DPopover>
  )
}

/**
 * The button that lets us zoom into a chart and edit its details.
 * 
 * @component
 */
const _DVisualButtonExpand = function() {

  /**
   * Brings up the popup for updating a chart when clicking the pencil.
   */
  function onClickUpdate() {

  }

  return (
    <_DPopover 
      label="expand chart to fullscreen"
      onClick={ onClickUpdate } 
      Icon={ BiExpand }>

      // ! load the isolated version of the chart
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