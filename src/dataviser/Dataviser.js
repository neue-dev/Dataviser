/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-28 23:55:29
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
  
  // The dataviser object and the root element
  const _ = {};
  const root = document.getElementsByClassName('root')[0];
    
  /**
   * The init function sets up dataviser.
   */
  _.init = function() {
    
    // ! remove this here ig
    _.configDOM();
  }

  /**
   * This function configures the initial state of the DOM.
   */
  _.configDOM = function() {

    // Create the DOM
    DOMApi.setRoot(root);
    const title = DOMApi.create('dataviser-title', 'div', 'root', 'Thailand Immigration Data');
    const panel = DOMApi.create('dataviser-panel', 'div', 'root');
    
    // Some interactive UI
    DOMApi.create('dataviser-body-text', 'div', 'root', '<br>Select the folder containing all the .pkl files.');    
    const buttonImport = DOMApi.create('dataviser-import-button', 'button-component', 'root', 'import files');
    
    DOMApi.create('dataviser-body-text', 'div', panel, '<br>Specify a date range here.');
    const filterDate = DOMApi.create('dataviser-filter-date', 'input-component', panel, 'date filter');
    
    DOMApi.create('dataviser-body-text', 'div', panel, '<br>Specify locations here.');
    const filterLocs = DOMApi.create('dataviser-filter-locs', 'input-component', panel, 'locs filter');

    // Other DOM parts
    DOMApi.create('dataviser-body-text', 'div', 'root', '<br>');    
    _.filelist = DOMApi.create('dataviser-filelist', 'ol');

    DOMApi.create('dataviser-body-text', 'div', 'root', '<br>');
    _.catalogue = DOMApi.create('dataviser-catalogue', 'div');

    // Add event listeners
    DOMApi.get(buttonImport).mouseDownCallback = e => {
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
    
    // // ! remove
    const d = DatagraphManager.create('test', DataframeManager.getDf('total'), 
      {
        width: window.innerWidth * 9 / 16,
        height: window.innerHeight * 1 / 1, 
        parent: DOMApi.get(_.catalogue) 
      });
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
   * Renders the current files we have stored. 
   */
  _.renderFiles = function() {
    
    // Reset content first
    DOMApi.get(_.filelist).innerHTML = '';
    
    // Display filenames
    _.files.forEach(file => {
      DOMApi.get(_.filelist).innerHTML += `
        <li class='dataviser-filelist-name'>
          ${file}
        </li>
      `
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

    // Store all the filenames and set DOM to loading
    _.files = [];
    DOMApi.get(_.filelist).innerHTML = 'Loading files...';
    
    // For each of the files
    files.forEach(file => {
      
      // Save the filename
      _.files.push(file.name)

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
          if(count >= files.length) {
            _.renderFiles();
            _.configData();
          }
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