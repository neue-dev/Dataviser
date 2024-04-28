/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-25 13:22:47
 * @ Modified time: 2024-04-28 12:29:11
 * @ Description:
 * 
 * A class that interacts with d3.
 * This helps us store state about data presentations, and makes it easier to thematize all our data.
 */

import './Datagraph.class.css'
import d3 from '../libs/d3.v7.min.js'

/**
 * A constructor function for the datagraph class.
 * 
 * @param   { object }      options   Options for initializing the data graph. 
 * @param   { string }      title     The title of the graph.
 * @param   { data }        data      The data bound to the graph.
 * @return  { Datagraph }             The created instance.
 */
export function Datagraph(title, data, options={}) {

  // Metadata
  this.id = '_' + crypto.randomUUID();
  this.parent = options.parent ?? document.body;

  // The important stuff
  this.title = title;
  this.data = data;

  return this;
}

/**
 * Initializes the data graph.
 * Initializes the svg we use to create representations.
 * 
 * @param   { object }      options   The options for initialization.
 * @return  { Datagraph }             The modified instance.
 */
Datagraph.prototype.init = function(options={}) {

  // Some constants
  this.width = this.parent.getBoundingClientRect().width * 0.84;
  this.height = this.parent.getBoundingClientRect().height * 0.84;
  this.margins = {
    top: 96, bottom: 160,
    left: 72, right: 0,
  };

  // Set the width and height
  this.width -= this.margins.right;
  this.height -= this.margins.bottom;

  // Refers to the access point where we add stuff
  this.canvas = d3.select(this.parent)

    // The svg component with class 'this.id'
    .append('svg')
    .classed(this.id, true)
    .classed('datagraph', true)
    .attr('width', this.width + this.margins.left + this.margins.right)
    .attr('height', this.height + this.margins.top + this.margins.bottom)

    // The frame within the svg where we add stuff
    .append('g')
    .attr('width', this.width)
    .attr('height', this.height)
    .style('transform', `translate(${this.margins.left}px, ${this.margins.top}px)`)

  // Add the title and subtitle
  this.addTitle(title);

  return this;
}

/**
 * Configures the svg.
 * 
 * @param   { string }      title     The title of the graph.
 * @param   { object }      options   Options for rendering the title.
 * @return  { Datagraph }             The modified instance. 
 */
Datagraph.prototype.addTitle = function(title, options={}) {
  this.canvas 
    .append('text')
    .classed('datagraph-title', true)
    .text(title)

  return this;
}

/**
 * Configures the svg.
 * 
 * @param   { string }      subtitle  The title of the graph.
 * @param   { object }      options   Options for rendering the subtitle.
 * @return  { Datagraph }             The modified instance. 
 */
Datagraph.prototype.addSubtitle = function(subtitle, options={}) {
  this.canvas 
    .append('text')
    .classed('datagraph-subtitle', true)
    .text(subtitle)

  return this;
}

/**
 * Creates a horizontal axis for the graph.
 * 
 * @param   { object }      options   The options for creating the x-axis.
 * @return  { Datagraph }             The modified instance.
 */
Datagraph.prototype.addXAxis = function(options={}) {
  let scale;

  switch(options.type ?? 'linear') {
    case 'log': scale = d3.scaleLog(); break;
    case 'time': scale = d3.scaleTime(); break;
    case 'categorical': scale = d3.scaleBand(); break;
    case 'linear': scale = d3.scaleLinear(); break;
    default: scale = d3.scaleLinear(); break;
  }

  this.xAxis = scale
    .domain(options.domain ?? [ options.start ?? 0, options.end ?? 1 ])
    .range([ 0, this.width ])

  // Store the number of categorical data we have
  this.xAxisCount = options.domain ? options.domain.length : 0;

  // Place the axis on the bottom
  this.xAxisElement = this.canvas
    .append('g')
    .classed('datagraph-x-axis', true)
    .call(d3
      .axisBottom(this.xAxis)
      .ticks(options.ticks ?? 10))
    .style('transform', `translate(0, ${this.height}px)`)
    .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', `rotate(${options.angle ?? -45})`)

  return this;
}

/**
 * Creates a vertical axis for the graph.
 * 
 * @param   { object }      options   The options for creating the y-axis.
 * @return  { Datagraph }             The modified instance.
 */
