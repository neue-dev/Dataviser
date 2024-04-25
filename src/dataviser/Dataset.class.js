/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-24 17:03:42
 * @ Modified time: 2024-04-25 08:15:50
 * @ Description:
 * 
 * The data set class stores a group of similar data assets.
 * These assets can be dataframes, matrices, arrays or something else.
 */

import d3 from '../libs/d3.v7.min.js'

/**
 * This is a constructor function.
 * It creates a new Dataset object, which holds groups of similar data together.
 * 
 * @param   { function }  keyParser       Parses the file key and extracts data from it. 
 * @param   { object }    assetParsers    Functions that transform the raw data into something we can use to display stuff.
 * @param   { function }  columnParser    A function that derives the columns from the data.
 * @param   { function }  rowParser       A function that derives the rows from the data.
 * @return  { Dataset }                   The created instance.
 */
export function Dataset(keyParser, assetParsers, columnParser, rowParser) {
  this.metadata = {};
  this.assets = {};
  this.assetCount = 0;
  this.columns = {};
  this.rows = {};

  this.keyParser = keyParser || (d => d);
  this.assetParsers = { default: d => d, ...assetParsers };
  this.columnParser = columnParser || (d => Object.keys(d[0]));
  this.rowParser = rowParser || (d => Object.keys(d));

  return this;
}

/**
 * Reads a files contents and adds the files contents to its list of assets.
 * Note that the file must be a JSON file.
 * 
 * @param   { File }      file  The file object we want to read. 
 * @return  { Promise }         A promise for the instance.
 */
Dataset.prototype.readJSON = async function(file) {
  const reader = new FileReader();
  const key = file.name.split('/').at(-1).split('\\').at(-1).split('.').slice(0, -1).join('.');

  return new Promise((resolve, reject) => {
    
    // Note that the filekey above is just the filename minus the extension
    reader.readAsText(file);
    reader.onload = e => {
      this.add(key, JSON.parse(e.target.result))
      resolve(this);
    };
  });
}

/**
 * Adds a new asset object to the current list of assets stored by the dataset.
 * 
 * @param   { string }    key     The key to refer to the asset.
 * @param   { object }    asset   The asset to store.
 * @return  { Dataset }           The current instance.
 */
Dataset.prototype.add = function(key, asset) {
  this.assets[key] = asset;
  this.assetCount++;

  this.addColumns(key);
  this.addRows(key);

  return this;
}

/**
 * Adds columns to the column list from a particular asset.
 * 
 * @param     { string }  assetKey  Which instance to get the column info.
 * @return    { object }            The current instance.
 */
Dataset.prototype.addColumns = function(assetKey) {
  const columns = this.columnParser(this.assets[assetKey]);
  const columnKeys = Object.keys(columns);

  for(let i = 0; i < columnKeys.length; i++)
    if(!(columnKeys[i] in this.columns))
      this.columns[columnKeys[i]] = columns[columnKeys[i]];

  return this;
}

/**
 * Adds rows to the row list from a particular asset.
 * 
 * @param     { string }  assetKey  Which instance to get the row info.
 * @return    { object }            The row instance.
 */
Dataset.prototype.addRows = function(assetKey) {
  const rows = this.rowParser(this.assets[assetKey]);
  const rowKeys = Object.keys(rows);

  for(let i = 0; i < rowKeys.length; i++)
    if(!(rowKeys[i] in this.rows))
      this.rows[rowKeys[i]] = rows[rowKeys[i]];

  return this;
}

/**
 * Gets all the columns present in all the asset data instances.
 * 
 * @return  { object }  An ordinally-indexed object with the column names.
 */
Dataset.prototype.getColumns = function(assetKey) {
  return this.columns;
}

/**
 * Gets all the rows present in all the asset data instances.
 * 
 * @return  { object }  An ordinally-indexed object with the row names.
 */
Dataset.prototype.getRows = function(assetKey) {
  return this.rows;
}

