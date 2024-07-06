/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 10:28:21
 * @ Modified time: 2024-07-06 17:30:59
 * @ Description:
 * 
 * A file that constructs our D3 components.
 */

import * as React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

// D3
import * as d3 from 'd3'

// Custom d3 utils
import '../../d3/d3.sankey'
import '../../d3/d3.lineplot'

// Custom hooks
import { DVisualCtx } from './DVisual.ctx'
import { useD3 } from '../../hooks/useD3'

/**
 * This manages the state of the D3 aspect of the component.
 * 
 * @component 
 */
export const DVisualD3 = function(props={}) {

  // Grab the state of the visual
  const _dvisualState = DVisualCtx.useCtx();
  
  // State variables
  const _id = _dvisualState.get('id');
  const _data = _dvisualState.get('data');
  const _width = parseInt(_dvisualState.get('chartWidth'));
  const _height = parseInt(_dvisualState.get('chartHeight'));
  const _margin = {
    top: props.margin ?? props.mt ?? 25,
    left: props.margin ?? props.ml ?? 50,
    right: props.margin ?? props.mr ?? 25,
    bottom: props.margin ?? props.mb ?? 25,
  };

  // Create a ref to the svg 
  const _svg = useRef(null);

  // Setup the svg
  _svg.current = d3.select('dvisual' + _id).append('svg');

  

  // Make sure we don't render with 0 dimensions
  if(_width <= 0 || _height <= 0)
    return (<></>)


  return (
    <div className={'dvisual' + _id}>
    </div>
  )
}