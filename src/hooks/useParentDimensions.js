/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 19:51:39
 * @ Modified time: 2024-07-02 20:45:24
 * @ Description:
 * 
 * This hook gives us access to the properties of the parent of a given component.
 */

import { useState, useEffect } from 'react'

/**
 * A hook that grabs a parent's dimensions.
 * 
 * @hook
 */
export function useParentDimensions(ref, setWidth, setHeight) {

  // Creates a new resize observer to give us the component dimensions
  useEffect(() => {

    // Return if not defined
    if(!ref.current)
      return;

    // Set the initial dimensions
    setWidth(ref.current.parentElement.offsetWidth);
    setHeight(ref.current.parentElement.offsetHeight);
    
    // Update the parent when a resize occurs
    const resizeObserver = new ResizeObserver((e) => {
      setWidth(e[0].contentBoxSize[0].inlineSize);
      setHeight(e[0].contentBoxSize[0].blockSize);
    });

    // Observe the parent element
    resizeObserver.observe(ref.current.parentElement);

    // Clean up function
    return () => resizeObserver.disconnect();
    
  }, [ ref ]);
}

export default {
  useParentDimensions,
}
