

import * as React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

import * as d3 from 'd3'

// Chakra
import { Box } from '@chakra-ui/react'

/**
 * The DVisual component houses a D3-backed component.
 * 
 * @component 
 */
export function DVisual(props={}) {
  return (
    <Box p="1rem">
      A graph of the great depression
      <_DVisualD3 />
    </Box>
  )
}

/**
 * This manages the state of the D3 aspect of the component.
 * 
 * @component 
 */
function _DVisualD3(props={}) {
  const [ data, setData ] = useState([
    {
      date: new Date('1995-12-17T03:24:00'),
      value: 10,
    },
    {
      date: new Date('1996-12-17T03:24:00'),
      value: 100,
    },
    {
      date: new Date('1997-12-17T03:24:00'),
      value: 500,
    },
    {
      date: new Date('1998-12-17T03:24:00'),
      value: 1250,
    },
  ]);

  // Properties of the visual
  const _width = props.width ?? 960;
  const _height = props.height ?? 480;
  const _margin = {
    top: props.m ?? props.mt ?? 40,
    left: props.m ?? props.ml ?? 40,
    right: props.m ?? props.mr ?? 40,
    bottom: props.m ?? props.mb ?? 40,
  };

  // Creates ths scales
  const _scale = {
    x: d3.scaleBand().range([0, _width]).padding(0.1),
    y: d3.scaleLinear().range([_height, 0]),
  }

  // Create a ref to the svg 
  const _svg = useRef(null);

  /**
   * Initializes the visual.
   */
  function _visualSetup() {

    // Create the svg and the container for the graphics
    _svg.current = d3
      .select('.dvisual')
      .append('svg')
      .attr('width', _width + _margin.left + _margin.right)
      .attr('height', _height + _margin.top + _margin.bottom)
      .append('g')
      .attr('transform', `translate(${_margin.left}, ${_margin.top})`)
  }

  /**
   * Defines the scales for the data.
   * 
   * @param   { object }  data  The data to define scales for. 
   */
  function _visualScales(data) {

    // Define the x-axis
    _scale.x.domain(
      data.map(function (d) {
        return d.date;
      })
    );

    // Define the y-axis
    _scale.y.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ]);

    // Append the x-axis to the visual
    _svg.current
      .append('g')
      .attr('transform', `translate(0, ${_height})`)
      .call(d3.axisBottom(_scale.x));

    // Append the y-axis to the visual
    _svg.current
      .append('g')
      .call(d3.axisLeft(_scale.y));
  }

  /**
   * Generates the data-driven portion of the visual.
   * 
   * @param   { object }  data  The data to visualize. 
   */
  function _visualRender(data) {

    // Add the line
    _svg.current.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return _scale.x(d.date) })
        .y(function(d) { return _scale.y(d.value) })
        )

  }

  useEffect(() => {

    _visualSetup();
    _visualScales(data);
    _visualRender(data);
  }, [data])

  return (
    <div className='dvisual'>
    </div>
  )
}