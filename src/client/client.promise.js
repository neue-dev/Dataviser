/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-02 00:26:47
 * @ Modified time: 2024-07-02 00:36:20
 * @ Description:
 * 
 * Utilities for promise handling.
 */

export const ClientPromise = (function() {
  
  const _ = {};

  /**
   * Creates a new promise with external resolve and reject handles.
   * 
   * @return  { object }  An object containing the promise and resolve / reject handles.
   */
  _.createPromise = function() {
    
    // Create handles for resolving and rejecting
    let resolveHandle;
    let rejectHandle;

    // Create a new promise with external resolve and reject handles
    const promise = new Promise((resolve, reject) => {
      resolveHandle = resolve;
      rejectHandle = reject;
    });

    // Error logging
    promise.catch(e => console.error(e));

    // Return everything
    return { promise, resolveHandle, rejectHandle };
  }
  
  return {
    ..._,
  }
})();

export default {
  ClientPromise
}
