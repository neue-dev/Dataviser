/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-07-15 17:49:20
 * @ Description:
 * 
 * Creates a chord chart using the visx library.
 */

import * as React from 'react'

// Visx
import { Arc } from '@visx/shape';
import { Group } from '@visx/group'
import { Chord, Ribbon } from '@visx/chord'
import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import * as Scale from '@visx/scale'

/**
 * The linechart component.
 * 
 * @component
 */
export function Chordchart(props={}) {

  // Grab the props
  const _data = props.data;             // Contains all the data of all the series
  const _width = props.width ?? 0;      // The width of the visual
  const _height = props.height ?? 0;    // The height of the visual
  const _margin = props.margin ?? 50;   // The margins

  // Some properties of the chord plot
  const _centerSize = 20;
  const _outerRadius = Math.min(_width, _height) * 0.5 - (_centerSize + 10);
  const _innerRadius = _outerRadius - _centerSize;
  
  // Create the actual data we want
  const _chartData = []
  const _sumDf = {}

  // Create the sum df
  _data.forEach(data => {
    const df = data.y
    
    Object.keys(df).forEach(col => {
      Object.keys(df[col]).forEach(row => {
        if(!_sumDf[col]) _sumDf[col] = {};
        if(!_sumDf[col][row]) _sumDf[col][row] = 0;
        
        // Sum them all
        _sumDf[col][row] += df[col][row];
      })
    })
  })

  // Generate the 2d matrix of data
  Object.values(_sumDf).forEach(col => {
    _chartData.push(Object.values(col))
  })

  console.log(_chartData)

  // Tooltip state
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef: _containerRef, TooltipInPortal: _TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  })

  /**
   * For the tooltip.
   * 
   * @param   { Event }   event 
   * @param   { object }  datum 
   */
  const onMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event);

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  };

  /**
   * Helps us sort the data
   * 
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }
  
  return (
    <div style={{ position: 'relative'}}>
      <svg ref={ _containerRef } width={ _width } height={ _height }>
        <Group top={ _height / 2 } left={ _width / 2 }>
          <Chord matrix={ _chartData } padAngle={ 0.05 } sortSubgroups={ descending }>
            {({ chords }) => (
              <g>
                {chords.groups.map((group, i) => (
                  <Arc
                    key={`key-${i}`}
                    data={group}
                    innerRadius={_innerRadius}
                    outerRadius={_outerRadius}
                    fill={'#808080'}
                  />
                ))}
                {chords.map((chord, i) => (
                  <Ribbon
                    key={`ribbon-${i}`}
                    chord={chord}
                    radius={_innerRadius}
                    fill={'#aaaaaa'}
                    fillOpacity={0.75}
                  />
                ))}
              </g>
            )}
          </Chord>
        </Group>
      </svg>
      {tooltipOpen && (
        <_TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <strong>{tooltipData.x}</strong><br />
          {tooltipData.y}
        </_TooltipInPortal>
      )}
    </div>
  )
}