/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-10 03:09:15
 * @ Modified time: 2024-07-10 03:21:01
 * @ Description:
 * 
 * This file handles our filters for each visualization.
 */

import * as React from 'react'
import { useState } from 'react'

// React tags
import { ReactTags } from 'react-tag-autocomplete'

/**
 * Creates a filter with state that slides between two values.
 * 
 * @component
 */
export function DVisualFilterSlider(props={}) {
  
  return (
    <></>
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
  const [ selected, setSelected ] = useState([]);
  const suggestions = props.suggestions ?? [];

  // Parse the other props
  const label = props.label ?? 'Type a selection.';
  const noOptions = props.noOptions ?? 'No matches.';

  /**
   * Adds a tag to the selected tags.
   * 
   * @param   { object }  newTag  The tag data. 
   */
  function onAddTag(newTag) {
    setSelected([ ...selected, newTag ]);
  }
  
  /**
   * Removes a tag from the selected tags.
   * 
   * @param   { number }  tagIndex  The index of the tag to remove. 
   */
  function onRemoveTag(tagIndex) {
    setSelected(selected.filter((e, i) => i != tagIndex));
  }

  return (
    <ReactTags 
      labelText={ label }
      selected={ selected }
      suggestions={ suggestions }
      onAdd={ onAddTag }
      onDelete={ onRemoveTag }
      noOptionsText={ noOptions }
    />
  )
}

export default {
  DVisualFilterSlider,
  DVisualFilterTags,
}

