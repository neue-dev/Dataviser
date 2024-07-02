/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:06:45
 * @ Modified time: 2024-07-03 06:49:06
 * @ Description:
 * 
 * This inherits from the grid layout functional component we installed.
 */

import * as React from 'react';

// React grid layout
import GridLayout from 'react-grid-layout';

// Custom hooks and contexts
import { useWindowDimensions } from '../../hooks/useWIndowDimensions'
import { DataviserCtx } from '../Dataviser.ctx';

/**
 * This acts as the grid that holds all our components together.
 * 
 * @component
 */
export function DLayout(props={}) {

  // Get the state
  const _dataviserState = DataviserCtx.useCtx();

  // Get window dimensions and row-col properties from that
  const { width: _width, height: _height } = useWindowDimensions();
  const _rowCount = 18, _colCount = 32;
  const _rowHeight = _height / _rowCount;       // The size of each row
  const _colWidth = _width / _colCount;         // The size of each column
  
  const _handles = [ 'sw', 'nw', 'se', 'ne' ];  // The resize handles we're using 
  const _layout = [];                           // Define the elements in the layout
  
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
    <GridLayout className="layout" layout={ _layout } 
      containerPadding={ [0, 0] } margin={ [0, 0] }
      cols={ _colCount } rowHeight={ _rowHeight } 
      width={ _width } height={ _height }>
      
      { _layout.map(child => (
        <div key={ child.i }>
          { props.children[props.children.indexOf(child.elem)] }
        </div>))
      }
    </GridLayout>
  );
}

