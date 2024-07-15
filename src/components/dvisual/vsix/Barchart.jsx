/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-07-15 15:21:19
 * @ Description:
 * 
 * Creates a bar chart using the visx library.
 */

import * as React from 'react'

// Visx
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import * as Scale from '@visx/scale'

/**
 * The linechart component.
 * 
 * @component
 */
export function Barchart(props={}) {

  // Grab the props
  // const _data = props.data;           // Contains all the data of all the series
  const _width = props.width ?? 0;    // The width of the visual
  const _height = props.height ?? 0;  // The height of the visual

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


  // ! remove
  const _data = [
    { x: 10, y: 12 },
    { x: 20, y: 32 },
    { x: 30, y: 42 },
    { x: 40, y: 17 },
    { x: 50, y: 25 },
    { x: 60, y: 11 },
    { x: 70, y: 48 },
  ];

  // scales, memoize for performance
  const xScale = Scale.scaleBand({
    range: [0, _width],
    round: true,
    domain: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    padding: 0.4,
  })

  const yScale = Scale.scaleLinear({
    range: [0, _height],
    round: true,
    domain: [0, 50],
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
  
  return (
    <>
      <svg ref={ _containerRef } width={ _width } height={ _height }>
        <Group>
          {_data.map((d) => {

            const barWidth = xScale.bandwidth();
            const barHeight = yScale(d.y);
            const barX = xScale(d.x);
            const barY = _height - barHeight;
            return (
              <Bar
                key={`bar-${d.x}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
                onMouseOver={ onMouseOver }
                onMouseOut={ hideTooltip }
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        <_TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          Data value <strong>{tooltipData}</strong>
        </_TooltipInPortal>
      )}
    </>
  )
}