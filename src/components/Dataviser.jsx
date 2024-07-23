/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-07-23 23:54:37
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';
import { useState } from 'react'

// Chakra
import { Tabs } from '@chakra-ui/react'

// Custom components
import { DTabs } from './DTabs.jsx';
import { DHeader } from './dataviser/DHeader.jsx'

// Import the context of the app
import { DataviserCtx, DataviserManager } from './Dataviser.ctx.js';
import { useWindowDimensions } from '../hooks/useWIndowDimensions.js';

/**
 * Dataviser component class.
 * 
 * @component
 */
export function Dataviser() {

  // Create a variable to hold app state for us 
  const _dataviserState = DataviserCtx.newCtx();
  const _dataviserContext = DataviserCtx.getCtx();

  // Window dimensions
  const { 
    width: _width, 
    height: _height 
  } = useWindowDimensions();
  
  // Header height
  const _headerHeight = _dataviserState.get('headerHeight') * _height;

  // Pass the state to everyone else
  return (
    <_dataviserContext.Provider value={ _dataviserState }>
      <Tabs>
        <DHeader height={ _headerHeight } />
        <DTabs />
      </Tabs>
    </_dataviserContext.Provider>
  )
}
