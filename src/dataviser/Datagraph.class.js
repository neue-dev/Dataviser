/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-25 13:22:47
 * @ Modified time: 2024-04-25 14:24:40
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
 * @return  { Datagraph }             The created instance.
 */
export function Datagraph(options={}) {
  this.id = '_' + crypto.randomUUID();
  this.parent = options.parent ?? document.body;

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
  this.width = this.parent.getBoundingClientRect().width;
  this.height = this.parent.getBoundingClientRect().height;
  this.margins = {
    top: 16, bottom: 16,
    left: 24, right: 24,
  };

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

  return this;
}

/**
 * Configures the svg.
 * 
 * @param   { string }      title   The title of the graph.
 * @return  { Datagraph }           The modified instance. 
 */
Datagraph.prototype.addTitle = function(title) {
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
 * @return  { Datagraph }             The modified instance. 
 */
Datagraph.prototype.addSubtitle = function(subtitle) {
  this.canvas 
    .append('text')
    .classed('datagraph-subtitle', true)
    .text(subtitle)

  return this;
}

/**
 * Manages our datagraphs.
 */
export const DatagraphManager = (function() {
  const _ = {};

  return {
    ..._,
  }
})();

export default {
  Datagraph,
  DatagraphManager,
}