/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-24 15:59:59
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
    const names = [];
    const colors = [];

    // The actual graphs and stuff
    d3Assets.chords = {};
    d3Assets.ribbons = {};

    // For each data set, we create a matrix
    for(let dataSetKey in data) {
      let matrix = [];
      
      for(let dataRow in data[dataSetKey]) {
        let matrixRow = [];
        let count = 0, c = '';
        
        for(let dataEntry in data[dataSetKey][dataRow]) { 
          matrixRow.push(data[dataSetKey][dataRow][dataEntry]);
          names[count] = dataEntry;
          
          c = (count * 3).toString(16).length < 2 ? '0' + count.toString(16) : count.toString(16);
          colors.push(`#${c}3232`);
          count++;
          console.log(count);
        }

        matrix.push(matrixRow);
      }

      matrices[dataSetKey] = matrix;
      d3Assets.chords[dataSetKey] = d3
        .chord()
        .padAngle(0.01)
        .sortSubgroups(d3.descending)
        (matrix);

      // Hover tooltip
      const tooltip = d3.select(".canvas")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("display", "fixed")

      const showTooltip = function(e, d) {
        tooltip
          .style("opacity", 1)
          .style("left", (e.screenX + 15) + "px")
          .style("top", (e.screenY - 28) + "px")
          .html("From: " + names[d.source.index] + " To: " + names[d.target.index])
      }

      const hideTooltip = function(e, d) {
        tooltip
          .transition()
          .duration(1000)
          .style("opacity", 0)
      }
      
      // Create the svg area first
      const svg = d3
        .select(".canvas")
        .append("svg")
          .attr("width", 640)
          .attr("height", 640)
        .append("g")
          .attr("transform", "translate(320,320)")
          
      svg
        .datum(d3Assets.chords[dataSetKey])
        .append("g")
        .selectAll("path")
        .data(function(d) { return d; })
        .enter()
        .append("path")
          .attr("d", d3.ribbon()
            .radius(300)
          )
          .style("fill", function(d){ return colors[d.source.index] })
          .style("stroke", "transparent")
          .on("mouseover", showTooltip )
          .on("mouseleave", hideTooltip )
          
      svg
        .datum(d3Assets.chords[dataSetKey])
        .append("g")
        .selectAll("g")
        .data(function(d) { return d.groups; })
        .enter()
        .append("g")
        .append("path")
          .style("fill", function(d,i){ return colors[i] })          
          .style("stroke", "transparent")
          .attr("d", d3.arc()
            .innerRadius(310)
            .outerRadius(320)
          )

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