import * as React from 'react'
import { useState } from 'react'

// Chakra
import { Grid } from '@chakra-ui/react'

// Custom
import { DVisual } from './DVisual.jsx'

export function DVisualManager(props={}) {

  // Stores a list of our current visuals
  const [ dvisuals, setDvisuals ] = useState([]);

  // Creates a new visual which we save
  const createDVisual = function() {
    setDvisuals([ ...dvisuals, {} ]);
  };

  return (
    <Grid onClick={ createDVisual } style={{ backgroundColor: 'red', width: '100px', height: '100px' }}>
      {dvisuals.map(dvisual => <DVisual />)}
    </Grid>
  )
}