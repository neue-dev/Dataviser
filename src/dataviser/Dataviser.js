/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-25 19:28:00
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './Dataviser.css'

import '../ui/Grid.component'
import '../ui/Button.component'
import '../ui/Slider.component'

import { Dataset } from './Dataset.class'
import { Datagraph } from './Datagraph.class'

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];
  let dataset = new Dataset();

  // Dataviser menu elements
  const dataviserWindow = document.createElement('grid-component');

  // Dataviser d3 canvas
  const dataviserCanvas = document.createElement('div');
  dataviserCanvas.classList.add('dataviser-canvas');

  // Dataviser file list
  const dataviserFileList = document.createElement('div');
  dataviserFileList.classList.add('dataviser-file-list');
  
  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    // Cells
    const titleCell = document.createElement('grid-cell-component');
    const importCell = document.createElement('grid-cell-component');
    const canvasCell = document.createElement('grid-cell-component');
    const fileListCell = document.createElement('grid-cell-component');

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
    importCell.innerHTML = 'Select folder to begin.<br>';
    importCell.appendChild(importButton);

    // Create the canvas cell
    canvasCell.setPlacement(3, 1);
    canvasCell.setDimensions(2, 3);
    canvasCell.appendChild(dataviserCanvas);

    // Create the file list cell
    fileListCell.setPlacement(1, 3);
    fileListCell.setDimensions(1, 2);
    fileListCell.appendChild(dataviserFileList);

    // ! remove
    let d = new Datagraph({ parent: canvasCell });
    setTimeout(() => {
      let testdata = ['a', 'b', 'c', 'aa', 'bb', 'ccc', 'dddd'];

      d.init()
        .addTitle('hello world')
        .addSubtitle('this is a graph about hello world')
        .addXAxis({ type: 'ordinal', domain: ['a', 'b'] })
        .addYAxis({ type: 'ordinal' ,domain: ['a', 'b'] })
        .addHeatmap([{ x: 'a', y: 'a', value: 101 }, { x: 'a', y: 'b', value: 69}, { x: 'b', y: 'a', value: 121}, { x: 'b', y: 'b', value: 32}]);
    })

    // Construct the tree
    dataviserWindow.appendChild(titleCell);
    dataviserWindow.appendChild(importCell);
    dataviserWindow.appendChild(canvasCell);
    dataviserWindow.appendChild(fileListCell);
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

    // Display the list of read files
    let dataAssets = dataset.getList();
    dataviserFileList.parentElement.prepend(`Successfully loaded ${dataAssets.length} files:`);

    for(let i = 0; i < dataAssets.length; i++) {
      let dataAssetButton = document.createElement('button-component');
      dataAssetButton.innerHTML = dataAssets[i];
      dataAssetButton.style.marginBottom = '8px';

      dataviserFileList.appendChild(dataAssetButton);
    }
  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {

    // For each data set, we create a matrix
    for(let dataSetKey in dataset.assets) {
      dataset.renderHeatmap(dataSetKey, { 
        canvas: 'dataviser-canvas',
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

        // Clear the dataset and the canvas
        dataset = new Dataset();
        dataviserCanvas.innerHTML = '';

        // Queue of the different directories to parse
        let folderHandles = [ folderHandle ];
        let i = 0, fileCount = 0;

        // This loop counts the number of files first
        do {

          // Go to the next handle
          folderHandle = folderHandles[i++];

          // For each thing inside the folder
          for await(let entryHandle of folderHandle.values()) {
          
            // Add subdirectory to queue
            if(entryHandle.kind == 'directory')
              folderHandles.push(entryHandle);

            // Add file to file list
            else fileCount++;
          }

        // While we have stuff in the queue
        } while(i < folderHandles.length)

        // This loop reads each of the files and saves the raw data
        // After that, it configures the data and some other stuff
        i = 0;
        do {

          // Go to the next handle
          folderHandle = folderHandles[i++];

          // For each thing inside the folder
          for await(let entryHandle of folderHandle.values()) {
          
            // Add file to list
            if(entryHandle.kind == 'file') {
              entryHandle.getFile().then(async file => {
                await dataset.readJSON(file)
                
                // Load data
                if(!(--fileCount)) {
                  _.configData();
                  _.renderData();
                }
              });
            }
          }

        // While we have stuff in the queue
        } while(i < folderHandles.length)
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