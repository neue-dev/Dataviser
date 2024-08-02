/**
 * @ Author: Mo David
 * @ Create Time: 2024-08-01 22:58:44
 * @ Modified time: 2024-08-02 15:05:03
 * @ Description:
 * 
 * A sankey drawing component.
 */

import * as React from 'react'
import * as d3 from 'd3-sankey'

// The dataviser state
import { DataviserCtx, DataviserManager } from '../../Dataviser.ctx';

export function Sankey(props={}) {

  // Grab the state
  const _dataviserState = DataviserCtx.useCtx();
  
  // Grab the d3 apis
  const _sankey = d3.sankey;

  // Grab the visual parameters
  const _width = props.width ?? 0;
  const _height = props.height ?? 0;
  const _data = props.data ?? {};
  // ! remove default value "Chanthaburi"
  const _subject = _dataviserState.get('subject') || "Chanthaburi";

  // The sumdf
  const _sumDf = {}

  // Create the sum df
  _data.forEach(data => {
    const df = data.y
    
    Object.keys(df).forEach(col => {
      Object.keys(df[col]).forEach(row => {
        if(!_sumDf[col]) _sumDf[col] = {};
        if(!_sumDf[col][row]) _sumDf[col][row] = 0;
        
        // Sum them all
        _sumDf[col][row] += df[col][row];
      })
    })
  })

  // The subject index
  const _index = Object.keys(_sumDf).indexOf(_subject);

  // Create the nodes
  const _nodes = [];
  Object.keys(_sumDf).forEach((key, i) => {
    if(i == _index)
      _nodes.push({
        id: i,
        name: key,
      })
    
    if(i >= _index)
      return;
    
    _nodes.push({
      id: i,
      name: key + '-source'
    })
    _nodes.push({
      id: i + 1000,           // ! Get rid of magic number
      name: key + '-target'
    }) 
  })

  // Create the links
  const _links = [];
  Object.keys(_sumDf).forEach((key, i) => {
    if(i >= _index)
      return;
    
    _links.push({
      source: _index,
      target: i + 1000,       // ! Get rid of magic number
                              // ! jusrt save another property in each node / link (im sure d3 wont mind)
      value: _sumDf[_subject][key],
    })
  })
  Object.keys(_sumDf).forEach((key, i) => {
    if(i >= _index)
      return;

    _links.push({
      source: i,
      target: _index,
      value: _sumDf[key][_subject],
    })
  })

  console.log(_nodes);
  console.log(_links)

  // Empty data
  if(_nodes.length <= 0 || _links.length <= 0)
    return (<></>)

  // ! toremove
  const data = {
    nodes: _nodes.length ? _nodes : [],
    links: _links.length ? _links : [],
  }
  const MARGIN_X = 10;
  const MARGIN_Y = 10;
  const _sankeyGenerator = _sankey()
    .nodeWidth(64)                  // width of the node in pixels
    .nodePadding(8)                // space between nodes
    .extent([                       // chart area:
      [MARGIN_X, MARGIN_Y],                   // top-left coordinates
      [_width - MARGIN_X, _height - MARGIN_Y],  // botton-right coordinates
    ])
    .nodeId((node) => node.id)      // Accessor function: how to retrieve the id that defines each node. This id is then used for the source and target props of links
    .nodeAlign(d3.sankeyCenter);   

  const { nodes, links } = _sankeyGenerator(data);

  // Draw the nodes
  const allNodes = nodes.map((node) => {
    return (
      <g key={node.index}>
        <rect
          height={node.y1 - node.y0}
          width={_sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          fill={ DataviserManager.paletteGet(_dataviserState, { key: Object.keys(_sumDf)[node.id % 1000] })}
          fillOpacity={0.8}
          rx={0.9}
        />
      </g>
    );
  });

  // Draw the links
  const allLinks = links.map((link, i) => {
    const linkGenerator = d3.sankeyLinkHorizontal();
    const path = linkGenerator(link);

    return (
      <path
        key={i}
        d={path}
        fill="none"
        stroke={ '#000000' }
        strokeOpacity={0.1}
        strokeWidth={link.width}
      />
    );
  });

  return (
    <svg width={ _width } height={ _height } >
      {allNodes}
      {allLinks}
    </svg>
  )
}

export default {
  Sankey,
}
