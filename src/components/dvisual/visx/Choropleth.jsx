/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-15 19:37:40
 * @ Modified time: 2024-08-03 17:02:50
 * @ Description:
 * 
 * Our leaflet map for the heat map.
 */

import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

// d3
import * as d3 from 'd3';

// Leaflet stuff
import L from 'leaflet'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import thai geojson
import { ThaiGeoJson } from '../../../user/thai-geodata'
import { VisualFormatter } from '../../visual/visual.formatter';

export function Choropleth(props={}) {
  
  const _ref = useRef(null);            // The map component ref
  const _data = props.data;             // Contains all the data of all the series
  const _width = props.width ?? 0;      // The width of the visual
  const _height = props.height ?? 0;    // The height of the visual
  const _margin = props.margin ?? 25;   // The margins

  // Style of the container
  const _containerStyle = {
    width: _width + 'px',
    height: _height - _margin + 'px',
  };
  
  // The center of the map
  const _latitude = 15.8700;
  const _longitude = 100.9925;

  // Color scale
  const _minColor = 'blue';
  const _maxColor = 'red';
  const _colorScale = d3.scaleLinear()
    .domain([0, 1])
    .range([ _minColor, _maxColor ])

  // Compute row and col sums
  const _rowSums = VisualFormatter.dfToRowSums(_data, { mapper: d => d.y });
  const _colSums = VisualFormatter.dfToColSums(_data, { mapper: d => d.y });

  /**
   * Returns the key associated with a given feature.
   * 
   * @param   { Feature }   feature   The feature to inspect.
   * @return  { String }              The key associated with the feature.
   */
  function keyAccessor(feature) {
    return feature.properties.pro_en;
  }
  
  /**
   * Sets the style of the feature.
   * 
   * @param   { Feature }   feature   The feature to style.
   */
  function setStyle(feature) {

    // Grab the key
    const scalar = 10;
    const key = keyAccessor(feature);
    const value = (_rowSums[key] ?? 0) / _rowSums.max;
    const color = _colorScale(value * scalar);

    return {

      // The stroke color
      color: 'black',
      weight: 0.25,

      // The shape color
      fillColor: color,
      fillOpacity: 0.5,
    }
  }

  // Invalid dimensions
  if(_width <= 0 || _height <= 0)
    return (<></>)

  return ( 
    <div position="relative" onMouseDown={ e => e.stopPropagation() }>
      <MapContainer 
        center={[ _latitude, _longitude ]} zoom={ 5 } ref={ _ref } 
        width={ _width } height={ _height }
        style={ _containerStyle }>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <GeoJSON 
          data={ ThaiGeoJson }
          style={ (feature) => setStyle(feature) } 
          
          />
      </MapContainer>
    </div>
  );
}

