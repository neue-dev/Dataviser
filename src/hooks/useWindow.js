/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-01 23:18:42
 * @ Modified time: 2024-07-01 23:29:48
 * @ Description:
 * 
 * This was adapted from a stackoverflow post and lets us retrieve the window dimensions in react.
 * For reference, see: https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs.
 */

import { useState, useEffect } from 'react';

/**
 * A hook that grabs the window information.
 * 
 * @hook
 */
export function useWindow() {

  // Stores the window dimensions we were able to grab
  const [ _window, _setWindow ] = useState(window);

  // Allows us to handle dom effects
  useEffect(() => {

    // Update stored window; window properties update on resize
    const onResize = () => _setWindow(window);

    // Subscribe to resize events
    window.addEventListener('resize', onResize);

    // Return a callback to unsubscribe from resize events
    return () => window.removeEventListener('resize', onResize);
    
  }, []);

  // Return the window
  return _window;
}

export default {
  useWindow
}
