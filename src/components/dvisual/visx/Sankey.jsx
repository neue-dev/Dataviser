/**
 * @ Author: Mo David
 * @ Create Time: 2024-08-01 22:58:44
 * @ Modified time: 2024-08-01 23:25:53
 * @ Description:
 * 
 * A sankey drawing component.
 */

import * as React from 'react'

import * as d3 from 'd3';

export function Sankey(props={}) {
  
  // Grab the d3 apis
  const _sankey = d3.sankey;

  // Grab the visual parameters
  const _width = props.width ?? 0;
  const _height = props.height ?? 0;
  const _data = props.data ?? {};

  
  return (
    <div width={ _width } height={ _height } >

    </div>
  )
}

export default {
  Sankey,
}
