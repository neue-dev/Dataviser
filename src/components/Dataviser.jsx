/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-07-03 04:22:28
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
import { DataviserContext, DataviserContextInitial } from './Dataviser.ctx.js';

/**
 * Dataviser component class.
 * 
 * @component
 */
export function Dataviser() {

  // Create a variable to hold app state for us 
  const [ _state, _setState ] = useState(DataviserContextInitial);

  // Create an array to store the children of the _dvisuals
  const _header = (<DHeader i="ha" static="true" w="max" h="3" />);
  const _dvisuals = [ _header, ..._state.dvisuals.map(dvisual => {
    return (<DVisual
      i={ dvisual.title } 
      key={ dvisual.title } 
      title={ dvisual.title }
      
      x={ dvisual.x } y={ dvisual.y } 
      w={ dvisual.w } h={ dvisual.h }/>)
  })];

  // Pass the state to everyone else
  return (
    <DataviserContext.Provider value={ _state }>
      <DLayout children={ _dvisuals }> 
      </DLayout>
    </DataviserContext.Provider>
  )
}
