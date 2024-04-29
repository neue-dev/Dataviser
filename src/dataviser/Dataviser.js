/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-29 12:37:21
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
    const heatmapData = DataframeManager.getSumDfs();
    const seriesRowsData = {}; Object.keys(dfs).forEach(key => seriesRowsData[key] = new Dataframe('', dfs[key]).getRowSums())
    const seriesColsData = {}; Object.keys(dfs).forEach(key => seriesColsData[key] = new Dataframe('', dfs[key]).getColSums())
    
    // The dfs and their properties
    let heatmapDf = DataframeManager.create('_heatmap', heatmapData);
    let heatmapDfList = heatmapDf.toList();
    let seriesRowsList = {}, seriesRowsMin = Number.POSITIVE_INFINITY, seriesRowsMax = Number.NEGATIVE_INFINITY;
    let seriesColsList = {}, seriesColsMin = Number.POSITIVE_INFINITY, seriesColsMax = Number.NEGATIVE_INFINITY;
    
    // Create the row based data
    for(let df in seriesRowsData) {
      for(let row in seriesRowsData[df]) {
        if(!seriesRowsList[row])
          seriesRowsList[row] = [];
        
        seriesRowsList[row].push({
          x: new Date(df),
          y: seriesRowsData[df][row],
        })

        if(seriesRowsData[df][row] < seriesRowsMin) seriesRowsMin = seriesRowsData[df][row];
        if(seriesRowsData[df][row] > seriesRowsMax) seriesRowsMax = seriesRowsData[df][row];
      }
    }

    // Create the col based data
    for(let df in seriesColsData) {
      for(let col in seriesColsData[df]) {
        if(!seriesColsList[col])
          seriesColsList[col] = [];
        
        seriesColsList[col].push({
          x: new Date(df),
          y: seriesColsData[df][col],
        })

        if(seriesColsData[df][col] < seriesColsMin) seriesColsMin = seriesColsData[df][col];
        if(seriesColsData[df][col] > seriesColsMax) seriesColsMax = seriesColsData[df][col];
      }
    }

    // The title
    const heatmapTitle = `Heatmap of Immigration Across Thailand`;
    const seriesRowsTitle = `Series for outward migration.`;
    const seriesColsTitle = `Series for inward migration migration.`;
    const subtitle = `
      ${params.startDate.toDateString()} - ${params.endDate.toDateString()} 
      for ${heatmapDf.getCols().length} provinces
    `;

    // We create three graphs
    const heatmap = DatagraphManager.create(heatmapTitle, heatmapDfList, { ...defaultDgraphConfig, subtitle });
    const seriesRows = DatagraphManager.create(seriesRowsTitle, seriesRowsList, { ...defaultDgraphConfig, subtitle });
    const seriesCols = DatagraphManager.create(seriesColsTitle, seriesColsList, { ...defaultDgraphConfig, subtitle });

    _.heatmapGraph = DatagraphManager.get(heatmap);
    _.seriesRowsGraph = DatagraphManager.get(seriesRows);
    _.seriesColsGraph = DatagraphManager.get(seriesCols);

    const startDate = params.startDate ?? new Date('2015-01-01')
    const endDate = params.endDate ?? new Date('2025-01-01')

    setTimeout(() => {
      _.heatmapGraph.init();
      _.heatmapGraph.addXAxis({ type: 'categorical', domain: heatmapDf.getCols() })
      _.heatmapGraph.addYAxis({ type: 'categorical', domain: heatmapDf.getRows() })
      _.heatmapGraph.addAxis('color', { type: 'color', domain: [heatmapDf.getMin(), heatmapDf.getMax()], range: [ '#ffffff', '#082188' ]})
      _.heatmapGraph.drawXAxis()
      _.heatmapGraph.drawYAxis()
      _.heatmapGraph.drawTitle()
      _.heatmapGraph.drawSubtitle()
      _.heatmapGraph.addHeatmap({ mouseover: showTooltip, mouseleave: hideTooltip });

      _.seriesRowsGraph.init();
      _.seriesRowsGraph.addXAxis({ type: 'time', domain: [ startDate, endDate ] })
      _.seriesRowsGraph.addYAxis({ type: 'linear', domain: [ seriesRowsMin, seriesRowsMax ] })
      _.seriesRowsGraph.drawXAxis()
      _.seriesRowsGraph.drawYAxis()
      _.seriesRowsGraph.drawTitle()
      _.seriesRowsGraph.drawSubtitle()
      _.seriesRowsGraph.addTimeline({ mouseover: showTooltip, mouseleave: hideTooltip });

      _.seriesColsGraph.init();
      _.seriesColsGraph.addXAxis({ type: 'time', domain: [ startDate, endDate ] })
      _.seriesColsGraph.addYAxis({ type: 'linear', domain: [ seriesColsMin, seriesColsMax ] })
      _.seriesColsGraph.drawXAxis()
      _.seriesColsGraph.drawYAxis()
      _.seriesColsGraph.drawTitle()
      _.seriesColsGraph.drawSubtitle()
      _.seriesColsGraph.addTimeline({ mouseover: showTooltip, mouseleave: hideTooltip });
    })
  }

  /**
   * Clear the graphs we have.
   * Clear the df store.
   */
  const clearDfs = function() {
    DataframeManager.revertStore();
    _.heatmapGraph.clear();
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
    _.filterDate = DOMApi.create('dataviser-filter-date', 'input-component', panel, 'date filter');
    
    DOMApi.create('dataviser-body-text', 'div', panel, '<br>Specify locations here.');
    _.filterLocs = DOMApi.create('dataviser-filter-locs', 'input-component', panel, 'locs filter');

    // Other DOM parts
    DOMApi.create('dataviser-body-text', 'div', 'root', '<br>');    
    _.filelist = DOMApi.create('dataviser-filelist', 'ol');

    DOMApi.create('dataviser-body-text', 'div', 'root', '<br>');
    _.catalogue = DOMApi.create('dataviser-catalogue', 'div');

    // Tooltip
    _.tooltip = DOMApi.create('dataviser-tooltip', 'div', 'root', 'hello world');

    // Add event listeners
    document.onmousemove = e => {
      DOMApi.get(_.tooltip).style.top = e.clientY - 45 + 'px';
      DOMApi.get(_.tooltip).style.left = e.clientX + 50 + 'px';
    }

    DOMApi.get(buttonImport).mouseDownCallback = e => {
      _.selectDirectory();
    }
  }

  const showTooltip = function(e, d) {

    if(d) {
      DOMApi.get(_.tooltip).innerHTML = `
        <span style='font-size: 0.8em; font-family: SFProItalic; opacity: 0.5;'>
          from: ${d.y}, to: ${d.x} <br>
        </span>
        ${d.value} <br>
      `;
      
    } else {
      DOMApi.get(_.tooltip).innerHTML = e.target.textContent;
    }
  
    DOMApi.get(_.tooltip).style.opacity = '1';
  }

  const hideTooltip = function(e, d) {
    DOMApi.get(_.tooltip).style.opacity = '0';
  }

  const onFilterSubmit = function(e) {
    
    // Clear old dfs 
    clearDfs();

    // Filter fields
    const filterDate = DOMApi.get(_.filterDate);
    const filterLocs = DOMApi.get(_.filterLocs);
    
    // Remove old event listeners
    filterDate.submitCallback = null;
    filterLocs.submitCallback = null;

    // So the user knows what's going on
    DOMApi.get(_.catalogue).textContent = 'Loading visualizations...';

    // We infer the date range from the filenames too
    params.startDate = new Date(filterDate.textContent.split(',')[0].trim())
    params.endDate = new Date(filterDate.textContent.split(',')[1].trim())

    // We derive the top most pronounced data points
    let rowcols = filterLocs.textContent.split(',').map(t => t.trim());

    // Update the fields
    DOMApi.get(_.filterLocs).innerHTML = `${rowcols.join(', ')}`;
    DOMApi.get(_.filterDate).innerHTML = `
      ${params.startDate.getFullYear()}-${params.startDate.getMonth() + 1}-${params.startDate.getDate()}, 
      ${params.endDate.getFullYear()}-${params.endDate.getMonth() + 1}-${params.endDate.getDate()}
    `;
    
    console.log(rowcols);
    
    // Render all the dataframes
    DataviserPyAPI.dfsFilterRowcols(DataframeManager.getDfs(createFilter({
      start: params.startDate,
      end: params.endDate,
    })), rowcols, dfs => {
      
      // Convert into datagraphs
      renderDfs(dfs);

      // Remove loader
      _.renderData();

      // Append event listeners
      DOMApi.get(_.filterDate).submitCallback = onFilterSubmit
      DOMApi.get(_.filterLocs).submitCallback = onFilterSubmit
    })
  }

  /**
   * Generates a sum of all the dataframes we have and does some other data cleaning.
   */
  _.configData = function() {

    // So the user knows what's going on
    DOMApi.get(_.catalogue).textContent = 'Loading visualizations...';

    // We infer the date range from the filenames too
    const dates = Object.keys(DataframeManager.getDfs());
    params.startDate = new Date(dates.sort((a, b) => a.localeCompare(b))[0]);
    params.endDate = new Date(dates.sort((a, b) => b.localeCompare(a))[0]);

    // We derive the top most pronounced data points
    const sumDf = new Dataframe('', DataframeManager.getSumDfs());
    const sumDfsumRows = sumDf.getRowSums();
    const sumDfsumCols = sumDf.getColSums();
    const maxCount = 16;
    let rowcols = sumDf.getCols();
    
    // Sort the rows and cols by non-ascending order
    rowcols.sort((a, b) => {
      return (
        sumDfsumCols[b] + sumDfsumRows[b] - 
        sumDfsumCols[a] - sumDfsumRows[a]
      )
    })

    // Get the top n data points
    rowcols = rowcols.slice(0, maxCount)

    // Update the fields
    DOMApi.get(_.filterLocs).innerHTML = `${rowcols.join(', ')}`;
    DOMApi.get(_.filterDate).innerHTML = `
      ${params.startDate.getFullYear()}-${params.startDate.getMonth() + 1}-${params.startDate.getDate()}, 
      ${params.endDate.getFullYear()}-${params.endDate.getMonth() + 1}-${params.endDate.getDate()}
    `;

    // Render all the dataframes
    DataviserPyAPI.dfsFilterRowcols(DataframeManager.getDfs(), rowcols, dfs => {
      
      // Convert into datagraphs
      renderDfs(dfs);

      // Remove loader
      _.renderData();

      // Append event listeners
      DOMApi.get(_.filterDate).submitCallback = onFilterSubmit
      DOMApi.get(_.filterLocs).submitCallback = onFilterSubmit
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