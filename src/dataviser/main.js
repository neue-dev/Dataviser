/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-23 08:51:52
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];

  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    root.innerHTML = `
      <div class='title'>
        Dataviser
      </div>
    `;
  }

  return {
    ..._,
  }
})();

export default {
  dataviser
}