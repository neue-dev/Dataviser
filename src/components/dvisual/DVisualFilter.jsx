/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-10 03:09:15
 * @ Modified time: 2024-07-13 15:34:57
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
import { useRangeSlider } from '@chakra-ui/react'

// Custom hooks and contexts
import { DVisualFilterCtx, DVisualFilterManager } from './DVisualFilter.ctx'

/**
 * Wraps around the state modified by the filters.
 * 
 * @component 
 */
export function DVisualFilterContainer(props={}) {

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
 * A helper component to wrap our filters with some state.
 * This has no content and only adds the init associated with the filter.
 * 
 * @component 
 */
function _DVisualFilter(props={}) {

  // Use the context
  const _dvisualFilterState = DVisualFilterCtx.useCtx();

  // Some params
  const _name = props.name ?? null;
  const _dataCallback = props.dataCallback ?? (() => (console.log(_name), []));
  const _filterCallback = props.filterCallback ?? null;

  // Register the filter
  useEffect(() => {

    // Register the filter
    DVisualFilterManager.filterCreate(_dvisualFilterState, {
      name: _name,
      dataCallback: _dataCallback,
      filterCallback: _filterCallback,
    })

    // Return a cleanup function that removes the filter
    return () => DVisualFilterManager.filterRemove(_dvisualFilterState, { name: _name });

  }, [])
  
  // Return the wrapped component
  return (<>
    { props.children }
  </>)
}

/**
 * Creates a filter with state that slides between two values.
 * 
 * @component
 */
export function DVisualFilterSlider(props={}) {

  // Use the context
  const _dvisualFilterState = DVisualFilterCtx.useCtx();

  // Grab the props
  const _name = props.name ?? null;
  const _min = props.min ?? 0;      // The minimum value
  const _max = props.max ?? 100;    // The maximum value
  const _step = props.step ?? 1;    // The step size
  const _default = [ _min, _max ];  // The default range

  // The slider state
  const { 
    state: _rangeSliderState,
    actions: _rangeSliderActions,
    getRootProps: _getRootProps,
    getTrackProps: _getTrackProps,
  } = useRangeSlider({ min: _min, max: _max, defaultValue: _default });

  // Execute the associated filter
  if(_name)
    DVisualFilterManager.filterExecute(_dvisualFilterState, {
      name: _name,
      args: { min: _min, max: _max },
    })

  return (
    <_DVisualFilter { ...props }>
      <RangeSlider defaultValue={ _default } min={ _min } max={ _max } step={ _step } { ..._getRootProps() }>
        <RangeSliderTrack { ..._getTrackProps() }>
          <RangeSliderFilledTrack bg="teal.500" />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={ 3 } value={ _rangeSliderState.value[0] } index={ 0 } bg="teal.400"/>
        <RangeSliderThumb boxSize={ 3 } value={ _rangeSliderState.value[1] } index={ 1 } bg="teal.400"/>
      </RangeSlider>
    </_DVisualFilter>
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

