/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:06:45
 * @ Modified time: 2024-07-03 08:37:05
 * @ Description:
 * 
 * This inherits from the grid layout functional component we installed.
 */

import * as React from 'react';

// React grid layout
import GridLayout from 'react-grid-layout';

// Custom hooks and contexts
import { useWindowDimensions } from '../../hooks/useWIndowDimensions'
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx';

/**
 * This acts as the grid that holds all our components together.
 * 
 * @component
 */
export function DLayout(props={}) {

  // Get the state
  const _dataviserState = DataviserCtx.useCtx();

  // Dimensions and sizing
  const { width: _width, height: _height } = useWindowDimensions();
  const _rowCount = 18, _colCount = 32;         // Row and column counts
  const _rowHeight = _height / _rowCount;       // The size of each row
  const _colWidth = _width / _colCount;         // The size of each column
  
  // Some other params
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

  /**
   * Updates the dvisual components after a drag and drop operation.
   * 
   * @param   { Layout }      layout    The new layout. 
   * @param   { LayoutItem }  oldItem   The properties of the old item.
   * @param   { LayoutItem }  newItem   The properties of the new item.
   */
  function onDragStop(layout, oldItem, newItem) {
    DataviserManager.dvisualUpdate(_dataviserState, newItem)
  }

  // Create the grid layout
  return (
    <GridLayout className="layout" layout={ _layout } 
      containerPadding={ [0, 0] } margin={ [0, 0] }

      // Dimensions and sizing
      cols={ _colCount } rowHeight={ _rowHeight } 
      width={ _width } height={ _height }
      
      // Update the location of the item when drag and dropping
      onDragStop={ onDragStop }>
      
      { _layout.map(child => (
        <div key={ child.i }>
          { props.children[props.children.indexOf(child.elem)] }
        </div>))
      }
    </GridLayout>
  );
}

