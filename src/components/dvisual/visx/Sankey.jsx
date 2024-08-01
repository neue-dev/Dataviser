/**
 * @ Author: Mo David
 * @ Create Time: 2024-08-01 22:58:44
 * @ Modified time: 2024-08-01 23:42:37
 * @ Description:
 * 
 * A sankey drawing component.
 */

import * as React from 'react'
import * as d3 from 'd3-sankey'

export function Sankey(props={}) {
  
  // Grab the d3 apis
  const _sankey = d3.sankey;

  // Grab the visual parameters
  const _width = props.width ?? 0;
  const _height = props.height ?? 0;
  const _data = props.data ?? {};
  
  // ! toremove
  const data = {
    nodes: [
        { id: 0, name: "node0" },
        { id: 1, name: "node1" },
        { id: 2, name: "node2" },
        { id: 3, name: "node3" },
    ],
    links: [
        { source: 0, target: 2, value: 2 },
        { source: 1, target: 2, value: 2 },
        { source: 1, target: 3, value: 2 },
    ]
  }
  const MARGIN_X = 10;
  const MARGIN_Y = 10;
  const _sankeyGenerator = _sankey()
    .nodeWidth(26)                  // width of the node in pixels
    .nodePadding(29)                // space between nodes
    .extent([                       // chart area:
      [MARGIN_X, MARGIN_Y],                   // top-left coordinates
      [_width - MARGIN_X, _height - MARGIN_Y],  // botton-right coordinates
    ])
    .nodeId((node) => node.id)      // Accessor function: how to retrieve the id that defines each node. This id is then used for the source and target props of links
    .nodeAlign(d3.sankeyCenter);   

  const { nodes, links } = _sankeyGenerator(data);

  //
  // Draw the nodes
  //
  const allNodes = nodes.map((node) => {
    return (
      <g key={node.index}>
        <rect
          height={node.y1 - node.y0}
          width={_sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          stroke={"black"}
          fill="#a53253"
          fillOpacity={0.8}
          rx={0.9}
        />
      </g>
    );
  });

  //
  // Draw the links
  //
  const allLinks = links.map((link, i) => {
    const linkGenerator = d3.sankeyLinkHorizontal();
    const path = linkGenerator(link);

    return (
      <path
        key={i}
        d={path}
        stroke="#a53253"
        fill="none"
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
