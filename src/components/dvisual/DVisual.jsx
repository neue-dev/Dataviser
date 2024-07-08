/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-15 22:13:05
 * @ Modified time: 2024-07-09 06:19:43
 * @ Description:
 * 
 * A wrapper around our d3 visualizations.
 */

import * as React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

// Redux
import { useSelector } from 'react-redux'

// Chakra
import { Card } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

// Custom hooks and contexts
import { DVisualCtx, DVisualManager } from './DVisual.ctx'
import { DataviserCtx, DataviserManager } from '../Dataviser.ctx.js'
import { useParentDimensions } from '../../hooks/useParentDimensions.js'

// Custom components
import { DVisualHeader } from './DVisualHeader.jsx'

// Client stuff
import { ClientDF } from '../../client/client.df.js'
import { ClientStore } from '../../client/client.store.api.js'

/**
 * The DVisual component houses a D3-backed component.
 * 
 * @component 
 */
export function DVisual(props={}) {

  // The contexts we're using
  const _dvisualState = DVisualCtx.newCtx();
  const _dvisualContext = DVisualCtx.getCtx();
  const _dataviserState = DataviserCtx.useCtx();
  const _toast = useToast();

  // Some primary properties of the vis
  const [ _data, _setData ] = useState(null);
  const _ref = useRef(null);
  const _id = props.id ?? crypto.randomUUID();    // ! make sure this is unique and not generated here
  const _name = props.name ?? '_';

  // The dimensions of the visual,
  const [ _width, _setWidth ] = useState(1000);
  const [ _height, _setHeight ] = useState(1000);
  const _mx = 8, _my = 10;
  const _px = 24, _py = 32;

  // Grab some of the props
  const _title = props.title ?? 'Graph';
  const _subtitle = props.subtitle ?? 'This is a graph about the thing in the thing.';

  // Use the parent dimensions
  useParentDimensions(_ref, _setWidth, _setHeight);

  // Compute the other dimensions we need
  const _cardWidth = _width - _mx * 2;
  const _cardHeight = _height - _my * 2;
  const _chartWidth = _cardWidth - _px * 4; 
  const _chartHeight = _cardHeight - _py * 5;

  // Init the state
  useEffect(() => {
    DVisualManager.init(_dvisualState, {

      // Primary details
      id: _id,
      data: _data,
      title: _title,
      subtitle: _subtitle,
      
      // Dimensions and sizing
      cardWidth: _cardWidth, cardHeight: _cardHeight,
      chartWidth: _chartWidth, chartHeight: _chartHeight,
      mx: _mx, my: _my,
      px: _px, py: _py,
    });
  }, [ _width, _height ]);

  /**
   * Retrieves the data associated with the dvisual instance.
   * Grabs the data from the store based on the group name.
   */
  function updateData() {
    const result = ClientDF.dfGet({ group: _name });
    _setData(result);
  }

  /**
   * Loads the data for the visual.
   */
  function loadData() {
    ClientDF.dfLoad({ group: _name, orient: 'cols' })(_toast)
      .then(() => updateData())
  }
  
  // Return the DVisual component
  return (
    <_dvisualContext.Provider value={ _dvisualState }>
      <Card className={ _id } ref={ _ref } boxShadow="lg" style={{

        // Dimensions
        width: _cardWidth,
        height: _cardHeight,

        // Add the margins
        paddingLeft: _px, paddingRight: _px,
        paddingTop: _py, paddingBottom: 0,
        marginLeft: _mx, marginRight: _mx,
        marginTop: _my, marginBottom: _my,
      }}>

        <DVisualHeader/>
        <Button onClick={ loadData }> { 
          // ! remove 
          // ! this should happen automatically after a graph is created, ORR prompt user for data if no files
          // ! otherwise, it should also only happen when the refresh button is clicked
          'load dfs'
        } </Button>
      </Card>
    </_dvisualContext.Provider>
  )
}
