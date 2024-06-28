

import * as React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

import * as d3 from 'd3'

// Chakra
import { Card, Box, Spacer } from '@chakra-ui/react'
import { Button, Text } from '@chakra-ui/react'
import { Divider, HStack, VStack } from '@chakra-ui/react'

/**
 * The DVisual component houses a D3-backed component.
 * 
 * @component 
 */
export function DVisual(props={}) {

  // The dimensions of the visual
  const _width = props.width ?? 480;
  const _height = props.height ?? 360;
  const _padding = props.padding ?? 32;

  // Grab some of the props
  const _title = props.title ?? 'Graph';
  const _subtitle = props.subtitle ?? 'This is a graph about the thing in the thing.';

  return (
    <Card boxShadow="lg" style={{
      width: _width + _padding * 4,
      padding: _padding,
    }}>

      <_DVisualHeader 
        title={ _title } 
        subtitle={ _subtitle }/>
      
      <_DVisualD3 
        width={ _width } 
        height={ _height }
        margin={ _padding }/>
    </Card>
  )
}

/**
 * Defines the header of a visualization.
 * 
 * @component
 */
const _DVisualHeader = function(props={}) {

  // Grab the props
  const _title = props.title ?? '';
  const _subtitle = props.subtitle ?? '';

  return (
    <VStack p="0" m="0" spacing="0" align="left">
      <_DVisualTitle text={ _title } />
      <_DVisualSubtitle text={ _subtitle } />
      
      <HStack pt="0.5rem" pb="0.5rem">
        <_DVisualGizmo />
      </HStack>

      <Divider />
    </VStack>
  );
}

/**
 * The title component for a given visualization.
 * 
 * @component
 */
const _DVisualTitle = function(props={}) {
  const _text = props.text ?? '';

  return (
    <Text fontSize="0.6rem">
      <b>{ _text }</b>
    </Text>
  )
}

/**
 * The subtitle component for a given visualization
 * 
 * @component
 */
const _DVisualSubtitle = function(props={}) {
  const _text = props.text ?? '';

  return (
    <Text fontSize="0.6rem">
      { _text }
    </Text>
  )
}

/**
 * Attaches a gizmo that helps us filter and do other stuff with the graph.
 * 
 * @component 
 */
const _DVisualGizmo = function(props={}) {
  return (
    <Box>
      <Button size="sm" fontSize="0.6rem">
        click me!
      </Button>
    </Box>
  )
}

/**
 * This manages the state of the D3 aspect of the component.
 * 
 * @component 
 */
const _DVisualD3 = function(props={}) {
  const [ styles, setStyles ] = useState({});
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
  const _width = props.width ?? 480;
  const _height = props.height ?? 360;
  const _margin = {
    top: props.margin ?? props.mt ?? 25,
    left: props.margin ?? props.ml ?? 50,
    right: props.margin ?? props.mr ?? 25,
    bottom: props.margin ?? props.mb ?? 25,
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
   * Applies the given styles to the visualization.
   * 
   * @param   { object }  styles  The styles to apply.
   */
  function _visualStyle(styles) {
    
    // Style the text components
    _svg.current
      .selectAll('text')  
      .style('font-size', '0.5rem')

    _svg.current  
      .selectAll('.x-axis')
      .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
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
      .attr('class', 'x-axis')
      .append('g')
      .attr('transform', `translate(0, ${_height})`)
      .call(d3.axisBottom(_scale.x))
      
    // Append the y-axis to the visual
    _svg.current
      .attr('class', 'y-axis')
      .append('g')
      .call(d3.axisLeft(_scale.y))
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

    // Set up the actual visualization
    _visualSetup();
    
    // Define the scale from the data
    _visualScales(data);
    
    // Render the data
    _visualRender(data);

    // Add the styling
    _visualStyle(styles);

  }, [ data, styles ])

  return (
    <div className='dvisual'/>
  )
}