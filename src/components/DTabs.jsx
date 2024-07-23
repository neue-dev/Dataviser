/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-23 23:31:48
 * @ Modified time: 2024-07-23 23:47:21
 * @ Description:
 */

import * as React from 'react'

// Chakra
import { Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react'

// Custom components
import { DLayout } from './dataviser/DLayout.jsx'
import { DVisual } from './dvisual/DVisual.jsx'

// State management
import { DataviserCtx, DataviserManager } from './Dataviser.ctx.js';

export function DTabs() {

  // Get the current context
  const _dataviserState = DataviserCtx.useCtx();

  // Create an array to store the children of the _dvisuals
  const _dlayout = _dataviserState.get('dvisuals').map(dvisual => {
    const id = dvisual.id;
    return (<DVisual { ...dvisual } i={ id } key={ id }/>)
  });
  
  return (
    <TabPanels>
      <TabPanel padding={ 0 } margin={ 0 }>
        <DLayout children={ _dlayout }/>
      </TabPanel>
    </TabPanels>
  )
}

export default {
  DTabs,
}