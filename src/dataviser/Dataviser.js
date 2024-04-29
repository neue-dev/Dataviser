/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-29 08:44:58
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './Dataviser.css'

import { DOMApi } from './DOM.api'
import { FileAPI } from './File.api'
import { DataviserPyAPI } from './Dataviser.pyapi'

import { Dataframe, DataframeManager } from './Dataframe.class'
import { DatagraphManager } from './Datagraph.class'

// Handles all the data vis
export const Dataviser = (function() {
  
  // The dataviser object and the root element
  const _ = {};
  const root = document.getElementsByClassName('root')[0];
  
  const defaultDgraphConfig = {}
  const params = {
    startDate: null,
    endDate: null,
    locations: [],
  }


  /**
   * This is a helper function.
   * It returns a new function that filters dates.
   * 
   * @param   { object }  options   The options for the filter
   */
  const createFilter = function(options={}) {
    
    /**
     * A function that filters date inputs.
     * 
     * @param   { Date }      d   The date to filter.
     * @return  { boolean }       Whether or not d is in range.
     */
    return function(d) {
      
      const start = options.start ?? new Date('1970-01-01')
      const end = options.end ?? new Date('2038-01-01')

      if(!d.getTime)
        return false;
      
      // The range is inclusive
      return (
        d.getTime() >= start.getTime() && 
        d.getTime() <= end.getTime()
      )
    }
  }

  /**
   * A helper function that takes in the file name and spits out the id for the df.
   * This is use-case specific, but we only have to swap out this function when the spec changes.
   * 
   * @param   { string }  filename  The filename.
   * @return  { Date }              The date associated with the filename.
   */
  const getId = function(filename) {
    return filename.split('.')[0];
  }

  /**
   * A helper function that takes in the id associated with a df and spits out the df serial.
   * This is use-case specific, but we only have to swap out this function when the spec changes.
   * 
   * @param   { string }  id        The df id.
   * @return  { Date }              The date associated with the df.
   */
  const getSerial = function(id) {
    return new Date(id);
  }

  /**
   * This is another helper function.
   * It updates the DOM based on the dfs passed.
   */
  const renderDfs = function(dfs) {
    
    // Define serials
    const serials = {};

    // Define the serials
    for(let key in dfs)
      serials[key] = getSerial(key)

    // We set it to the store so we can perform calculations
    DataframeManager.setStore(dfs, serials);

    // We define our data
    const heatmapData = DataframeManager.getSumDfs(createFilter({
      
    }));
    const heatmapDf = DataframeManager.create('_heatmap', heatmapData, defaultDgraphConfig);
    const heatmapDfList = heatmapDf.toList();
    const heatmapDfCols = heatmapDf.getCols();
    const heatmapDfRows = heatmapDf.getRows();

    console.log(heatmapDfCols);
    console.log(heatmapDfRows)


    // We create three graphs
    const heatmap = DatagraphManager.create('Heatmap over period', heatmapDfList, defaultDgraphConfig);
    const heatmapGraph = DatagraphManager.get(heatmap);

    console.log(heatmapDfList);
    console.log(heatmapGraph);

    setTimeout(() => {
      heatmapGraph.init();
      heatmapGraph.addXAxis({ type: 'categorical', domain: heatmapDfCols })
      heatmapGraph.addYAxis({ type: 'categorical', domain: heatmapDfRows })
      heatmapGraph.addAxis('color', { type: 'color', domain: [0, 1000000], range: [ '#323232', '#5555ff' ]})
      heatmapGraph.drawXAxis()
      heatmapGraph.drawYAxis()
      heatmapGraph.drawTitle()
      heatmapGraph.addHeatmap();
    })
  }
    
  /**
   * The init function sets up dataviser.
   */
  _.init = function() {
    _.configDOM();

    defaultDgraphConfig.width = window.innerWidth * 9 / 16;
    defaultDgraphConfig.height = window.innerHeight * 1 / 1;
    defaultDgraphConfig.parent = DOMApi.get(_.catalogue);
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

    // So the user knows what's going on
    DOMApi.get(_.catalogue).textContent = 'Loading visualizations...';

    // Render all the dataframes
    DataviserPyAPI.dfsFilterRowcols(DataframeManager.getDfs(), [ '78', '2', '8', '5', '13' ], dfs => {
      renderDfs(dfs);

      // Remove loader
      _.renderData();
    })
  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {
    
    // Remove the text content
    DOMApi.get(_.catalogue).textContent = ''

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
          const id = getId(file.name);
          const serial = getSerial(id);
          
          // Save the dataframe
          DataframeManager.create(id, df, serial);

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