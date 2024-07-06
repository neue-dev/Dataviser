/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-06 13:22:57
 * @ Modified time: 2024-07-06 14:49:16
 * @ Description:
 * 
 * Helpers for creating sankeys.
 */

import * as d3 from 'd3'

/**
 * Augments the d3 library with our own sankey plot code.
 */
export const d3Sankey = (function() {

  // Some properties of the visual
  const _nodeWidth = 16;
  const _nodePadding = 8;

  // Where we store the state of the visual
  const _nodes = {};
  const _links = {};

  // Methods
  const _ = {};

  /**
   * Computes the different links between the nodes.
   */
  const _computeNodeLinks = () => {
    
    // For each node, we reset the stored links
    _nodes.forEach((nodeKey) => {
      _nodes[nodeKey].sourceLinks = [];
      _nodes[nodeKey].targetLinks = [];
    });

    // We save the link to each of the nodes that use it
    _links.forEach(function(linkKey) {

      // Grab the source and target of the link, as well as the link
      const link = _links[linkKey];
      const source = link.source;
      const target = link.target;

      // If the source isn't the node reference yet
      if([ 'number', 'string' ].contains(typeof source)) 
        source = _links[linkKey].source = nodes[link.source];
      
      // If the target isn't the node reference yet
      if([ 'number', 'string' ].contains(typeof target)) 
        target = _links[linkKey].target = nodes[link.target];
      
      // Save the links to the nodes
      source.sourceLinks.push(_links[linkKey]);
      target.targetLinks.push(_links[linkKey]);
    });
  }

  /**
   * Computes the sizes of each node using the links associated with it.
   */
  const _computeNodeValues = () => {

    // Go through each node
    _nodes.forEach(function(nodeKey) {

      // Grab the node first
      const node = _nodes[nodeKey];

      // Update the value of the node
      _nodes[nodeKey].value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  /**
   * Computes the location of the nodes along the horizontal axis.
   */
  const _computeNodePlacement = () => {
    
    // The remaining nodes to check
    let remainingNodes = Object.values(_nodes);
    let nextNodes = [];
    let placement = 0;

    // While we have nodes to check
    while (remainingNodes.length) {

      // The next nodes are the nodes that are targets of the remaining nodes
      nextNodes = [];

      // For each remaining node...
      remainingNodes.forEach((node) => {

        // Set the placement and width
        node.x = placement * (_nodeWidth + _nodePadding);
        node.width = _nodeWidth;

        // For each node, we check if it has a source
        node.sourceLinks.forEach((link) => {

          // Add the current node to the next list if it isn't there yet
          if(nextNodes.indexOf(link.target) < 0)
            nextNodes.push(link.target);
        });
      });

      // Update the remaining nodes
      remainingNodes = nextNodes;

      // Update the placement
      placement++;
    }

    // ! TO IMPLEMENT
    // moveSinksRight(x);
    // scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  /**
   * Computes the depths of the nodes.
   */
  const _computeNodeDepths = () => {

    // We group the nodes according to their placement in the sankey plot
    const nodesByPlacement = d3.group()
      .key((d) => d.x)
      .sortKeys(d3.ascending)
      .entries(Object.values(_nodes))
      .map((d) => d.values);

    // Initialize the vertical placement
    _initializeNodeDepth();
    _resolveCollisions();

    /**
     * Computes the vertical placement of the nodes.
     */
    const _initializeNodeDepth = () => {

      // For each group of nodes
      nodesByPlacement.forEach((nodes) => {

        // For each node in a group
        nodes.forEach((node, i) => {
          node.y = i;
          node.height = node.value;
        });
      });

      // Compute the link offsets
      _links.forEach((linkKey) => {
        _links[linkKey].height = _links[linkKey].value;
      });
    }

    /**
     * Resolves collisions of the nodes.
     */
    const _resolveCollisions = () => {

      // For each group
      nodesByPlacement.forEach((nodes) => {
        let node;
        let dy, y0 = 0;

        // Sort nodes by y
        nodes.sort(ascendingDepth);

        // Push any overlapping nodes down.
        for(let i = 0; i < nodes.length; ++i) {

          // Grab the node and determine its height
          node = nodes[i];
          dy = y0 - node.y;

          // Move the node down
          if (dy > 0) 
            node.y += dy;
          
          // Reset the lowest part
          y0 = node.y + node.dy + nodePadding;
        }
      });
    }
  }

  /**
   * Compute the vertical placements of the links.
   */
  const _computeLinkDepths = () => {
    
    // Sort the links for each of the nodes
    _nodes.forEach((nodeKey) => {
      _nodes[nodeKey].sourceLinks.sort(ascendingTargetDepth);
      _nodes[nodeKey].targetLinks.sort(ascendingSourceDepth);
    });

    // For each node
    _nodes.forEach((node) => {
      let sy = 0, ty = 0;

      // Compute source link placement
      node.sourceLinks.forEach((link) => {
        link.sy = sy;
        sy += link.dy;
      });

      // Compute target link placement
      node.targetLinks.forEach((link) => {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  /**
   * Updates the nodes of the sankey plot.
   * If no arg was passed, it retrieves the nodes of the sankey.
   * 
   * @param   { array }   nodes   An array of the nodes of the plot.
   * @return  { object }          The methods of the sankey object.
   */
  _.nodes = function(nodes) {
    
    // No arg was passed, we retrieve the nodes
    if(!nodes) return _nodes;

    // Update the nodes
    _nodes = nodes;
    
    // Return the sankey object
    return _;
  }

  /**
   * Updates the links of the sankey plot.
   * Returns the current links if no args are passed.
   * 
   * @param   { array }   links   The links of the sankey plot.
   * @return  { object }          The methods of the sankey object.
   */
  _.links = function(links) {

    // No arg was passed
    if(!links) return _links;

    // Update the links
    _links = links;

    // Return the sankey object
    return _;
  }

  /**
   * Computes the layout of the sankey plot.
   * 
   * @param   { number }  iters   The number of iterations to compute the node depths.
   * @return  { object }          The methods of the sankey object.
   */
  _.layout = function() {

    // Generate the links first
    _computeNodeLinks();

    // Compute the values of the nodes based on links
    _computeNodeValues();

    // Compute the placement of the nodes
    _computeNodePlacement();

    // Compute the vertical placements
    _computeNodeDepths();

    // Compute the vertical placements of the links
    _computeLinkDepths();
    
    return _;
  }

  // Return a function that creates the lineplot object
  return () => {
    return { 
    ..._, 
    }
  }
})();

export default {
  d3Sankey
}