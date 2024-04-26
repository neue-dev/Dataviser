/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-26 09:03:47
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

  // ! put this guy elsewhere
  const keyParser = key => {
    let startDate = key.split('_')[0];
    let endDate = key.split('_')[0];

    return {
      startYear: parseInt(startDate.split('-')[0]),
      startMonth: parseInt(startDate.split('-')[1]),
      startDay: parseInt(startDate.split('-')[2]),
      
      endYear: parseInt(endDate.split('-')[0]),
      endMonth: parseInt(endDate.split('-')[1]),
      endDay: parseInt(endDate.split('-')[2]),
    }
  }
  
  // ! move this too
  let dataset = new Dataset(keyParser);

  // Dataviser menu elements
  const dataviserWindow = document.createElement('grid-component');

  // Dataviser d3 canvas
  const dataviserCatalogue = document.createElement('grid-cell-component');
  dataviserCatalogue.classList.add('dataviser-catalogue');

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
    dataviserCatalogue.setPlacement(3, 1);
    dataviserCatalogue.setDimensions(3, 4);
    dataviserCatalogue.classList.add('dataviser-catalogue');

    // Create the file list cell
    fileListCell.setPlacement(1, 3);
    fileListCell.setDimensions(1, 2);
    fileListCell.appendChild(dataviserFileList);

    // Construct the tree
    dataviserWindow.appendChild(titleCell);
    dataviserWindow.appendChild(importCell);
    dataviserWindow.appendChild(fileListCell);
    dataviserWindow.appendChild(dataviserCatalogue);
    root.appendChild(dataviserWindow);
  }

  /**
   * Configures the dataset object.
   */
  _.configData = function() {

    // This parser converts the raw data into a 2x2 matrix
    dataset.addParser('matrix', (asset, options={}) => {

      // Clone the object first
      asset = structuredClone(asset);

      // We define a matrix
      let m = [];
      m.labels = [];
        
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
    // However, it only gets data from the n most significant parties
    dataset.addParser('matrix-reduced', (asset, options={}) => {

      // Clone the object first
      asset = structuredClone(asset);

      // We define a matrix
      let m = [];
      let sums = [];
      m.labels = [];

      // Max count
      const maxCount = options.maxCount ?? 16;
  
      // Generate sums per row and column
      for(let row in asset) {
        let sum = 0;
        
        // Add the row and columns
        for(let entry in asset[row])
          sum += asset[row][entry] += (entry != row ? asset[entry][row] : 0);
        sums.push([row, sum]);
      }

      // Sort sums by size
      sums.sort((a, b) => b[1] - a[1]);
      
      let i = 0;
      let sumDict = {};
      let cumRow = sums[maxCount][0];

      // Save the top sums
      for(i = 0; i < maxCount + 1 && i < sums.length; i++)
        sumDict[sums[i][0]] = true;  

      for(let row in asset) {
        for(let entry in asset[row]) {

          // Accumulate the rest on the cumRow
          if(!sumDict[row]) {
            if(!sumDict[entry])
              asset[cumRow][cumRow] += asset[row][entry];
            else
              asset[cumRow][entry] += asset[row][entry];
          } else {
            if(!sumDict[entry])
              asset[row][cumRow] += asset[row][entry];
          }

          // Set to 0 if unimportant
          if(!sumDict[row] || !sumDict[entry]) {
            asset[row][entry] = 0;
            asset[entry][row] = 0;
          }
        }
      }

      // Delete the unneeded rowsand columns
      for(let row in asset) {
        for(let entry in asset[row])
          if(!sumDict[entry])
            delete asset[row][entry];

        if(!sumDict[row])
          delete asset[row];
      }

      // Accumulate the sum too
      for(let i = maxCount + 1; i < sums.length; i++)
        sums[maxCount][1] += sums[i][1];

      // Truncate the sums
      sums = sums.slice(0, maxCount + 1);

      // Build up the matrix
      for(let row in asset) {
        let mrow = [];
        
        for(let entry in asset[row])
          mrow.push(asset[row][entry]);

        // Push the new row and the label
        m.push(mrow);
        m.labels.push(row);
      }

      // Change last label
      m.labels[m.labels.length - 1] = 'other';

      return m;
    });

    // This parser converts the raw data into a list of associations
    dataset.addParser('relation', (asset, options={}) => {

      // Clone the object first
      asset = structuredClone(asset);

      // We define a list
      let m = [];
      m.labels = [];
        
      // Build up the relation
      for(let row in asset) {   
        
        // Push each of the relationships
        for(let entry in asset[row]) {
          m.push({
            x: entry,
            y: row,
            value: asset[row][entry]
          });
        }

        // Save the entry label
        m.labels.push(row);
      }

      return m;
    });

    // This parser converts the raw data into a list of associations
    // However, it only gets data points from the n most significant parties
    dataset.addParser('relation-reduced', (asset, options={}) => {

      // Clone the object first
      asset = structuredClone(asset);

      // We define a list
      let m = [];
      let sums = [];
      m.labels = [];

      // Max count
      const maxCount = options.maxCount ?? 16;
        
      // Generate sums per row and column
      for(let row in asset) {
        let sum = 0;
        
        // Add the row and columns
        for(let entry in asset[row])
          sum += asset[row][entry] += (entry != row ? asset[entry][row] : 0);
        sums.push([row, sum]);
      }

      // Sort sums by size
      sums.sort((a, b) => b[1] - a[1]);
      
      let i = 0;
      let sumDict = {};
      let cumRow = sums[maxCount][0];

      // Save the top sums
      for(i = 0; i < maxCount + 1 && i < sums.length; i++)
        sumDict[sums[i][0]] = true;  

      for(let row in asset) {
        for(let entry in asset[row]) {

          // Accumulate the rest on the cumRow
          if(!sumDict[row]) {
            if(!sumDict[entry])
              asset[cumRow][cumRow] += asset[row][entry];
            else
              asset[cumRow][entry] += asset[row][entry];
          } else {
            if(!sumDict[entry])
              asset[row][cumRow] += asset[row][entry];
          }

          // Set to 0 if unimportant
          if(!sumDict[row] || !sumDict[entry])
            asset[row][entry] = 0;
        }
      }

      // Accumulate the sum too
      for(let i = maxCount + 1; i < sums.length; i++)
        sums[maxCount][1] += sums[i][1];

      // Truncate the sums
      sums = sums.slice(0, maxCount + 1);

      // Get only the 20 most prominent locations
      for(i = 0; i < sums.length; i++) { 
        let row = sums[i][0];
        
        // Push each of the relationships
        for(let entry in asset[row]) {
          
          // It;s a 0 we don't need
          if(!sumDict[entry])
            continue;

          m.push({
            x: entry == cumRow ? 'other' : entry,
            y: row == cumRow ? 'other' : row,
            value: asset[row][entry]
          });

          // Compute this too
          if(row != entry) {
            m.push({
              x: entry == cumRow ? 'other' : entry,
              y: row == cumRow ? 'other' : row,
              value: asset[entry][row]
            });
          }
        }

        // Save the entry label
        m.labels.push(row);
      }

      // Change last label
      m.labels[m.labels.length - 1] = 'other';

      return m;
    });

    // Display the loaded files
    const dataAssets = dataset.getList();
    dataviserFileList.parentElement.prepend(`Successfully loaded ${dataAssets.length} files:`);

    for(let i = 0; i < dataAssets.length; i++) {

      // For each file we have a button
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

    const dataAssets = dataset.getList();

    // For each data set, we display data
    for(let dataSetKey of dataAssets) {

      // Display the list of read files
      let graph = new Datagraph({ parent: dataviserCatalogue });
      let data = dataset.getData(dataSetKey, 'relation-reduced', {
        maxCount: 16,
      });

      graph.init()
        .addTitle(dataSetKey)
        .addSubtitle('this is a graph for the period ' + dataSetKey)
        .addXAxis({ type: 'categorical', domain: data.labels })
        .addYAxis({ type: 'categorical', domain: data.labels })
        .addColorAxis({ start: 0, end: 2500, startColor: '#212121', endColor: '#6464dd' })
        .addHeatmap(data);
    }

    // ! remove
    dataset.computeCumulative({ startYear: [2020, 2020] });
    dataset.computeTotal()

    let graph = new Datagraph({ parent: dataviserCatalogue });
    let data = dataset.getSummary('total', 'relation-reduced', {
      maxCount: 16,
    });

    graph.init()
      .addTitle('total')
      .addSubtitle('this is a graph for the total duration')
      .addXAxis({ type: 'categorical', domain: data.labels })
      .addYAxis({ type: 'categorical', domain: data.labels })
      .addColorAxis({ start: 0, end: 10000, startColor: '#212121', endColor: '#6464dd' })
      .addHeatmap(data);
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
        dataset = new Dataset(keyParser);

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