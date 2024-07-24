/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-07-24 00:30:47
 * @ Description:
 * 
 * Creates a line chart using the visx library.
 */

import * as React from 'react'

// Visx
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, Tooltip, XYChart } from '@visx/xychart'
import * as Scale from '@visx/scale'

/**
 * The linechart component.
 * 
 * @component
 */
export function Linechart(props={}) {

  // Grab the props
  const _data = props.data;           // Contains all the data of all the series
  const _lines = props.lines ?? [];   // The name of the different series we're plotting
  const _width = props.width ?? 0;    // The width of the visual
  const _height = props.height ?? 0;  // The height of the visual

  // ! put somewhere else
  // Sort the data first
  _data.sort((a, b) => a.x.date - b.x.date);

  // ! remove
  const keys = _data[0] ? Object.keys(_data[0].y) : [];
  
  // The accessors
  // ! Make this come from the parent of Linechart
  const accessors = {
    xAccessor: (d) => new Date(d.x.date).toLocaleDateString(),
  };

  // ! remove
  const createYAccessor = (province) => {
    return (d) => {
      return d.y[keys[province]][0];
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
      <AnimatedLineSeries dataKey={ keys[3] } data={_data} xAccessor={accessors.xAccessor} yAccessor={createYAccessor(3)}/>
      <AnimatedLineSeries dataKey={ keys[4] } data={_data} xAccessor={accessors.xAccessor} yAccessor={createYAccessor(4)}/>
      <AnimatedLineSeries dataKey={ keys[5] } data={_data} xAccessor={accessors.xAccessor} yAccessor={createYAccessor(5)}/>
      {/* <AnimatedLineSeries dataKey={ keys[6] } data={_data} xAccessor={accessors.xAccessor} yAccessor={createYAccessor(6)}/> */}
      <AnimatedLineSeries dataKey={ keys[7] } data={_data} xAccessor={accessors.xAccessor} yAccessor={createYAccessor(7)}/>
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
              {tooltipData.nearestDatum.key}
            </div>
            {accessors.xAccessor(tooltipData.nearestDatum.datum)}
            {', '}
            {''}
          </div>
        )}
      />
    </XYChart>
  )
}