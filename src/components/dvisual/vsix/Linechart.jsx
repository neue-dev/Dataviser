/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-07-10 00:54:17
 * @ Description:
 * 
 * Creates a line chart using the visx library.
 */

import * as React from 'react'

// Visx
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, Tooltip, XYChart } from '@visx/xychart'

/**
 * The linechart component.
 * 
 * @component
 */
export function Linechart(props={}) {

  // Grab the props
  const _data = props.data;
  const _width = props.width ?? 0;
  const _height = props.height ?? 0;

  console.log(_data)
  
  // The accessors
  const accessors = {
    xAccessor: (d) => new Date(d.x.date).getTime(),
    yAccessor: (d) => { 
      let keys = Object.keys(d.y);
      return d.y[keys[1]][keys[5]];
    },
  };
  
  return (
    <XYChart 
      width={ _width } height={ _height } 
      xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
      <AnimatedAxis orientation="bottom" />
      <AnimatedGrid columns={false} numTicks={4} />
      <AnimatedLineSeries dataKey="Line 1" data={_data} {...accessors} />
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
            {new Date(accessors.xAccessor(tooltipData.nearestDatum.datum)).toDateString()}
            {', '}
            {accessors.yAccessor(tooltipData.nearestDatum.datum)}
          </div>
        )}
      />
    </XYChart>
  )
}