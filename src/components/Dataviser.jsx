/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-07-03 09:05:58
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';
import { useState } from 'react'

// Custom components
import { DLayout } from './dataviser/DLayout.jsx';
import { DHeader } from './dataviser/DHeader.jsx'
import { DVisual } from './dataviser/DVisual.jsx';

// Import the context of the app
import { DataviserCtx, DataviserManager } from './Dataviser.ctx.js';

/**
 * Dataviser component class.
 * 
 * @component
 */
export function Dataviser() {

  // Create a variable to hold app state for us 
  const _dataviserState = DataviserCtx.newCtx();
  const _dataviserContext = DataviserCtx.getCtx();

  // Create an array to store the children of the _dvisuals
  const _header = (<DHeader i="ha" static="true" w="max" h="3" />);

  // ! change this and put the function into another file perhaps
  const _dvisuals = [ _header, ..._dataviserState.dvisuals.map(dvisual => {
    return (<DVisual
      i={ dvisual.id } 
      id={ dvisual.id }
      key={ dvisual.id } 
      title={ dvisual.title }
      
      x={ dvisual.x } y={ dvisual.y } 
      w={ dvisual.w } h={ dvisual.h }/>)
  })];

  // Pass the state to everyone else
  return (
    <_dataviserContext.Provider value={ _dataviserState }>
      <DLayout children={ _dvisuals }> 
      </DLayout>
    </_dataviserContext.Provider>
  )
}