Datagraph.prototype.addYAxis = function(options={}) {
  let scale;

  switch(options.type ?? 'linear') {
    case 'log': scale = d3.scaleLog(); break;
    case 'time': scale = d3.scaleTime(); break;
    case 'categorical': scale = d3.scaleBand(); break;
    case 'linear': scale = d3.scaleLinear(); break;
    default: scale = d3.scaleLinear(); break;
  }

  this.yAxis = scale
    .domain(options.domain ?? [ options.start ?? 0, options.end ?? 1 ])
    .range([ this.height, 0 ])

  // Store the number of categorical data we have
  this.yAxisCount = options.domain ? options.domain.length : 0;
    
  // Place the axis on the left
  this.yAxisElement = this.canvas
    .append('g')
    .classed('datagraph-y-axis', true)
    .call(d3
      .axisLeft(this.yAxis)
      .ticks(options.ticks ?? 10))

  return this;
}

/**
 * Creates a color axis for the graph.
 * Used when we want to plot data with varying shades.
 * 
 * @param   { object }      options   The options for creating the color-axis.
 * @return  { Datagraph }             The modified instance.
 */
Datagraph.prototype.addColorAxis = function(options={}) {
  this.colorAxis = d3.scaleLinear()
    .domain(options.domain ?? [ options.start ?? 0, options.end ?? 1 ])
    .range(options.colors ?? [ options.startColor, options.endColor ])

  return this;
}

/**
 * Creates the stylesheet for the datagraph.
 * 
 * @param   { object }      style   The options for the styling.
 * @return  { Datagraph }           The modified instance.
 */
Datagraph.prototype.setStyle = function(style={}) {

  // The root and the classname
  const root = document.querySelector(':root');
  const classname = `${this.id}-data-point`;
  const styleProps = Object.keys(style);
  let styleSheet = '';

  // Create the style
  this.styleTag = document.createElement('style');
  this.styleTag.classList.add(`${this.id}-style`);
  
  for(let i = 0; i < styleProps.length; i++) {
    styleSheet += `${styleProps[i]}: var(--${classname}-${styleProps[i]});\n`;
    root.style.setProperty(`--${classname}-${styleProps[i]}`, style[styleProps[i]]);
  }
  
  // Create a new rule for the datapoints
  this.styleTag.innerHTML = `.${classname} {${styleSheet}}`;

  // Append it to the head
  document.head.appendChild(this.styleTag);

  // Return the instance
  return this;
}

/**
 * Modifies the CSS variable associated with a style.
 * 
 * @param   { object }      vars  The list of CSS variables we want to change.
 * @return  { Datagraph }         The current instance.    
 */
Datagraph.prototype.setCSSVariables = function(vars={}) {
  const root = document.querySelector(':root');
  const classname = `${this.id}-data-point`;
  const varNames = Object.keys(vars);

  // Set the CSS variables
  for(let i = 0; i < varNames.length; i++)
    root.style.setProperty(`--${classname}-${varNames[i]}`, vars[varNames[i]]);

  return this;
}

/**
 * Creates a scatterplot based on the provided data.
 * 
 * @param   { array }       data      An array of objects. 
 * @param   { object }      options   The options for rendering.
 * @return  { Datagraph }             The modified instance.
 */
Datagraph.prototype.addScatterplot = function(data, options={}) {
  
  // The datagraph instance
  const datagraph = this;

  // Default styles
  const defaultColor = options.color ?? 'black';
  const defaultRadius = options.radius ?? 5;
  const defaultOpacity = options.opacity ?? 1;

  // Highlight styles
  const highlightColor = options.highlightColor ?? '#ffc824';
  const highlightRadius = options.highlightRadius ?? 10;
  const highlightOpacity = options.highlightOpacity ?? 1;
  const unhighlightColor = options.unhighlightColor ?? 'black';
  const unhighlightOpacity = options.unhighlightOpacity ?? 0.25;

  // Some instance based parameters
  const fx = (d, i) => this.xAxis(d.x);
  const fy = (d, i) => this.yAxis(d.y);
  const fc = (d, y) => this.colorAxis(d.value);

  /**
   * Highlights the scatterplot element when hovering.
   * 
   * @param   { event }   e   The event object. 
   * @param   { datum }   d   The data associated with the instance.
   */
  const mouseover = function(e, d) {
    d3.select(this)
      .attr('r', highlightRadius)
      .style('fill', highlightColor)
      .style('opacity', highlightOpacity)
      
    datagraph.setCSSVariables({ 
      fill: unhighlightColor,
      opacity: unhighlightOpacity,
    });

    if(options.mouseover)
      options.mouseover(e, d);
  }

  /**
   * Reverts the scatterplot element after hovering.
   * 
   * @param {*} e 
   * @param {*} d 
   */
  const mouseleave = function(e, d) {
    d3.select(this)
      .attr('r', defaultRadius)
      .style('fill', '')
      .style('opacity', '')

    datagraph.setCSSVariables({ 
      fill: defaultColor, 
      opacity: defaultOpacity,
    });

    if(options.mouseleave)
      options.mouseleave(e, d);
  }

  // Create the datapoints
  this.canvas
    .selectAll('circle')
    .data(data)
    .join('circle')
    .classed(this.id + '-data-point', true)
    .classed('data-point', true)
    .attr('cx', fx)
    .attr('cy', fy)
    .attr('r', 10)
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)

  // Create the style tag if it doesn't exist
  // These styles represent the default styles of the elements
  if(!document.getElementsByClassName(this.id + '-style').length) {
    this.setStyle({
      fill: defaultColor,
      opacity: defaultOpacity,
    });
  }

  return this;
}

