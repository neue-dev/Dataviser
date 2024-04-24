/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-24 15:04:43
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
  const d3Assets = {};

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
    canvasCell.appendChild(dataviserCanvas);

    // Construct the tree
    dataviserWindow.appendChild(titleCell);
    dataviserWindow.appendChild(importCell);
    dataviserWindow.appendChild(canvasCell);
    root.appendChild(dataviserWindow);
  }

  /**
   * Loads the existing data to be represented on the UI.
   */
  _.loadData = function() {
    // Performs cleanup on the data
    
    
    // for(let dataKey in data) {
    //   let dataSet = data[dataKey];
    //   let dataArray = [];

    //   // Convert into an array of objects
    //   for(let dataEntry in dataSet) {
    //     dataSet[dataEntry]['index'] = dataEntry;
    //     dataArray.push(dataSet[dataEntry]);
    //   }

    //   // Convert intro a dataframe
    //   jd.dfFromObjArray(dataArray).p()
    // }
  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {

    // The matrices we're gonna create
    const matrices = {};

    // The actual graphs and stuff
    d3Assets.chords = {};
    d3Assets.ribbons = {};

    // For each data set, we create a matrix
    for(let dataSetKey in data) {
      let matrix = [];
      
      for(let dataRow in data[dataSetKey]) {
        let matrixRow = [];

        for(let dataEntry in data[dataSetKey][dataRow]) 
          matrixRow.push(data[dataSetKey][dataRow][dataEntry]);
        
        matrix.push(matrixRow);
      }

      matrices[dataSetKey] = matrix;
      d3Assets.chords[dataSetKey] = d3
        .chord()
        .padAngle(0.02)
        .sortSubgroups(d3.descending)
        (matrix);
      
      // Create the svg area first
      const svg = d3
        .select(".canvas")
        .append("svg")
          .attr("width", 880)
          .attr("height", 880)
        .append("g")
          .attr("transform", "translate(440,440)")
      
      svg
        .datum(d3Assets.chords[dataSetKey])
        .append("g")
        .selectAll("g")
        .data(function(d) { return d.groups; })
        .enter()
        .append("g")
        .append("path")
          .style("fill", "grey")
          .style("stroke", "transparent")
          .attr("d", d3.arc()
            .innerRadius(400)
            .outerRadius(410)
          )

      svg
        .datum(d3Assets.chords[dataSetKey])
        .append("g")
        .selectAll("path")
        .data(function(d) { return d; })
        .enter()
        .append("path")
          .attr("d", d3.ribbon()
            .radius(400)
          )
          .style("fill", "#69b3a2")
          .style("stroke", "transparent");

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

      // Load data
      }).then(() => {
        _.loadData();
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