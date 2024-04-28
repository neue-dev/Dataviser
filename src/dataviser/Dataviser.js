/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-28 21:12:58
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './Dataviser.css'

import '../ui/Grid.component'
import '../ui/Input.component'
import '../ui/Button.component'
import '../ui/Slider.component'
import '../ui/Editor.component'

import { FileAPI } from './File.api'
import { DataviserPyAPI } from './Dataviser.pyapi'

import { Dataframe } from './Dataframe.class'
import { DatagraphManager } from './Datagraph.class'

// Handles all the data vis
export const Dataviser = (function() {
  
  const root = document.getElementsByClassName('root')[0];
  const dataviserWindow = document.createElement('grid-component');
  const dataviserCatalogue = document.createElement('grid-cell-component');
  const dataviserFileList = document.createElement('div');
  const dataviserInfoBoard = document.createElement('div');
  
  const _ = {
    dfs: {},
  };

  // ! put this guy elsewhere
  const keyParser = key => {
    return {
      date: new Date(key).getTime(),
    }
  }

  // Dataviser menu elements
  dataviserCatalogue.classList.add('dataviser-catalogue');
  dataviserFileList.classList.add('dataviser-file-list');
  dataviserInfoBoard.classList.add('dataviser-info-board');

  // The input fields
  const inputRangeField = document.createElement('input-component');
  const inputIsolateField = document.createElement('input-component');
  
  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    // Create the title and import button
    const importButton = document.createElement('button-component');
    importButton.innerHTML = 'select folder';
    importButton.classList.add('dataviser-import-button');
    importButton.mouseDownCallback = e => {
      _.selectDirectory();
    }

    // The catalogue of graphs
    dataviserWindow.appendCell(3, 1, 3, 4);
    dataviserWindow.getCell(3, 1).classList.add('dataviser-catalogue');

    // The title
    dataviserWindow.appendCell(1, 1);
    dataviserWindow.getCell(1, 1).classList.add('dataviser-title');
    dataviserWindow.getCell(1, 1).append('Dataviser');
    
    // Import button
    dataviserWindow.appendCell(1, 2);
    dataviserWindow.getCell(1, 2).appendChild(importButton);
    
    // File list
    dataviserWindow.appendCell(2, 2);
    dataviserWindow.getCell(2, 2).appendChild(dataviserFileList);
    
    // Input fields
    dataviserWindow.appendCell(1, 3);
    dataviserWindow.getCell(1, 3).append('date filter (heatmaps):');
    dataviserWindow.getCell(1, 3).appendChild(inputRangeField);
    dataviserWindow.getCell(1, 3).append('name filter (series):');
    dataviserWindow.getCell(1, 3).appendChild(inputIsolateField);
    
    // Info board
    dataviserWindow.appendCell(2, 4, 1, 2);
    dataviserWindow.getCell(2, 4).appendChild(dataviserInfoBoard);

    // Populate the fields
    inputRangeField.innerHTML = '2020-01-01, 2021-01-01';
    inputIsolateField.innerHTML = 'type location name here';

    // Append everything to the window
    root.appendChild(dataviserWindow);

    // ! remove
    const d = DatagraphManager.create('test', { '1': { '1': '10', '2': '20' }, '2': { '1': '30', '2': '50' }}, { parent: dataviserWindow.getCell(3, 1) });
    const dgraph = DatagraphManager.get(d);

    setTimeout(() => {
      dgraph.init();
      dgraph.addXAxis({ domain: [0, 1000] })
      dgraph.addYAxis({ domain: [0, 1000] })
      dgraph.drawXAxis()
      dgraph.drawYAxis()
      dgraph.drawTitle()
    })
  }

  /**
   * Configures the dataset object.
   */
  _.configData = function() {

  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {

  }

  /**
   * Selects a directory for the user.
   * This function reads all the JSON files within a directory and stores them as is within our JS object.
   */
  _.selectDirectory = function() {

    // ! remove later
    const dfs = {};
    
    // Let the user pick a directory
    showDirectoryPicker({ id: 'default', mode: 'read' })

      // After selecting a folder
      // ! make sure to use readPickles instead!
      .then(directoryHandle => 
        FileAPI.getDirectoryFiles(directoryHandle, 
          files => files.forEach(
            file => FileAPI.readBinaryFile(file, 
              blob => DataviserPyAPI.readPickle(blob, df => {
                dfs[file.name.split('.')[0]] = df;})))))

      // Catch any errors
      .catch(error => {
        alert(`Error: \n(${error})`)
      })

      setTimeout(() => {
        console.log(Object.keys(dfs).length, dfs)
        console.log(DataviserPyAPI.dfsConcat(dfs, 
          df => console.log(df)));
      }, 10000);
  }

  return {
    ..._,
  }
})();

export default {
  Dataviser
}