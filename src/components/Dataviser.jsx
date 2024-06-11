/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 16:56:26
 * @ Modified time: 2024-06-11 19:21:07
 * @ Description:
 * 
 * The main component that houses the app.
 * Basically App.jsx.
 */

import * as React from 'react';
import { useState } from 'react'

// Custom
import { DataviserContext } from './Dataviser.ctx.jsx'
import { StartMenu } from './start-menu/StartMenu.jsx';

/**
 * Dataviser component class.
 * 
 * @class
 */
export function Dataviser() {
  
  // This is the initial app state
  const _state = {
    showTitle: true
  };
  
  // A handle to that state which React manages for us
  const [ dataviserContext, setDataviserContext ] = useState(_state);

  // Wrap the app in a context provider
  return (
    <DataviserContext.Provider value={ dataviserContext }>
      <div className="dataviser">
        <StartMenu />
      </div>
    </DataviserContext.Provider>
  )
}