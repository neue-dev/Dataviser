/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-09 11:09:03
 * @ Modified time: 2024-08-02 18:57:50
 * @ Description:
 * 
 * Creates a chord chart using the visx library.
 */

import * as React from 'react'
import { useState } from 'react';

// Visx
import { Arc } from '@visx/shape';
import { Group } from '@visx/group'
import { Chord, Ribbon } from '@visx/chord'
import { LinearGradient } from '@visx/gradient';
import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';

// Visual utils
import { VisualFormatter } from '../../visual/visual.formatter'

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
  const _data = props.data ?? [];       // Contains all the data of all the series
  const _width = props.width ?? 0;      // The width of the visual
  const _height = props.height ?? 0;    // The height of the visual
  const _margin = props.margin ?? 50;   // The margins

  // Some properties of the chord plot
  const _centerSize = 20;
  const _outerRadius = Math.min(_width, _height) * 0.5 - (_centerSize + 10);
  const _innerRadius = _outerRadius - _centerSize;
  
  // Create the actual data we want
  const { 
    keys: _chordNames, 
    matrix: _chartData,
  } = VisualFormatter.dfToMatrix(_data, {
    mapper: d => d.y,
    limit: 5,
  });

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
   * Helps us sort the data
   * 
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  // The unfocus events
  const [ _unfocus, _setUnfocus ] = useState([]);

  /**
   * Tooltip for the arcs.
   * 
   * @param {*} event 
   * @param {*} datum 
   */
  function onMouseOverArc(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);

    // Grab the chord info
    const chord = _chordNames[datum.index];
    const chords = document.getElementsByClassName(chord);

    // Grab the array
    const unfocus = _unfocus.filter(() => true);

    // Cancel all pending timeouts
    while(unfocus.length)
      unfocus.pop()()

    // Create new timeouts
    let element = event.target;
    element.setAttribute('filter', 'url(#focus)');
    unfocus.push(() => element.setAttribute('filter', 'url(#unfocus)'));

    // Do it for the chords too
    for(let i = 0; i < chords.length; i++) {
      let element = chords[i]; 
      element.setAttribute('filter', 'url(#focus)'),
      unfocus.push(() => element.setAttribute('filter', 'url(#unfocus)'));
    }

    // Update the state
    _setUnfocus(unfocus);

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

    // Grab the array
    const unfocus = _unfocus.filter(() => true);

    // Cancel all pending timeouts
    while(unfocus.length)
      unfocus.pop()()

    // Cancel the timeout each time
    let element = event.target;
    element.setAttribute('filter', 'url(#focus)');
    unfocus.push(() => element.setAttribute('filter', 'url(#unfocus)'));

    // Update the state
    _setUnfocus(unfocus);

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  }

  /**
   * Automatic cleanup on mouseout.
   * 
   * @param {*} event 
   * @param {*} datum 
   */  
  function onMouseOut(event, datum) {
    
    // Hide the tooltip
    hideTooltip();

    // Clear the colors
    while(_unfocus.length)
      _unfocus.pop()()

    // Clear the array
    _setUnfocus([]);
  }
  
  // Invalid dimensions
  if(_width <= 0 || _height <= 0)
    return (<></>)
  
  return (
    <div style={{ position: 'relative'}}>
      <svg ref={ _containerRef } width={ _width } height={ _height }>
        <filter id="unfocus">
          <feColorMatrix type="saturate" in="SourceGraphic" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1" />
            <feFuncG type="linear" slope="1" />
            <feFuncB type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
        <filter id="focus">
          <feColorMatrix type="saturate" in="SourceGraphic" values="1.0" />
        </filter>
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
                    key={ `key-${key}` }
                    data={ group }
                    innerRadius={ _innerRadius }
                    outerRadius={ _outerRadius }
                    fill={ color }
                    filter={ 'url(#unfocus)' }
                    onMouseOver={ (e) => onMouseOverArc(e, group ) }
                    onMouseLeave={ (e) => onMouseOut(e) }
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
                        key={ `gradient-${sourceKey}-${targetKey}` }
                        width={ _outerRadius * 4 }
                        height={ _outerRadius * 4 }
                        rotate={ -angle }
                        id={ id } from={ sourceColor } to={ targetColor } />
                      <Ribbon
                        className={ `${sourceKey} ${targetKey}` }
                        key={ `ribbon-${sourceKey}-${targetKey}` }
                        chord={ chord }
                        radius={ _innerRadius }
                        fill={ `url("#${id}")` }
                        fillOpacity={0.75}
                        filter={ 'url(#unfocus)' }
                        onMouseOver={ (e) => onMouseOverRibbon(e, chord) }
                        onMouseLeave={ (e) => onMouseOut(e) }/>
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