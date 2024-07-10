/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-10 03:09:15
 * @ Modified time: 2024-07-10 09:42:24
 * @ Description:
 * 
 * This file handles our filters for each visualization.
 */

import * as React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

// React tags
import { ReactTags } from 'react-tag-autocomplete'
import { RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack } from '@chakra-ui/react'

// Custom hooks and contexts
import { DVisualFilterCtx, DVisualFilterManager } from './DVisualFilter.ctx'

/**
 * Wraps around the state modified by the filters.
 * 
 * @component 
 */
export function DVisualFilter(props={}) {

  // Create the context for us
  const _dvisualFilterState = DVisualFilterCtx.newCtx();
  const _dvisualFilterContext = DVisualFilterCtx.getCtx();

  return (
    <_dvisualFilterContext.Provider value={ _dvisualFilterState }>
      { props.children }
    </_dvisualFilterContext.Provider>
  )
}

/**
 * Creates a filter with state that slides between two values.
 * 
 * @component
 */
export function DVisualFilterSlider(props={}) {

  // Use the context
  const _dvisualFilterState = DVisualFilterCtx.useCtx();
  const id = useRef(crypto.randomUUID());

  // Register the filter to the state
  useEffect(() => {

    // Register the filter
    DVisualFilterManager.registerFilter(_dvisualFilterState, { name: id.current });

    // Remove the filter from the state
    return () => DVisualFilterManager.removeFilter(_dvisualFilterState, { name: id.current });
  }, [])
  
  // Grab the props
  const _min = props.min ?? 0;
  const _max = props.max ?? 100;
  const _step = props.step ?? 1;

  return (
    <RangeSlider defaultValue={ [ _min, _max ] } min={ _min } max={ _max } step={ _step }>
      <RangeSliderTrack>
        <RangeSliderFilledTrack bg="teal.500" />
      </RangeSliderTrack>
      <RangeSliderThumb boxSize={ 3 } index={ 0 } bg="teal.400"/>
      <RangeSliderThumb boxSize={ 3 } index={ 1 } bg="teal.400"/>
    </RangeSlider>
  )
}

/**
 * Creates a filter with state that allows selecting different tags.
 * The selection process uses autocomplete too.
 * 
 * @component 
 */
export function DVisualFilterTags(props={}) {

  // Use the context
  const _dvisualFilterState = DVisualFilterCtx.useCtx();
  const id = useRef(crypto.randomUUID());
  
  // The selected tags and the allowed tags
  const [ _selected, _setSelected ] = useState([]);
  const _suggestions = props.suggestions ?? [];
  const _addTagCallback = props.addTagCallback ?? (d => d);
  const _removeTagCallback = props.addTagCallback ?? (d => d);

  // Parse the other props
  const _label = props.label ?? 'Type a selection.';
  const _noOptions = props.noOptions ?? 'No matches.';

  // Register the filter to the state
  useEffect(() => {

    // Register the filter
    DVisualFilterManager.registerFilter(_dvisualFilterState, { name: id.current });

    // Remove the filter from the state
    return () => DVisualFilterManager.removeFilter(_dvisualFilterState, { name: id.current });
  }, [])

  /**
   * Adds a tag to the selected tags.
   * 
   * @param   { object }  newTag  The tag data. 
   */
  function onAddTag(newTag) {

    // Create the new selected
    const newSelected = [ ..._selected, newTag ];

    // Update the state and call the callback
    _setSelected(newSelected);
    _addTagCallback(newSelected);
  }
  
  /**
   * Removes a tag from the selected tags.
   * 
   * @param   { number }  tagIndex  The index of the tag to remove. 
   */
  function onRemoveTag(tagIndex) {

    // Create the new selected
    const newSelected = _selected.filter((e, i) => i != tagIndex);

    // Update the state and call the callback
    _setSelected(newSelected);
    _removeTagCallback(newSelected);
  }

  return (
    <ReactTags 
      labelText={ _label }
      selected={ _selected }
      suggestions={ _suggestions }
      onAdd={ onAddTag }
      onDelete={ onRemoveTag }
      noOptionsText={ _noOptions }
    />
  )
}

export default {
  DVisualFilterSlider,
  DVisualFilterTags,
}

