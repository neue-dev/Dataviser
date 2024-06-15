

import * as React from 'react'
import { useState } from 'react'
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
      name: "A",
      value: 50,
    },
    {
      name: "B",
      value: 20,
    },
    {
      name: "C",
      value: 40,
    },
    {
      name: "D",
      value: 70,
    },
  ]);

  // Properties of the visual
  const width = props.width ?? 960;
  const height = props.height ?? 480;
  const margin = {
    top: props.m ?? props.mt ?? 40,
    left: props.m ?? props.ml ?? 40,
    right: props.m ?? props.mr ?? 40,
    bottom: props.m ?? props.mb ?? 40,
  };

  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  useEffect(() => {

    // Create the svg and the container for the graphics
    const svg = d3
      .select(".dvisual")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(
      data.map(function (d) {
        return d.name;
      })
    );

    y.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ]);

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.name);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("height", function (d) {
        return height - y(d.value);
      });

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));
  }, [data])

  return (
    <div className='dvisual'>
    </div>
  )
}