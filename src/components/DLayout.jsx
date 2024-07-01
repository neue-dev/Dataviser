/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:06:45
 * @ Modified time: 2024-07-01 23:16:05
 * @ Description:
 * 
 * This inherits from the grid layout functional component we installed.
 */

import * as React from 'react';

// React grid layout
import GridLayout from 'react-grid-layout';

/**
 * This acts as the grid that holds all our components together.
 * 
 * @component
 */
export function DLayout() {
  const _handles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];
  const _layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true,  resizeHandles: _handles },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4, resizeHandles: _handles },
    { i: "c", x: 4, y: 0, w: 1, h: 2, resizeHandles: _handles }
  ];
  const _width = 1920;

  return (
    <GridLayout
      className="layout"
      layout={ _layout }
      cols={8}
      rowHeight={32}
      width={ _width }
    >
      { _layout.map(cell => (<div key={ cell.i }/>)) }
    </GridLayout>
  );
}

