/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-07-25 15:19:02
 * @ Description:
 * 
 * Creates a line chart using the visx library.
 */

import * as React from 'react'

// Visx
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, Tooltip, XYChart } from '@visx/xychart'

// Dataviser state
import { DataviserCtx, DataviserManager } from '../../Dataviser.ctx';

/**
 * The linechart component.
 * 
 * @component
 */
export function Linechart(props={}) {

  // Get the dataviser state
  const _dataviserState = DataviserCtx.useCtx();

  // Grab the props
  const _data = props.data;           // Contains all the data of all the series
  const _lines = props.lines ?? [];   // The name of the different series we're plotting
  const _width = props.width ?? 0;    // The width of the visual
  const _height = props.height ?? 0;  // The height of the visual
  const _limit = 7;                   // The maximum number of lines we can plot

  // ! put somewhere else
  // Sort the data first
  _data.sort((a, b) => a.x.date - b.x.date);

  // ! remove
  const keys = _data[0] ? Object.keys(_data[0].y) : [];
  
  console.log(_data, keys)
  
  // The accessors
  // ! Make this come from the parent of Linechart
  const accessors = {
    xAccessor: (d) => new Date(d.x.date).toLocaleDateString(),
  };

  // ! remove
  const createYAccessor = (key) => {
    return (d) => {
      return d.y[key][0];
    }
  }

  // Invalid dimensions
  if(_width <= 0 || _height <= 0)
    return (<></>)

  return (
    <XYChart 
      width={ _width } height={ _height } 
      xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
      <AnimatedAxis orientation="bottom" numTicks={ 4 }/>
      <AnimatedAxis orientation="left" numTicks={ 4 } />
      <AnimatedGrid columns={ false } numTicks={ 4 } />
      {
        keys.map((key, i) => {

          // Don't go beyond limit
          if(i > _limit)
            return (<></>)
          
          // Grab the color for this locale
          let color = DataviserManager.paletteGet(_dataviserState, { key })

          // Return a line for each series we have
          return (<AnimatedLineSeries 
            key={ key }
            dataKey={ key } 
            data={ _data } 
            color={ color }
            stroke={ color }
            xAccessor={ accessors.xAccessor } 
            yAccessor={ createYAccessor(key) }/>)
        })
      }      
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => {
          const key = tooltipData.nearestDatum.key;
          const datum = tooltipData.nearestDatum.datum;
          const color = DataviserManager.paletteGet(_dataviserState, { key });

          return (<div>
            <div style={{ color }}>
              {key}
            </div>
            {createYAccessor(key)(datum)}
            <br />
            <span style={{ fontSize: '0.5em', opacity: 0.5 }}>            
              {accessors.xAccessor(datum)}
            </span>
          </div>)
        }}
      />
    </XYChart>
  )
}