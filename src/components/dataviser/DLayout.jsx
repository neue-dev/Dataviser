/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:06:45
 * @ Modified time: 2024-07-25 18:07:14
 * @ Description:
 * 
 * This inherits from the grid layout functional component we installed.
 */

import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

// Chakra
import { Tabs, TabList, TabPanel, TabPanels, Container } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

// React grid layout
import GridLayout from 'react-grid-layout';

// Custom hooks and contexts
import { useWindowDimensions } from '../../hooks/useWIndowDimensions'
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx';
import { ClientDF } from '../../client/client.df';
import { useParentDimensions } from '../../hooks/useParentDimensions';

/**
 * This acts as the grid that holds all our components together.
 * 
 * @component
 */
export function DLayout(props={}) {

  // Get the state
  const _dataviserState = DataviserCtx.useCtx();
  const _dvisuals = _dataviserState.get('dvisuals');
  const _toast = useToast();

  // Window dimensions
  const { 
    width: _windowWidth, 
    height: _windowHeight 
  } = useWindowDimensions();

  // The width and height of the layout
  const _width = _dataviserState.get('width') * _windowWidth;
  const _height = _dataviserState.get('height') * _windowHeight;

  // Dimensions and sizing
  const _rowCount = _dataviserState.get('rowCount');                  // Row count
  const _colCount = _dataviserState.get('colCount');                  // Col count
  const _rowHeight = _height / _rowCount;                             // The size of each row
  const _colWidth = _width / _colCount;                               // The size of each column
  
  // Some other params
  const _handles = [ 'sw', 'nw', 'se', 'ne' ];                        // The resize handles we're using 
  const _layout = [];                                                 // Define the elements in the layout
  
  // This subscribes the dvisuals to the store
  useEffect(() => {

    // The list of unsubscribers
    const unsubscribers = [];
    
    // For each child, subscribe to the store
    props.children.map(child => {

      // Grab the child props
      const childProps = child.props;
      const rows = childProps.rows ?? [];               // The rows should be modifiable by the filters
      const cols = childProps.cols ?? [];               // Same here
      const group = childProps.i ?? '_';
      const orient = childProps.orient ?? '';           // Tells us whether we want colsums or rowsums
      const exclude = childProps.exclude ?? [];         // What columns to exclude

      // The child doesn't have an id, we don't do anything with it
      if([ 'NA', 'none', 'NONE', '-' ].includes(group))
        return;

      // Subscribe the child
      unsubscribers.push(ClientDF.dfSubscribeGroup({ group, rows, cols, orient, exclude, toast: _toast }))
    })

    // Return the clean up function
    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    
  }, [ _dvisuals ])

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
    <Container padding={ 0 } margin={ 0 }>
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
    </Container>
  );
}