/**
 * Creates a time series based on the provided data.
 * 
 * @param   { array }       data      An array of objects. 
 * @param   { object }      options   The options for rendering.
 * @return  { Datagraph }             The modified instance.
 */
Datagraph.prototype.addTimeline = function(data, options={}) {
  
  // The datagraph instance
  const datagraph = this;

  // Default styles
  const defaultColor = options.color ?? 'black';
  const defaultRadius = options.radius ?? 5;
  const defaultOpacity = options.opacity ?? 1;

  // Highlight styles
  const highlightColor = options.highlightColor ?? '#ffc824';
  const highlightRadius = options.highlightRadius ?? 10;
  const highlightOpacity = options.highlightOpacity ?? 1;
  const unhighlightColor = options.unhighlightColor ?? 'black';
  const unhighlightOpacity = options.unhighlightOpacity ?? 0.25;

  // Some instance based parameters
  const fx = (d, i) => this.xAxis(d.x);
  const fy = (d, i) => this.yAxis(d.y);
  const fc = (d, y) => this.colorAxis(d.value);

  /**
   * Highlights the timeline element when hovering.
   * 
   * @param   { event }   e   The event object. 
   * @param   { datum }   d   The data associated with the instance.
   */
  const mouseover = function(e, d) {
    d3.select(this)
      .attr('r', highlightRadius)
      .style('fill', highlightColor)
      .style('opacity', highlightOpacity)
      
    datagraph.setCSSVariables({ 
      fill: unhighlightColor,
      opacity: unhighlightOpacity,
    });

    if(options.mouseover)
      options.mouseover(e, d);
  }

  /**
   * Reverts the timeline element after hovering.
   * 
   * @param {*} e 
   * @param {*} d 
   */
  const mouseleave = function(e, d) {
    d3.select(this)
      .attr('r', defaultRadius)
      .style('fill', '')
      .style('opacity', '')

    datagraph.setCSSVariables({ 
      fill: defaultColor, 
      opacity: defaultOpacity,
    });

    if(options.mouseleave)
      options.mouseleave(e, d);
  }

  // Defines the thing we use to draw a line with our data
  const line = d3.line(fx, fy);

  // Create the datapoints
  this.canvas
    .append('path')
    .classed(this.id + '-data-point', true)
    .attr('d', line(data))
    .attr('stroke', 'black')
    .attr('fill', 'none')
    .style('fill', 'none')

  this.canvas
    .selectAll('circle')
    .data(data)
    .join('circle')
    .classed(this.id + '-data-point', true)
    .classed('data-point', true)
    .attr('cx', fx)
    .attr('cy', fy)
    .attr('r', 5)
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)

  // Create the style tag if it doesn't exist
  // These styles represent the default styles of the elements
  if(!document.getElementsByClassName(this.id + '-style').length) {
    this.setStyle({
      fill: defaultColor,
      opacity: defaultOpacity,
    });
  }

  return this;
}

/**
 * 
 * @param {*} data 
 * @param {*} options 
 */
