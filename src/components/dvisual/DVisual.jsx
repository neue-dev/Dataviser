/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-15 22:13:05
 * @ Modified time: 2024-07-10 09:44:19
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
import { Container, Skeleton } from '@chakra-ui/react'
import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

// Custom hooks, contexts, and components
import { DVisualCtx, DVisualManager } from './DVisual.ctx'
import { useParentDimensions } from '../../hooks/useParentDimensions.js'
import { DVisualHeader } from './DVisualHeader.jsx'

// Import the charts and all
import { Linechart } from './vsix/Linechart.jsx'

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
  // The timestamp tells the component when updates happen
  const _data = useSelector(ClientDF.dfDataSelector(_id));
  const _timestamp = useSelector(ClientDF.dfTimestampSelector('_'));

  // The dimensions of the visual and margins + paddings
  const [ _width, _setWidth ] = useState(0);
  const [ _height, _setHeight ] = useState(0);
  const _mx = 8, _my = 10;
  const _px = 24, _py = 32;

  // Grab some of the props
  const _title = props.title ?? 'Graph';
  const _subtitle = props.subtitle ?? 'No description.';

  // Container properties
  const _containerWidth = _width - _mx * 2;
  const _containerHeight = _height - _my * 2;
  const _containerStyle = {
    
    background: 'white',
    width: _containerWidth,
    height: _containerHeight,

    paddingLeft: _px, paddingRight: _px,
    paddingTop: _py, paddingBottom: 0,
    marginLeft: _mx, marginRight: _mx,
    marginTop: _my, marginBottom: _my,
  };

  // Chart properties
  const _chartWidth = _containerWidth - _px * 2; 
  const _chartHeight = _containerHeight - _py * 3;

  // Use the parent dimensions
  useParentDimensions(_containerRef, _setWidth, _setHeight);

  // Init the state
  useEffect(() => {
    DVisualManager.init(_dvisualState, {

      // Primary details
      id: _id,
      data: _data,
      title: _title,
      subtitle: _subtitle,
      
      // Dimensions and sizing
      containerWidth: _containerWidth, containerHeight: _containerHeight,
      chartWidth: _chartWidth, chartHeight: _chartHeight,
      mx: _mx, my: _my,
      px: _px, py: _py,
    });
  }, [ _width, _height ]);

  // Our condition for checking if the visual has loaded
  const hasLoaded = () => !(!_data.length && _timestamp);

  // Return the DVisual component
  return (
    <_dvisualContext.Provider value={ _dvisualState }>
      <Container className={ _id } maxW="100vw" ref={ _containerRef } boxShadow="lg" style={ _containerStyle }>
        <DVisualHeader/>  
        <_DVisualSkeleton isLoaded={ hasLoaded() }>
          <Linechart data={ _data } width={ _chartWidth } height={ _chartHeight } />          
        </_DVisualSkeleton>        
      </Container>
    </_dvisualContext.Provider>
  )
}

/**
 * The skeleton we display for our content.
 * 
 * @component 
 */
function _DVisualSkeleton(props={}) {
  
  // Grab the props
  const isLoaded = props.isLoaded ?? true;
  
  // The skeleton
  return (
    <SkeletonText isLoaded={ isLoaded } fadeDuration="1" noOfLines="5" spacing="4" skeletonHeight="2"
      mt={ isLoaded ? 0 : 4 }>
      { props.children }     
    </SkeletonText>
  )
}