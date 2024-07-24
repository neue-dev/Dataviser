/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-15 19:37:40
 * @ Modified time: 2024-07-24 13:15:15
 * @ Description:
 * 
 * Our leaflet map for the heat map.
 */

import * as React from 'react';
import { useRef } from 'react';

// Leaflet stuff
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
  
  const _latitude = 15.8700;
  const _longitude = 100.9925;

  // Invalid dimensions
  if(_width <= 0 || _height <= 0)
    return (<></>)

  return ( 
    <MapContainer center={[ _latitude, _longitude ]} zoom={ 5 } ref={ _ref } 
      style={ _containerStyle }>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    </MapContainer>
  );
}

