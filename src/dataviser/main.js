/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-23 17:13:38
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './main.css'
import '../ui/Grid.component'
import '../ui/Button.component'
import '../ui/Slider.component'
import { ipcRenderer } from 'electron';

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];

  // Dataviser menu elements
  const dataviser_window = document.createElement('grid-component');

  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    const title_cell = document.createElement('grid-cell-component');
    const title_node = document.createElement('div');
    const import_cell = document.createElement('grid-cell-component');
    const import_button = document.createElement('button-component');

    // Create the title
    title_node.classList.add('dataviser-title');
    title_node.innerHTML = 'Dataviser';
    title_cell.setPlacement(1, 1);
    title_cell.appendChild(title_node);

    // Create the import button and its prompt
    import_button.innerHTML = 'select folder';
    import_button.classList.add('dataviser-import-button');
    import_button.mouseDownCallback = e => {
        
      // Let the user pick a directory
      showDirectoryPicker({ id: 'default' })
        .then(folder => { console.log(folder.entries()) })
        .catch(console.log('No or bad directory picked.'))
    }

    import_cell.setPlacement(1, 2);
    import_cell.innerHTML = 'Select folder to begin.';
    import_cell.appendChild(import_button);

    // Construct the tree
    dataviser_window.appendChild(title_cell);
    dataviser_window.appendChild(import_cell);
    root.appendChild(dataviser_window);
  }

  return {
    ..._,
  }
})();

export default {
  dataviser
}