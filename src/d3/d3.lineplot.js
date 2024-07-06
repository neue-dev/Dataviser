/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-06 13:22:57
 * @ Modified time: 2024-07-06 17:01:37
 * @ Description:
 * 
 * A lineplot utility for our graphs.
 */

/**
 * Augments the d3 library with our own lineplot code.
 */
export const d3lineplot = (function() {
  
  // Some private variables
  const _size = [ 100, 100 ];
  const _domain = [ 0, 100 ];
  const _range = [ 0, 100 ];
  const _xscale = d3.scaleLinear();
  const _yscale = d3.scaleLinear();
  let _points = [];
  
  // The methods
  const _ = {};

  /**
   * Sets the size of the visual.
   * Retrieves the size when no arg is passed.
   * 
   * @param   { array }   size  The new size of the visual.
   * @return  { array }         The current size of the visual.
   */
  _.size = (size) => {
    if(!size)
      return _size;

    _size[0] = size[0];
    _size[1] = size[1];

    // Return the methods.
    return _;
  }

  /**
   * Sets the domain of the visual.
   * Retrieves the domain when no arg is passed.
   * 
   * @param   { array }   domain  The new domain of the visual.
   * @return  { array }           The current domain of the visual.
   */
  _.domain = (domain) => {
    if(!domain)
      return _domain;

    _domain[0] = domain[0];
    _domain[1] = domain[1];

    // Return the methods.
    return _;
  }
  
  /**
   * Sets the range of the visual.
   * Retrieves the range when no arg is passed.
   * 
   * @param   { array }   range  The new range of the visual.
   * @return  { array }           The current range of the visual.
   */
  _.range = (range) => {
    if(!range)
      return _range;

    _range[0] = range[0];
    _range[1] = range[1];

    // Return the methods.
    return _;
  }

  /**
   * Sets the points of the plot.
   * 
   * @param   { array }   points  The data to use for the plot.
   * @param   { string }  key     The key to use for each element. 
   */
  _.points = (points, key) => {

    // Define the points in groups
    _points = d3.group(points, d => d[key])

    // Return the methods.
    return _;
  }

  /**
   * Prepares our data for displaying.
   * Prepares the scales we're going to use too.
   */
  _.layout = () => {

    // Configure our scales
    _xscale.domain(_domain).range([ 0, _size[0] ]);
    _yscale.domain(_range).range([ 0, _size[1] ]);

    // Return the methods.
    return _;
  }

  /**
   * Renders our data.
   * Renders under the given parent.
   * 
   * @param   { string }  parent  A selector for the parent of the visual.
   */
  _.render = (parent) => {

    // Construct the axes
    d3.select(parent)
      .append('g')
      .attr('transform', `translate(0, ${_size[1]})`)
      .call(d3.axisBottom(_xscale).ticks(5));

    d3.select(parent)
      .call(d3.axisLeft(_yscale));
    
    // Construct the line graph
    d3.select(parent)
      .selectAll('.line')
      .data(_points)
      .join('path')
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.n); })
            (d[1])
        })
  }

  // Return a function with all the methods
  return () => {
    return {
      ..._,
    }
  }
})();

export default {
  d3lineplot,
}

