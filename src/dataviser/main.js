/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-24 12:28:57
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './main.css'

import '../ui/Grid.component'
import '../ui/Button.component'
import '../ui/Slider.component'

import d3 from '../libs/d3.v7.min'

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];
  const data = {};

  // Dataviser menu elements
  const dataviserWindow = document.createElement('grid-component');

  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    const titleCell = document.createElement('grid-cell-component');
    const titleNode = document.createElement('div');
    const importCell = document.createElement('grid-cell-component');
    const importButton = document.createElement('button-component');

    // Create the title
    titleNode.classList.add('dataviser-title');
    titleNode.innerHTML = 'Dataviser';
    titleCell.setPlacement(1, 1);
    titleCell.appendChild(titleNode);

    // Create the import button and its prompt
    importButton.innerHTML = 'select folder';
    importButton.classList.add('dataviser-import-button');
    importButton.mouseDownCallback = e => {
      _.selectDirectory();
    }

    // This cell stores the import button
    importCell.setPlacement(1, 2);
    importCell.innerHTML = 'Select folder to begin.';
    importCell.appendChild(importButton);

    // Construct the tree
    dataviserWindow.appendChild(titleCell);
    dataviserWindow.appendChild(importCell);
    root.appendChild(dataviserWindow);
  }

  /**
   * Selects a directory for the user.
   * This function reads all the JSON files within a directory and stores them as is within our JS object.
   */
  _.selectDirectory = function() {
    
    // Let the user pick a directory
    showDirectoryPicker({ id: 'default', mode: 'read' })

      // After selecting a folder
      .then(async folderHandle => {

        // Queue of the different directories to parse
        let folderHandles = [ folderHandle ];
        let i = 0;

        do {

          // Go to the next handle
          folderHandle = folderHandles[i++];

          // For each thing inside the folder
          for await(let entryHandle of folderHandle.values()) {
          
            // Add subdirectory to queue
            if(entryHandle instanceof FileSystemDirectoryHandle) {
              folderHandles.push(entryHandle);

            // Add file to file list
            } else {
              let reader = new FileReader();
              let file = await entryHandle.getFile();
              let key = file.name.split('.').slice(0, -1).join('.');

              // Parse the content of the file
              reader.readAsText(file);
              reader.onload = e => {
                data[key] = JSON.parse(e.target.result);
              }
            }
          }

        // While we have stuff in the queue
        } while(i < folderHandles.length);

        // Success
        return true;
      })

      // Catch any errors
      .catch(error => {
        alert(`Error: \n(${error})`)
      })
  }

  return {
    ..._,
  }
})();

export default {
  dataviser
}