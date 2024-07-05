/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-06 05:39:48
 * @ Modified time: 2024-07-06 05:47:09
 * @ Description:
 * 
 * A hook for initializing d3.
 * 
 * // ! update this
 */

import * as d3 from 'd3'

export function useD3(svgRef, id) {
  
  useEffect(() => {
    
    // Set the ref
    svgRef.current = d3.select(id);

  }, []);
}

export default {
  useD3
}

