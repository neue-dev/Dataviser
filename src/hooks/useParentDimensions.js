/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 19:51:39
 * @ Modified time: 2024-07-23 23:10:29
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
export function useParentDimensions(ref, setWidth, setHeight, callback=d=>d) {

  // Creates a new resize observer to give us the component dimensions
  useEffect(() => {

    // Return if not defined
    if(!ref.current)
      return;
    
    // Grab width and height
    let width = ref.current.parentElement.offsetWidth;
    let height = ref.current.parentElement.offsetHeight;

    // Set the initial dimensions
    setWidth(width);
    setHeight(height);
    
    // Update the parent when a resize occurs
    const resizeObserver = new ResizeObserver((e) => {
      width = e[0].contentBoxSize[0].inlineSize;
      height = e[0].contentBoxSize[0].blockSize;

      setWidth(width);
      setHeight(height);

      // ! find a better solution than using a callback gdi
      callback(width, height);
    });
    
    // Observe the parent element
    resizeObserver.observe(ref.current.parentElement);
    
    // ! find a better solution than using a callback gdi
    callback(width, height);

    // Clean up function
    return () => resizeObserver.disconnect();
    
  }, []);
}

export default {
  useParentDimensions,
}
