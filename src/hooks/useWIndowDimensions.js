/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:18:42
 * @ Modified time: 2024-07-02 20:14:50
 * @ Description:
 * 
 * This was adapted from a stackoverflow post and lets us retrieve the window dimensions in react.
 * For reference, see: https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs.
 */

import { useState, useEffect } from 'react';

/**
 * A hook that grabs the window dimensions.
 * 
 * @hook
 */
export function useWindowDimensions() {

  // Stores the window dimensions we were able to grab
  const [ _width, _setWidth ] = useState(window.innerWidth);
  const [ _height, _setHeight ] = useState(window.innerHeight);

  // Allows us to handle dom effects
  useEffect(() => {

    // Update stored window sizes; window properties update on resize
    const onResize = () => {
      _setWidth(window.innerWidth);
      _setHeight(window.innerHeight);
    };

    // Subscribe to resize events
    window.addEventListener('resize', onResize);

    // Return a callback to unsubscribe from resize events
    return () => window.removeEventListener('resize', onResize);
    
  }, []);

  // Return the window
  return { width: _width, height: _height };
}

export default {
  useWindowDimensions
}
