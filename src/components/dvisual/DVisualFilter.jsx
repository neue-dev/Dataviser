/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-10 03:09:15
 * @ Modified time: 2024-07-10 03:27:33
 * @ Description:
 * 
 * This file handles our filters for each visualization.
 */

import * as React from 'react'
import { useState } from 'react'

// React tags
import { ReactTags } from 'react-tag-autocomplete'
import { RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack } from '@chakra-ui/react'

/**
 * Creates a filter with state that slides between two values.
 * 
 * @component
 */
export function DVisualFilterSlider(props={}) {
  
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
  
  // The selected tags and the allowed tags
  const [ _selected, _setSelected ] = useState([]);
  const _suggestions = props.suggestions ?? [];

  // Parse the other props
  const _label = props.label ?? 'Type a selection.';
  const _noOptions = props.noOptions ?? 'No matches.';

  /**
   * Adds a tag to the selected tags.
   * 
   * @param   { object }  newTag  The tag data. 
   */
  function onAddTag(newTag) {
    _setSelected([ ..._selected, newTag ]);
  }
  
  /**
   * Removes a tag from the selected tags.
   * 
   * @param   { number }  tagIndex  The index of the tag to remove. 
   */
  function onRemoveTag(tagIndex) {
    _setSelected(_selected.filter((e, i) => i != tagIndex));
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

