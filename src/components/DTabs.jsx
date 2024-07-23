/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-23 23:31:48
 * @ Modified time: 2024-07-24 00:21:27
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
  const _doverview = _dataviserState.get('dvisuals')
    .filter(dvisual => dvisual.class == 'overview')
    .map(dvisual => (<DVisual { ...dvisual } i={ dvisual.id } key={ dvisual.id }/>));

  // Create an array to store the children of the _dvisuals
  const _dregional = _dataviserState.get('dvisuals')
    .filter(dvisual => dvisual.class == 'regional')
    .map(dvisual => (<DVisual { ...dvisual } i={ dvisual.id } key={ dvisual.id }/>));
  
  return (
    <TabPanels>
      <TabPanel padding={ 0 } margin={ 0 }>
        <DLayout children={ _doverview }/>
      </TabPanel>
      <TabPanel padding={ 0 } margin={ 0 }>
        <DLayout children={ _dregional }/>
      </TabPanel>
    </TabPanels>
  )
}

export default {
  DTabs,
}