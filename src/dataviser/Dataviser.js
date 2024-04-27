/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-27 19:34:56
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './Dataviser.css'

import '../ui/Grid.component'
import '../ui/Input.component'
import '../ui/Button.component'
import '../ui/Slider.component'

import { Dataset } from './Dataset.class'
import { Datagraph } from './Datagraph.class'
import { PyodideAPI } from './Pyodide'

// Handles all the data vis
export const dataviser = (function() {
  const _ = {};
  const root = document.getElementsByClassName('root')[0];

  // ! put this guy elsewhere
  const keyParser = key => {
    let startDate = key.split('_')[0];
    let endDate = key.split('_')[1];

    return {
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
    }
  }

  // Dataviser menu elements
  const dataviserWindow = document.createElement('grid-component');

  // Dataviser d3 canvases
  const dataviserCatalogue = document.createElement('grid-cell-component');
  dataviserCatalogue.classList.add('dataviser-catalogue');

  // Dataviser file list
  const dataviserFileList = document.createElement('div');
  dataviserFileList.classList.add('dataviser-file-list');

  // Where we put the info highlights
  const dataviserInfoBoard = document.createElement('div');
  dataviserInfoBoard.classList.add('dataviser-info-board');

  // The input fields
  const inputRangeField = document.createElement('input-component');
  const inputIsolateField = document.createElement('input-component');
  
  // The dataset and datagraphs we need
  let dataset = new Dataset(keyParser);
  let datagraphs = {
    heatmapSingle:        new Datagraph({ parent: dataviserCatalogue }),
    heatmapCumulative:    new Datagraph({ parent: dataviserCatalogue }),
    seriesSingleColumn:   new Datagraph({ parent: dataviserCatalogue }),
    seriesSingleRow:      new Datagraph({ parent: dataviserCatalogue }),
  }
  
  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    // Cells
    const titleCell = document.createElement('grid-cell-component');
    const importCell = document.createElement('grid-cell-component');
    const fileListCell = document.createElement('grid-cell-component');
    const dataInfoCell = document.createElement('grid-cell-component');
    const inputCell = document.createElement('grid-cell-component');

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
    fileListCell.setPlacement(2, 2);
    fileListCell.setDimensions(1, 1);
    fileListCell.appendChild(dataviserFileList);

    // Configure the input cell
    inputCell.setPlacement(1, 3);
    inputCell.setDimensions(1, 2);
    inputCell.append('Date filter (heatmaps):');
    inputCell.appendChild(inputRangeField);
    inputCell.append('Name filter (series):');
    inputCell.appendChild(inputIsolateField);

    // Populate the fields
    inputRangeField.innerHTML = '2020-01-01, 2021-01-01';
    inputIsolateField.innerHTML = 'type location name here';

    // Data info cell
    dataInfoCell.setPlacement(2, 4);
    dataInfoCell.setDimensions(1, 2);
    dataInfoCell.appendChild(dataviserInfoBoard);

    // Construct the tree
    dataviserWindow.appendChild(titleCell);
    dataviserWindow.appendChild(importCell);
    dataviserWindow.appendChild(fileListCell);
    dataviserWindow.appendChild(inputCell);
    dataviserWindow.appendChild(dataInfoCell);
    dataviserWindow.appendChild(dataviserCatalogue);
    root.appendChild(dataviserWindow);
  }

  /**
   * Configures the dataset object.
   */
  _.configData = function() {

    /**
     * Parses the raw data and converts into a 2d matrix.
     * 
     * // ! store min and max!
     */
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

    /**
     * This parser converts the raw data into a 2x2 matrix
     * However, it only gets data from the n most significant parties
     */
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
          sum += asset[row][entry] + (entry != row ? asset[entry][row] : 0);
        sums.push([row, sum]);
      }

      // Sort sums by size
      sums.sort((a, b) => b[1] - a[1]);

      // There's nothing
      if(!sums.length) return m;
      
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

    /**
     * This parser converts the raw data into a list of associations
     * ! makr sure to store min and max
     */
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

    /**
     * This parser converts the raw data into a list of associations
     * However, it only gets data points from the n most significant parties
     */
    dataset.addParser('relation-reduced', (asset, options={}) => {

      // Clone the object first
      asset = structuredClone(asset);

      // We define a list
      let m = [];
      let sums = [];
      m.labels = [];
      m.min = Number.POSITIVE_INFINITY;
      m.max = Number.NEGATIVE_INFINITY;

      // Max count
      const maxCount = options.maxCount ?? 16;
        
      // Generate sums per row and column
      for(let row in asset) {
        let sum = 0;
        
        // Add the row and columns
        for(let entry in asset[row])
          sum += asset[row][entry] + (entry != row ? asset[entry][row] : 0);
        sums.push([row, sum]);
      }

      // Sort sums by size
      sums.sort((a, b) => b[1] - a[1]);

      // There's nothing
      if(!sums.length) return m;
      
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

          if(m.min > asset[row][entry]) m.min = asset[row][entry]
          if(m.max < asset[row][entry]) m.max = asset[row][entry]

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

    /**
     * Parses series data into something we can print
     */
    dataset.addParser('series-list', (series, options={}) => {
      
      // Duplicate so we don't accidentally modify it
      series = structuredClone(series);

      // The list and the keys
      const list = [];
      const seriesKeys = Object.keys(series);

      // Define maxima
      list.min = Number.POSITIVE_INFINITY;
      list.max = Number.NEGATIVE_INFINITY;

      for(let i = 0; i < seriesKeys.length; i++) {
        let sum = 0;
        let seriesEntryKeys = Object.keys(series[seriesKeys[i]]);
        
        for(let j = 0; j < seriesEntryKeys.length; j++)
          if(!isNaN(parseInt(series[seriesKeys[i]][seriesEntryKeys[j]])))
            sum += parseInt(series[seriesKeys[i]][seriesEntryKeys[j]]);

        list.push({
          x: new Date(parseInt(series[seriesKeys[i]].metadata.startDate)),
          y: sum,
        })

        if(list.min > sum) list.min = sum;
        if(list.max < sum) list.max = sum;
      }

      return list;

    }, 'series');

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

    // Get the list of data assets first
    let dataAssets = dataset.getList();
    let currentSeries = '2';

    let startDate = new Date('2019-01-01');
    let endDate = new Date('2021-12-31');

    // Compute summaries
    dataset.computeTotal()
    dataset.computeSeries(currentSeries, { type: 'row', savekey: 'series-row' });
    dataset.computeSeries(currentSeries, { type: 'column', savekey: 'series-column' });

    // Our data
    let data = dataset.getData(dataAssets[0], 'relation-reduced', { maxCount: 16 });
    let summary = dataset.getSummary('total', 'relation-reduced', { maxCount: 16, });
    let seriesRow = dataset.getSeries('series-row', 'series-list', {});
    let seriesColumn = dataset.getSeries('series-column', 'series-list', {});

    // When the user presses enter for one of the fields
    const submitRange = (e, text) => {
      startDate = new Date(text.trim().split(',')[0].trim());
      endDate = new Date(text.trim().split(',')[1].trim());

      // Invalid dates
      if(isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
        return;

      // Compute the date range
      dataset.computeCumulative({ savekey: 'cumulative', startDate: [ startDate.getTime(), endDate.getTime() ] });
      summary = dataset.getSummary('cumulative', 'relation-reduced', { maxCount: 16, });

      // Clear old data graph
      datagraphs.heatmapCumulative.clear();
      datagraphs.seriesSingleColumn.clear();
      datagraphs.seriesSingleRow.clear();

      // Heatmap for cumulative data
      datagraphs.heatmapCumulative
        .addTitle(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`)
        .addSubtitle('this is a heatmap over the specified date range')
        .addXAxis({ type: 'categorical', domain: summary.labels })
        .addYAxis({ type: 'categorical', domain: summary.labels })
        .addColorAxis({ start: summary.min, end: summary.max / 4, startColor: '#212121', endColor: '#6464dd' })
        .addHeatmap(summary, { mouseover: mouseoverHeatmap });

      // Series for a single series
      datagraphs.seriesSingleColumn
        .addTitle('inward migration for ' + currentSeries)
        .addSubtitle('the number of people who migrated to 2')
        .addXAxis({ type: 'time', start: startDate, end: endDate })
        .addYAxis({ type: 'linear', start: seriesColumn.min, end: seriesColumn.max })
        .addTimeline(seriesColumn, { mouseover: mouseoverTimeline });

      // Series for a single series
      datagraphs.seriesSingleRow 
        .addTitle('outward migration for ' + currentSeries)
        .addSubtitle('the number of people who migrated away from 2')
        .addXAxis({ type: 'time', start: startDate, end: endDate })
        .addYAxis({ type: 'linear', start: seriesRow.min, end: seriesRow.max })
        .addTimeline(seriesRow, { mouseover: mouseoverTimeline });
    }

    // When the user presses enter for one of the fields
    const submitIsolate = (e, text) => {
      
      // Get the input
      currentSeries = text.trim()
      
      // Not valid
      if(!(currentSeries in dataset.get(dataAssets[0])))
        return;

      // Compute the series
      dataset.computeSeries(currentSeries, { type: 'row', savekey: 'series-row' });
      dataset.computeSeries(currentSeries, { type: 'column', savekey: 'series-column' });
      
      seriesRow = dataset.getSeries('series-row', 'series-list', {});
      seriesColumn = dataset.getSeries('series-column', 'series-list', {});

      // Clear the graphs
      datagraphs.seriesSingleColumn.clear();
      datagraphs.seriesSingleRow.clear();

      // Series for a single series
      datagraphs.seriesSingleColumn
        .addTitle('inward migration for ' + currentSeries)
        .addSubtitle('the number of people who migrated to 2')
        .addXAxis({ type: 'time', start: startDate, end: endDate })
        .addYAxis({ type: 'linear', start: seriesColumn.min, end: seriesColumn.max })
        .addTimeline(seriesColumn, { mouseover: mouseoverTimeline });

      // Series for a single series
      datagraphs.seriesSingleRow 
        .addTitle('outward migration for ' + currentSeries)
        .addSubtitle('the number of people who migrated away from 2')
        .addXAxis({ type: 'time', start: startDate, end: endDate })
        .addYAxis({ type: 'linear', start: seriesRow.min, end: seriesRow.max })
        .addTimeline(seriesRow, { mouseover: mouseoverTimeline });
    }

    // We're hovering over heatmap
    const mouseoverHeatmap = (e, d) => {
      dataviserInfoBoard.style.opacity = 1;
      dataviserInfoBoard.innerHTML = `
        <span style='opacity: 0.5; font-size: 0.6rem; padding: 0;'>From: ${d.x}</span>
        <span style='opacity: 0.5; font-size: 0.6rem; padding: 0;'>To: ${d.y}</span><br>
        ${d.value}
      `;
    }

    // We're hovering over time series
    const mouseoverTimeline = (e, d) => {
      dataviserInfoBoard.style.opacity = 1;
      dataviserInfoBoard.innerHTML = `
        <span style='opacity: 0.5; font-size: 0.6rem; padding: 0;'>Date: ${d.x.toLocaleDateString()}</span><br>
        ${d.y}
      `;
    }
    
    // Heatmap for cumulative data
    datagraphs.heatmapCumulative.init()
      .addTitle('total')
      .addSubtitle('this is a heatmap over the total date range')
      .addXAxis({ type: 'categorical', domain: summary.labels })
      .addYAxis({ type: 'categorical', domain: summary.labels })
      .addColorAxis({ start: summary.min, end: summary.max / 4, startColor: '#212121', endColor: '#6464dd' })
      .addHeatmap(summary, { mouseover: mouseoverHeatmap });

    // !Remove this maybe?
    // // Heatmap for a single file
    // datagraphs.heatmapSingle.init()
    //   .addTitle(dataAssets[0])
    //   .addSubtitle('this is a heatmap for the period ' + dataAssets[0])
    //   .addXAxis({ type: 'categorical', domain: data.labels })
    //   .addYAxis({ type: 'categorical', domain: data.labels })
    //   .addColorAxis({ start: data.min, end: data.max / 4, startColor: '#212121', endColor: '#6464dd' })
    //   .addHeatmap(data, { mouseover: mouseoverHeatmap });

    // ! make sure date ranges here match the input
    // ! create hover for series
    // Series for a single series
    datagraphs.seriesSingleColumn.init() 
      .addTitle('inward migration for ' + currentSeries)
      .addSubtitle('the number of people who migrated to 2')
      .addXAxis({ type: 'time', start: startDate, end: endDate })
      .addYAxis({ type: 'linear', start: seriesColumn.min, end: seriesColumn.max })
      .addTimeline(seriesColumn, { mouseover: mouseoverTimeline });

    // Series for a single series
    datagraphs.seriesSingleRow.init() 
      .addTitle('outward migration for ' + currentSeries)
      .addSubtitle('the number of people who migrated away from 2')
      .addXAxis({ type: 'time', start: startDate, end: endDate })
      .addYAxis({ type: 'linear', start: seriesRow.min, end: seriesRow.max })
      .addTimeline(seriesRow, { mouseover: mouseoverTimeline });

    // Add event listeners
    inputRangeField.submitCallback = submitRange;
    inputIsolateField.submitCallback = submitIsolate;

    // ! remove
    // dataset.computeCumulative({ startDate: [new Date('2019-12-31').getTime(), new Date('2020-12-31').getTime()] });
    // dataset.computeSeries('2', { type: 'row', savekey: 'test' });
    
    // let seriesd = dataset.getSeries('test', 'series-list');
    // let seriesg = new Datagraph({ parent: dataviserCatalogue });
    // let graph = new Datagraph({ parent: dataviserCatalogue });
    // let data = dataset.getSummary('total', 'relation-reduced', {
    //   maxCount: 16,
    // });

    // console.log(seriesd);

    // seriesg.init()
    //   .addTitle('series')
    //   .addSubtitle('hehe')
    //   .addXAxis({ type: 'time', start: new Date('2020-01-01'), end: new Date('2021-12-01') })
    //   .addYAxis({ type: 'linear', start: seriesd.min, end: seriesd.max })
    //   .addTimeline(seriesd);
  }

  /**
   * Converts the raw binary we read from a file into a Python object.
   * 
   * @param   { Uint8Array }  uint8array  The data we want to convert. 
   */
  _.unpickleBinaryData = function(uint8array) {
    PyodideAPI.runProcess(`
      import pickle
      from js import byte_array

      byte_string = bytes(byte_array)
      print(pickle.loads(byte_string))
      `,
      { byte_array: uint8array }
    );
  }

  /**
   * Converts the raw binary we read from a file into a Python object.
   * 
   * @param   { Uint8Array }  uint8array  The data we want to convert. 
   */
  _.unpickleBinaryFile = function(file) {
    const fileReader = new FileReader();
            
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const uint8array = new Uint8Array(e.target.result);
      _.unpickleBinaryData(uint8array);
    }
  }

  _.traverseDirectory = async function(directoryHandle) {
    
    // Queue of the different directories to parse
    let directoryHandles = [ directoryHandle ];
    let i = 0, fileCount = 0;

    // This loop counts the number of files first
    do {

      // Go to the next handle
      directoryHandle = directoryHandles[i++];

      // For each thing inside the folder
      for await(let entryHandle of directoryHandle.values()) {
      
        // Add subdirectory to queue
        if(entryHandle.kind == 'directory')
        directoryHandles.push(entryHandle);

        // Add file to file list
        else fileCount++;
      }

    // While we have stuff in the queue
    } while(i < directoryHandles.length)

    // This loop reads each of the files and saves the raw data
    // After that, it configures the data and some other stuff
    i = 0;
    do {

      // Go to the next handle
      directoryHandle = directoryHandles[i++];

      // For each thing inside the folder
      for await(let entryHandle of directoryHandle.values()) {
      
        // Add file to list
        if(entryHandle.kind == 'file')
          entryHandle.getFile().then(file => _.unpickleBinaryFile(file));
      }

    // While we have stuff in the queue
    } while(i < directoryHandles.length)
  }

  /**
   * Selects a directory for the user.
   * This function reads all the JSON files within a directory and stores them as is within our JS object.
   */
  _.selectDirectory = function() {
    
    // Let the user pick a directory
    showDirectoryPicker({ id: 'default', mode: 'read' })

      // After selecting a folder
      .then(directoryHandle => _.traverseDirectory(directoryHandle))

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