Datagraph.prototype.addHeatmap = function(data, options={}) {
  
  // The datagraph instance
  const datagraph = this;

  // Default styles
  const defaultColor = options.color ?? 'black';
  const defaultRadius = options.radius ?? 5;
  const defaultOpacity = options.opacity ?? 1;
  const defaultFilter = options.defaultFilter ?? '';

  // Highlight styles
  const highlightColor = options.highlightColor ?? '#ffc824';
  const highlightRadius = options.highlightRadius ?? 10;
  const highlightOpacity = options.highlightOpacity ?? 1;
  const highlightFilter = options.highlightFilter ?? 'saturate(100%)';
  const unhighlightColor = options.unhighlightColor ?? 'black';
  const unhighlightOpacity = options.unhighlightOpacity ?? 0.5;
  const unhighlightFilter = options.unhighlightFilter ?? 'saturate(0%)';

  // Some instance based parameters
  const fx = (d, i) => this.xAxis(d.x);
  const fy = (d, i) => this.yAxis(d.y);
  const fc = (d, y) => this.colorAxis(d.value);

  /**
   * Highlights the heatmap element when hovering.
   * 
   * @param   { event }   e   The event object. 
   * @param   { datum }   d   The data associated with the instance.
   */
  const mouseover = function(e, d) {
    d3.select(this)
      .attr('r', highlightRadius)
      .style('fill', highlightColor)
      .style('opacity', highlightOpacity)
      .style('filter', highlightFilter)
      
    datagraph.setCSSVariables({ 
      fill: unhighlightColor,
      filter: unhighlightFilter,
      opacity: unhighlightOpacity,
    });

    if(options.mouseover)
      options.mouseover(e, d);
  }

  /**
   * Reverts the heatmap element after hovering.
   * 
   * @param {*} e 
   * @param {*} d 
   */
  const mouseleave = function(e, d) {
    d3.select(this)
      .attr('r', defaultRadius)
      .style('fill', fc)
      .style('opacity', '')
      .style('filter', '')

    datagraph.setCSSVariables({ 
      fill: defaultColor, 
      filter: defaultFilter,
      opacity: defaultOpacity,
    });

    if(options.mouseleave)
      options.mouseleave(e, d);
  }

  // Create the datapoints
  this.canvas
    .selectAll('rect')
    .data(data)
    .join('rect')
    .classed(this.id + '-data-point', true)
    .classed('data-point', true)
    .attr('x', d => fx(d) - 0.5)
    .attr('y', d => fy(d) - 0.5)
    .attr('width', this.width / this.xAxisCount + 1)
    .attr('height', this.height / this.yAxisCount + 1)
    .style('fill', fc)
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)

  // Create the style tag if it doesn't exist
  // These styles represent the default styles of the elements
  if(!document.getElementsByClassName(this.id + '-style').length) {
    this.setStyle({
      fill: defaultColor,
      opacity: defaultOpacity,
      filter: defaultFilter,
    });
  }

  return this;
}

Datagraph.prototype.addChordgraph = function() {
  // !todo
}

/**
 * Clears the current graph.
 * This only removes its children.
 * 
 * @return  { Datagraph }   The datagraph instance we modified. 
 */
Datagraph.prototype.clear = function() {
  
  // Remove the stuff inside the svg
  this.canvas.selectAll('*').remove();

  return this;
}

/**
 * Removes the current graph from the DOM and deletes it from memory.
 * 
 * @return  { Datagraph }   The datagraph instance we modified. 
 */
Datagraph.prototype.remove = function() {

  // Get the existing graphs
  const graphs = document.getElementsByClassName(this.id);
  
  // Remove the stuff inside the svgs
  this.canvas.selectAll('*').remove();

  // Remove the svgs
  for(let i = 0; i < graphs.length; i++)
    graphs[i].parentElement.removeChild(graphs[i]);

  return this;
}

/**
 * Manages our datagraphs.
 */
export const DatagraphManager = (function() {
  const _ = {};

  /**
   * Creates a new datagraph.
   * 
   * @param   { string }  title     The title of the graph.
   * @param   { object }  data      The data to bind to the graph.
   * @param   { object }  options   The options we have for rendering.
   */
  _.create = function(title, data, options={}) {
    
    // Create the datagraph
    const datagraph = new Datagraph(title, data, options);
    
    // Save in the store
    _[datagraph.id] = datagraph;

    // Return the instance id
    return datagraph.id;
  }

  /**
   * Returns the requested instance.
   * 
   * @param     { string }      id  The id of the instance. 
   * @return    { datagraph }       The instance we requested for.
   */
  _.get = function(id) {
    if(_[id]) 
      return _[id];
    return null;
  }

  /**
   * Clears the contents of the requested instance.
   * 
   * @param     { string }      id  The id of the instance. 
   * @return    { datagraph }       The instance we wanted to clear.
   */
  _.clear = function(id) {
    if(_[id])
      return _[id].clear();
  }

  /**
   * Removes the requested instance from the DOM.
   * Doesn't return anything because the element is meant to be deleted.
   * 
   * @param     { string }      id  The id of the instance. 
   */
  _.remove = function(id) {
    if(_[id]) {
      _[id].remove();
      delete _[id];
    }
  }

  return {
    ..._,
  }
})();

export default {
  Datagraph,
  DatagraphManager,
}