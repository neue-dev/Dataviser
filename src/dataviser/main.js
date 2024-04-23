/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-23 12:18:24
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './main.css'
import '../ui/Slider.component'

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];

  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    root.innerHTML = `
      <div class='dataviser-window'>
        <div class='dataviser-title'>
          Dataviser
        </div>

        <div class='grid-cell grid-1-1 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.
        </div>

        <div class='grid-cell grid-2-1 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog. the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.
        </div>

        <div class='grid-cell grid-3-1 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. 
        </div>

        <div class='grid-cell grid-4-1 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. 
        </div>

        <div class='grid-cell grid-4-2 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. 
        </div>
        
        <div class='grid-cell grid-4-3 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.  the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. 
        </div>

        <div class='grid-cell grid-3-3 grid-cell-w1 grid-cell-h1'>
          the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes.the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. the quick brown fox jumped over the lazy dog lorem ipsum doloret yes. 
        </div>
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