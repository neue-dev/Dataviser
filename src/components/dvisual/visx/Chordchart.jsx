/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-07-25 16:44:00
 * @ Description:
 * 
 * Creates a chord chart using the visx library.
 */

import * as React from 'react'

// Visx
import { Arc } from '@visx/shape';
import { Group } from '@visx/group'
import { Chord, Ribbon } from '@visx/chord'
import { LinearGradient } from '@visx/gradient';
import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';

// Dataviser state
import { DataviserCtx, DataviserManager } from '../../Dataviser.ctx';

/**
 * The linechart component.
 * 
 * @component
 */
export function Chordchart(props={}) {

  // Get the state
  const _dataviserState = DataviserCtx.useCtx();

  // Grab the prop
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
  const _sumDf = {};
  const _filteredSumDf = {};
  const _sums = {};
  let _sumArr = [];
  let _chordNames = [];

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

  // Generate row-col sums so we can sort by default
  Object.keys(_sumDf).forEach(col => {
    Object.keys(_sumDf[col]).forEach(row => {
      
      // Init the sums
      if(!_sums[col]) _sums[col] = 0;
      if(!_sums[row]) _sums[row] = 0;

      // Compute the sums
      _sums[col] += _sumDf[col][row];
      _sums[row] += _sumDf[col][row];
    })
  })

  // Sort and filter _sumDf
  _sumArr = Object.keys(_sums)
    .filter(sumKey => sumKey.length)
    .map(sumKey => ({ x: sumKey, y: _sums[sumKey] }))  
  _sumArr.sort((a, b) => b.y - a.y)
  _sumArr.splice(7);
  _sumArr.forEach(sum => {
    const key = sum.x;
    const col = _sumDf[key];

    // Create the filtered df
    _filteredSumDf[key] = {};

    // Add the stuff we need
    Object.keys(col).forEach(row => {
      if(_sumArr.filter(sum => sum.x == row).length)
        _filteredSumDf[key][row] = col[row];
    })
  })

  // Get chord names
  _chordNames = _sumArr.map(s => s.x);

  // Generate the 2d matrix of data
  Object.values(_filteredSumDf).forEach(col => {
    const matRow = [];

    // For each of the row entries
    Object.keys(col).forEach(entry => {
      const index = _sumArr.map(e => e.x).indexOf(entry);

      // Update the row
      matRow[index] = col[entry];
    })

    // Push the constructed row
    _chartData.push(matRow);
  })

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

  /**
   * Tooltip for the arcs.
   * 
   * @param {*} event 
   * @param {*} datum 
   */
  function onMouseOverArc(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  }

  /**
   * Tooltip for the ribbons.
   * 
   * @param {*} event 
   * @param {*} datum 
   */
  function onMouseOverRibbon(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  }

  // Invalid dimensions
  if(_width <= 0 || _height <= 0)
    return (<></>)
  
  return (
    <div style={{ position: 'relative'}}>
      <svg ref={ _containerRef } width={ _width } height={ _height }>
        <Group top={ _height / 2 } left={ _width / 2 }>
          <Chord matrix={ _chartData } padAngle={ 0.05 } sortSubgroups={ descending }>
            {({ chords }) => (
              <g>
                {chords.groups.map((group, i) => {

                  // Grab the key and the color
                  const key = _chordNames[group.index];
                  const color = DataviserManager.paletteGet(_dataviserState, { key });

                  // Create the arc                  
                  return (<Arc
                    key={`key-${i}`}
                    data={group}
                    innerRadius={_innerRadius}
                    outerRadius={_outerRadius}
                    fill={ color }
                    onMouseOver={ (e) => onMouseOverArc(e, group) }
                    onMouseLeave={ hideTooltip }
                  />
                )})}
                {chords.map((chord, i) => {

                  // Grab the keys and the colors
                  const sourceKey = _chordNames[chord.source.index];
                  const targetKey = _chordNames[chord.target.index];
                  const sourceColor = DataviserManager.paletteGet(_dataviserState, { key: sourceKey });
                  const targetColor = DataviserManager.paletteGet(_dataviserState, { key: targetKey });
                  const id = `${chord.source.index}-${chord.target.index}`;
                
                  // Transform components
                  const angle = (chord.target.startAngle + chord.target.endAngle) / 2;

                  return (
                    <>
                      <LinearGradient
                        key={`gradient-${i}`}
                        width={ _outerRadius * 4 }
                        height={ _outerRadius * 4 }
                        rotate={ -angle }
                        id={ id } from={ targetColor } to={ sourceColor } />
                      <Ribbon
                        key={`ribbon-${i}`}
                        chord={chord}
                        radius={_innerRadius}
                        fill={ `url("#${id}")` }
                        fillOpacity={0.75}
                        onMouseOver={ (e) => onMouseOverRibbon(e, chord) }
                        onMouseLeave={ hideTooltip }/>
                    </>)
                })}
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
          {(function() {

            // Grab the data
            const source = tooltipData.source;
            const target = tooltipData.target;
            const index = tooltipData.index;
            const value = tooltipData.value;
            const key = _chordNames[index];
            
            // We're hovering over a group
            if(!source || !target)
              return (
                <>
                  <strong>
                    { key }
                  </strong><br />
                  { value + ' (going out)' }
                </>
              ) 
            
            // Grab source and target details
            const sourceKey = _chordNames[source.index];
            const targetKey = _chordNames[target.index];
            const sourceValue = source.value;
            const targetValue = target.value;
              
            // We're hovering over a ribbon
            return (
              <>
                <strong>
                  { sourceKey } - { targetKey }
                </strong><br />
                {`${sourceKey} => ${targetKey} (${sourceValue})`} <br />
                {`${targetKey} => ${sourceKey} (${targetValue})`}
                </>
            ) 
          })()}
        </_TooltipInPortal>
      )}
    </div>
  )
}