/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-25 06:59:53
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './main.css'

import '../ui/Grid.component'
import '../ui/Button.component'
import '../ui/Slider.component'

import { Dataset } from './Dataset.class'
import d3 from '../libs/d3.v7.min'

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];
  const dataset = new Dataset();

  // Dataviser menu elements
  const dataviserWindow = document.createElement('grid-component');

  // Dataviser d3 canvas
  const dataviserCanvas = document.createElement('div');
  dataviserCanvas.classList.add('canvas');
  
  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    // Cells
    const titleCell = document.createElement('grid-cell-component');
    const importCell = document.createElement('grid-cell-component');
    const canvasCell = document.createElement('grid-cell-component');

    // Other elements
    const titleNode = document.createElement('div');
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

    // Create the canvas cell
    canvasCell.setPlacement(3, 1);
    canvasCell.setDimensions(3, 1);
    canvasCell.appendChild(dataviserCanvas);

    // Construct the tree
    dataviserWindow.appendChild(titleCell);
    dataviserWindow.appendChild(importCell);
    dataviserWindow.appendChild(canvasCell);
    root.appendChild(dataviserWindow);
  }

  /**
   * Configures the dataset object.
   */
  _.configData = function() {

    // This parser converts the raw data into a 2x2 matrix
    dataset.addParser('matrix', (asset, options) => {

      // We define a matrix
      let m = [];
      m.labels = {};
        
      // Build up the matrix
      for(let row in asset) {
        let mrow = [];
        
        for(let entry in asset[row])
          mrow.push(asset[row][entry]);

        // Push the new row and the label
        m.push(mrow);
        m.labels.push(row);
      }

      return m;
    });

    // This parser converts the raw data into a 2x2 matrix
    dataset.addParser('matrix-reduced', (asset, options) => {

      // We define a matrix
      let m = [];
      let sums = [];
      m.labels = [];
        
      // Generate sums per row
      for(let row in asset) {
        let sum = 0;
        
        for(let entry in asset[row])
          sum += asset[row][entry];
        sums.push([row, sum]);
      }

      // Sort sums by size
      sums.sort((a, b) => b[1] - a[1]);

      // Get only the 20 most prominent locations
      let i = 0;
      
      for(; i < (options.maxCount ?? 16) && i < sums.length; i++) {
        let mrow = [];
        let row = sums[i][0];

        for(let entry in asset[row])
          mrow.push(asset[row][entry]);

        // Push the new row and the label
        m.push(mrow);
        m.labels.push(row);
      }

      // The last matrix row
      let mlastrow = [];

      for(; i < sums.length; i++) {
        let row = sums[i][0];
        let j = 0;

        // Accumulate the remaining values
        for(let entry in asset[row]) {
          if(j >= mlastrow.length)
            mlastrow[j] = 0;
          mlastrow[j++] += asset[row][entry];
        }
      }

      // If it's not empty
      if(mlastrow.length) {
        m.push(mlastrow);
        m.labels.push('others');
      }

      return m;
    });
  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {

    // For each data set, we create a matrix
    for(let dataSetKey in dataset.assets) {
      dataset.renderChord(dataSetKey, { 
        assetParserKey: 'matrix-reduced',
        assetParserOptions: {
          maxCount: 10,
        } 
      });
      
      return;
    }
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
            if(entryHandle instanceof FileSystemDirectoryHandle)
              folderHandles.push(entryHandle);

            // Add file to file list
            else
              dataset.readJSON(await entryHandle.getFile());
          }

        // While we have stuff in the queue
        } while(i < folderHandles.length);

        // Success
        return true;

      // Load data
      }).then(() => {
        _.configData();
        _.renderData();
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