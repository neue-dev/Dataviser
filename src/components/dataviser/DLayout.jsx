/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:06:45
 * @ Modified time: 2024-07-02 20:08:25
 * @ Description:
 * 
 * This inherits from the grid layout functional component we installed.
 */

import * as React from 'react';

// React grid layout
import GridLayout from 'react-grid-layout';

// Custom hooks
import { useWindowDimensions } from '../../hooks/useWIndowDimensions'

/**
 * This acts as the grid that holds all our components together.
 * 
 * @component
 */
export function DLayout(props={}) {

  // Get window dimensions and row-col properties from that
  const { width: _width, height: _height } = useWindowDimensions();
  const _rowCount = 15, _colCount = 21;
  const _rowHeight = _height / _rowCount;
  const _colWidth = _width / _colCount;

  // The resize handles we're using
  const _handles = [ 's', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne' ];
  
  // Define the elements in the layout
  const _layout = [];
  
  // For each child in the layout
  props.children.map(child => {

    // Get the props of the child
    const childProps = child.props ?? {};

    // Add a cell to the layout
    _layout.push({
      ...childProps,
      i: childProps.i ?? '',
      x: parseInt(childProps.x) || 0,
      y: parseInt(childProps.y) || 0,
      w: parseInt(childProps.w) || (childProps.w == 'max' ? _colCount : 1),
      h: parseInt(childProps.h) || (childProps.h == 'max' ? _rowCount : 1),

      elem: child,
      resizeHandles: _handles,
    })
  })

  // Create the grid layout
  return (
    <GridLayout className="layout" layout={ _layout } width={ _width } height={ _height } 
      cols={ _colCount } rowHeight={ _rowHeight }>
      
      { _layout.map(child => (
        <div key={ child.i }>
          { props.children[props.children.indexOf(child.elem)] }
        </div>
      ))}
    </GridLayout>
  );
}

