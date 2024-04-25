/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-25 13:22:47
 * @ Modified time: 2024-04-25 13:34:10
 * @ Description:
 * 
 * A class that interacts with d3.
 * This helps us store state about data presentations, and makes it easier to thematize all our data.
 */

import d3 from '../libs/d3.v7.min.js'

/**
 * A constructor function for the datagraph class.
 * 
 * @param   { object }      options   Options for initializing the data graph. 
 * @return  { Datagraph }             The created instance.
 */
export function Datagraph(options={}) {
  this.id = crypto.randomUUID();
  this.svg = options.svg ?? document.createElement('svg');
  this.parent = options.parent ?? document.body;

  return this;
}

/**
 * Initializes the data graph.
 * 
 * @param {*} options 
 */
Datagraph.prototype.init = function(options={}) {
  d3.select(this.svg);
}

/**
 * Appends the svg to the dom.
 * 
 * @return  { Datagraph }   The modified instance. 
 */
Datagraph.prototype.render = function() {
  const svgs = document.getElementsByClassName(this.id);

  // Remove existing svgs
  for(let i = 0; i < svgs.length; i++)
    svgs[i].parentElement.removeChild(svgs[i]);

  // Add the current svg
  this.svg.classList.add(this.id);
  this.parent.appendChild(this.svg);
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