/**
 * Retrieves a particular data asset from the data set.
 * 
 * @param   { string }    key     The key to refer to the asset.
 * @return  { object }            The data asset we were requesting for or null if it doesn't exist.
 */
Dataset.prototype.get = function(key) {
  if(key in this.assets)
    return this.assets[key];
  return null;
}

/**
 * Retrieves the list of data assets in the data set.
 * 
 * @return  { array }   The list of data asset keys.
 */
Dataset.prototype.getList = function(key) {
  return Object.keys(this.assets);
}

/**
 * Adds an asset parser to the ones we have.
 * 
 * @param   { string }    assetParserKey  The key for the asset parser.
 * @param   { function }  assetParser     The function we want to register.
 * @return  { object }                    The current instance.
 */
Dataset.prototype.addParser = function(assetParserKey, assetParser) {
  this.assetParsers[assetParserKey] = assetParser;

  return this;
}

/**
 * Renders the selected data asset as a set of chords.
 * 
 * @param   { string }  key       The asset to render.
 * @param   { object }  options   A set of parameters on how to render the asset.
 */
//! remove m parameter
Dataset.prototype.renderChord = function(key, options={}) {
  
  // This is the parent element
  const canvas = document.getElementsByClassName(options.canvas ?? 'canvas')[0];
  const width = canvas.getBoundingClientRect().width;

  // This is how we transform the raw data into data we can present
  const assetParser = this.assetParsers[options.assetParserKey ?? 'default'];
  const data = assetParser(this.assets[key], options.assetParserOptions ?? {});

  // Define the data structure we use to present the asset
  const chord = d3
    .chord()
    .padAngle(options.padAngle ?? 0.01)
    .sortSubgroups(options.sortOrder ?? d3.descending)
      (data);

      const showTooltip = function(e, d) {
        tooltip
          .style('opacity', 1)
          .style('left', (e.screenX + 15))
          .style('top', (e.screenY - 28))
          .html('From: ' + data.labels[d.source.index] + ' To: ' + data.labels[d.target.index])
      }

      const hideTooltip = function(e, d) {
        tooltip
          .transition()
          .duration(1000)
          .style('opacity', 0)
      }

  // The svg that we draw to
  const svg = d3
    .select(options.canvas ?? '.canvas')
    .append('svg')
      .attr('width', width)
      .style('aspect-ratio', '1')
    .append('g')
      .attr('transform', `translate(${width / 2}, ${width / 2})`);

  svg
    .datum(chord)
    .append('g')
    .selectAll('path')
    .data(function(d) { return d; })
    .enter()
    .append('path')
      .attr('d', d3.ribbon()
        .radius(300)
      )
      .style('fill', '#aa2200')
      .style('stroke', 'transparent')

  svg
    .datum(chord)
    .append('g')
    .selectAll('path')
    .data(function(d) { return d; })
    .enter()
    .append('path')
      .attr('d', d3.ribbon()
        .radius(300)
      )
      .style('fill', '#dd4400')
      .style('stroke', 'transparent')
      .on('mouseover', showTooltip)
      .on('mouseleave', hideTooltip)
      
  svg
    .datum(chord)
    .append('g')
    .selectAll('g')
    .data(function(d) { return d.groups; })
    .enter()
    .append('g')
    .append('path')
      .style('fill', '#ff8800')          
      .style('stroke', 'transparent')
      .attr('d', d3.arc()
        .innerRadius(310)
        .outerRadius(320)
      )

      // Hover tooltip
      const tooltip = d3.select('.canvas')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('display', 'fixed')
}

/**
 * Renders a specific data asset from the data set in the given type of graph.
 * 
 * @param   { string }  key   The asset to render.
 * @param   { string }  type  The type of graph to use for rendering.
 */
Dataset.prototype.render = function(key, type) {
  switch(type) {
    case 'chord':

      break;

    default:

      break;
  }
}

export default {
  Dataset,
}