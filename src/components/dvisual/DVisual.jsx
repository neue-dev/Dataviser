/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-15 22:13:05
 * @ Modified time: 2024-07-09 11:46:05
 * @ Description:
 * 
 * A wrapper around our d3 visualizations.
 */

import * as React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

// React redux
import { useSelector } from 'react-redux'

// Chakra
import { Button, Container } from '@chakra-ui/react'

// Custom hooks, contexts, and components
import { DVisualCtx, DVisualManager } from './DVisual.ctx'
import { useParentDimensions } from '../../hooks/useParentDimensions.js'
import { DVisualHeader } from './DVisualHeader.jsx'

// Client stuff
import { ClientDF } from '../../client/client.df.js'

/**
 * The DVisual component houses a D3-backed component.
 * 
 * @component 
 */
export function DVisual(props={}) {

  // The contexts we're using
  const _dvisualState = DVisualCtx.newCtx();
  const _dvisualContext = DVisualCtx.getCtx();

  // Some primary properties of the vis
  const _containerRef = useRef(null);
  const _id = props.id ?? null;

  // The data the component should visualize
  const _data = useSelector(ClientDF.dfSelector(_id));

  // The dimensions of the visual and margins + paddings
  const [ _width, _setWidth ] = useState(0);
  const [ _height, _setHeight ] = useState(0);
  const _mx = 8, _my = 10;
  const _px = 24, _py = 32;

  // Use the parent dimensions
  useParentDimensions(_containerRef, _setWidth, _setHeight);

  // Grab some of the props
  const _title = props.title ?? 'Graph';
  const _subtitle = props.subtitle ?? 'No description.';

  // Compute the other dimensions we need
  const _containerWidth = _width - _mx * 2;
  const _containerHeight = _height - _my * 2;
  const _chartWidth = _containerWidth - _px * 4; 
  const _chartHeight = _containerHeight - _py * 5;

  // Init the state
  useEffect(() => {
    DVisualManager.init(_dvisualState, {

      // Primary details
      id: _id,
      data: _data,
      title: _title,
      subtitle: _subtitle,
      
      // Dimensions and sizing
      cardWidth: _containerWidth, cardHeight: _containerHeight,
      chartWidth: _chartWidth, chartHeight: _chartHeight,
      mx: _mx, my: _my,
      px: _px, py: _py,
    });
  }, [ _width, _height ]);
  
  // Return the DVisual component
  return (
    <_dvisualContext.Provider value={ _dvisualState }>
      <Container className={ _id } maxW="100vw" ref={ _containerRef } boxShadow="lg" style={{

        // Dimensions
        width: _containerWidth,
        height: _containerHeight,
        background: 'white',

        // Add the margins
        paddingLeft: _px, paddingRight: _px,
        paddingTop: _py, paddingBottom: 0,
        marginLeft: _mx, marginRight: _mx,
        marginTop: _my, marginBottom: _my,
      }}>

        <DVisualHeader/>
        <Button onClick={ () => ClientDF.dfLoad({ group: _id})}>
          
        </Button>
        <svg width={ 1000 } height={ 1000 }>
        </svg>
      </Container>
    </_dvisualContext.Provider>
  )
}
