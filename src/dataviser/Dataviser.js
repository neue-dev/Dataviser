/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-28 22:49:47
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './Dataviser.css'

import { DOMApi } from './DOM.api'
import { FileAPI } from './File.api'
import { DataviserPyAPI } from './Dataviser.pyapi'

import { DataframeManager } from './Dataframe.class'
import { DatagraphManager } from './Datagraph.class'

// Handles all the data vis
export const Dataviser = (function() {
  
  const root = document.getElementsByClassName('root')[0];

  const dataviserWindow = document.createElement('grid-component');
  const dataviserFileList = document.createElement('div');
  const dataviserInfoBoard = document.createElement('div');
  
  const _ = {};

  // ! put this guy elsewhere
  const keyParser = key => {
    return {
      date: new Date(key).getTime(),
    }
  }

  // The input fields
  const inputRangeField = document.createElement('input-component');
  const inputIsolateField = document.createElement('input-component');
  
  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    // ! remove this here ig
    _.configDOM();
  }

  _.configDOM = function() {

    // Create the DOM
    DOMApi.setRoot(root);
    DOMApi.create('dataviser-title', 'div', 'root', 'Thailand Immigration Data');
    DOMApi.create('dataviser-import-button', 'button-component', 'root', 'import files');
    DOMApi.create('dataviser-filter-date', 'input-component', 'root', 'date filter');
    DOMApi.create('dataviser-filter-locs', 'input-component', 'root', 'locs filter');
    DOMApi.create('dataviser-filelist', 'div');
    DOMApi.create('dataviser-infoboard', 'div');

    // Add event listeners
    DOMApi.get('dataviser-import-button').mouseDownCallback = e => {
      _.selectDirectory();
    }
  }

  /**
   * Generates a sum of all the dataframes we have and does some other data cleaning.
   */
  _.configData = function() {
    
    // Compute the total df for all of them
    DataviserPyAPI.dfsConcat(

      // Get all the dfs and pass them here
      DataframeManager.getDfs(), 
    
      // For the resulting concatenated df, store it
      df => {

        // Create the dataframe
        DataframeManager.create('total', df);
      
        // Render data
        _.renderData();
      }
    );
  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {
    
    // ! remove
    const d = DatagraphManager.create('test', DataframeManager.getDf('total'), { parent: dataviserWindow.getCell(3, 1) });
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
   * Reads a collection of binary files and serializes them.
   * Converts the file contents into dataframes.
   * NOTE this function assumes that all the files are pickle files.
   * 
   * @param   { array }   files   An array of file handles to read.
   */
  _.readData = function(files) {
    
    // For each of the files
    files.forEach(file => {
      
      // Read the file contents
      FileAPI.readBinaryFile(file, blob => {

        // Convert the blob into a df
        DataviserPyAPI.readPickle(blob, df => {
          
          // Id of the dataframe
          const id = file.name.split('.')[0];
          
          // Save the dataframe
          DataframeManager.create(id, df);

          // Get the current count 
          const count = DataframeManager.getCount();
          
          // Output progress
          console.info(`Read pickle file ${count} of ${files.length}...`);

          // If it's the last dataframe, do this
          if(count >= files.length)
            _.configData();
        })
      })
    })
  }

  /**
   * Selects a directory for the user.
   * This function reads all the JSON files within a directory and stores them as is within our JS object.
   */
  _.selectDirectory = function() {
    
    // Let the user pick a directory
    showDirectoryPicker({ id: 'default', mode: 'read' })

      // After selecting a folder
      .then(directoryHandle => 
        FileAPI.getDirectoryFiles(directoryHandle, 
          files => _.readData(files)))

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
  Dataviser
}