/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-24 17:03:42
 * @ Modified time: 2024-04-25 10:57:25
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
 * @param   { File }      file      The file object we want to read.
 * @param   { object }    options   Additional options we may want to pass.
 * @return  { Promise }             A promise for the instance.
 */
Dataset.prototype.readJSON = async function(file, options={}) {
  const reader = new FileReader();
  const key = options.name ?? file.name.split('/').at(-1).split('\\').at(-1).split('.').slice(0, -1).join('.');

  // Return a promise for the data
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
 * @param   { string }    key       The asset to render.
 * @param   { object }    options   A set of parameters on how to render the asset.
 * @return  { Dataset }             The current instance.
 */
Dataset.prototype.renderChord = function(key, options={}) {
  
  // This is the parent element
  const canvas = document.getElementsByClassName(options.canvas ?? 'canvas')[0];
  const canvasClass = ('.' + options.canvas) ?? '.canvas';
  const width = canvas.getBoundingClientRect().width;
  const height = width;

  // This is how we transform the raw data into data we can present
  const assetParser = this.assetParsers[options.assetParserKey ?? 'default'];
  const data = assetParser(this.assets[key], options.assetParserOptions ?? {});

  // Define the data structure we use to present the asset
  const chord = d3
    .chord()
    .padAngle(options.padAngle ?? 0.01)
    .sortSubgroups(options.sortOrder ?? d3.descending)
      (data);

  // The svg that we draw to
  const svg = d3
    .select(canvasClass)
    .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('aspect-ratio', '1')
    .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

  // Create the connections between the rims
  svg
    .datum(chord)
    .append('g')
    .selectAll('path')
    .data(d => d)
    .enter()
    .append('path')
      .attr('d', d3
        .ribbon()
        .radius(300))
      .style('fill', '#dd4400')
      .style('stroke', 'transparent')
      .on('mouseover', options.showInfo ?? (e => e))
      .on('mouseleave', options.hideInfo ?? (e => e))
     
  // Create the outer rim
  svg
    .datum(chord)
    .append('g')
    .selectAll('g')
    .data(d => d.groups)
    .enter()
    .append('g')
    .append('path')
      .style('fill', '#ff8800')          
      .style('stroke', 'transparent')
      .attr('d', d3
        .arc()
        .innerRadius(310)
        .outerRadius(320))

  return this;
}

/**
 * Creates a heatmap based on the data.
 * 
 * @param   { string }    key       The data asset we want to render as a heatmap.
 * @param   { object }    options   The options for rendering.
 * @return  { Dataset }             The current instance.
 */
Dataset.prototype.renderHeatmap = function(key, options={}) {
  
  // This is the parent element
  const canvas = document.getElementsByClassName(options.canvas ?? 'canvas')[0];
  const canvasClass = ('.' + options.canvas) ?? '.canvas';
  const width = canvas.getBoundingClientRect().width;
  const height = width;

  // This is how we transform the raw data into data we can present
  const assetParser = this.assetParsers[options.assetParserKey ?? 'default'];
  const data = assetParser(this.assets[key], options.assetParserOptions ?? {});

  var myGroups = d3.map(data, function(d){return d.group;}).keys()
  var myVars = d3.map(data, function(d){return d.variable;}).keys()

  // The svg that we draw to
  const svg = d3
    .select(canvasClass)
    .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('aspect-ratio', '1')
    .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);

  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisBottom(x).tickSize(0))
    .select(canvasClass).remove()

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
    
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(canvasClass).remove()

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

  // add the squares
  svg.selectAll()
    .data(data, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", options.showInfo ?? (e => e))
    .on("mouseleave", options.hideInfo ?? (e => e))

    // Add title to graph
    svg.append("text")
      .attr("x", 0)
      .attr("y", -50)
      .attr("text-anchor", "left")
      .style("font-size", "22px")
      .text("A d3.js heatmap");

    // Add subtitle to graph
    svg.append("text")
      .attr("x", 0)
      .attr("y", -20)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .style("fill", "grey")
      .style("max-width", 320)
      .text("A short description of the take-away message of this chart.");

  return this;
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